<?php
/**
 * Contact form endpoint for the portfolio site.
 *
 * Deployed with the static build (Vite copies public/ into dist/), so it runs
 * on the cPanel host. The Contact page first GETs a signed form token, then
 * POSTs the message as JSON. The message is emailed (HTML + plain text) with
 * PHP mail(), and the sender gets a short acknowledgement email.
 *
 * Defences: signed time token (blocks scripted posts and instant submits),
 * honeypot field, origin check, per-IP rate limit, duplicate suppression,
 * spam scoring, email domain DNS check, optional Cloudflare Turnstile CAPTCHA,
 * strict input typing/validation and header-injection guards.
 */

declare(strict_types=1);

// ---------------------------------------------------------------- settings
const RECIPIENT = 'rajeshkumarb1@gmail.com';
const SITE_NAME = 'Rajesh Kumar Portfolio';
const OWNER_NAME = 'Rajesh Kumar';
const OWNER_ROLE = 'Product Design Lead · UI/UX & Frontend Architect';
const LINKEDIN_URL = 'https://www.linkedin.com/in/rajeshb1';
// Set to your live domain (e.g. 'rajeshkumar.design'). Used for the From address
// and the origin check; when empty, a strictly validated request host is used.
const SITE_DOMAIN = '';
const TOPICS = ['Full-time role', 'Consulting', 'Design system', 'Frontend architecture', 'Something else'];
const MAX_PER_HOUR = 5;          // messages per IP per hour
const MIN_FILL_SECONDS = 3;      // a person needs longer than this to fill the form
const TOKEN_TTL_SECONDS = 7200;  // form token lifetime
const MAX_BODY_BYTES = 20000;
const SPAM_DROP_SCORE = 8;       // silently dropped
const SPAM_FLAG_SCORE = 4;       // delivered, subject marked "[Possible spam]"
const SEND_ACKNOWLEDGEMENT = true; // email the sender a "message received" note
const MAX_ACKS_PER_ADDRESS = 1;  // per 24 h, so the form can't be used to mail-bomb someone
// Optional CAPTCHA: Cloudflare Turnstile (free). Create a widget at dash.cloudflare.com → Turnstile,
// put the secret key in the TURNSTILE_SECRET env var (or here) and the site key in
// VITE_TURNSTILE_SITE_KEY at build time. When the secret is empty the check is skipped.
const TURNSTILE_SECRET = '';
const SPAM_WORDS = [
    'casino', 'viagra', 'cialis', 'crypto', 'bitcoin', 'forex', 'loan', 'betting', 'porn', 'escort',
    'seo services', 'backlinks', 'guest post', 'rank your website', 'web traffic', 'increase sales',
    'dear sir/madam', 'click here', 'unsubscribe', 'whatsapp me', 'telegram',
];
const DISPOSABLE_DOMAINS = [
    'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'maildrop.cc',
    'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'mohmal.com', 'emailondeck.com', 'tempail.com',
];
// Common domain typos (kept in sync with EMAIL_TYPOS in src/components/Contact.tsx).
const EMAIL_TYPOS = [
    'gmial.com' => 'gmail.com', 'gmai.com' => 'gmail.com', 'gmal.com' => 'gmail.com', 'gamil.com' => 'gmail.com',
    'gmail.co' => 'gmail.com', 'gmail.con' => 'gmail.com', 'gmail.cm' => 'gmail.com', 'gnail.com' => 'gmail.com',
    'yaho.com' => 'yahoo.com', 'yahooo.com' => 'yahoo.com', 'yahoo.con' => 'yahoo.com', 'yahoo.co' => 'yahoo.com',
    'hotmial.com' => 'hotmail.com', 'hotmal.com' => 'hotmail.com', 'hotmail.con' => 'hotmail.com',
    'outlok.com' => 'outlook.com', 'outlook.con' => 'outlook.com', 'iclod.com' => 'icloud.com',
    'icloud.con' => 'icloud.com', 'rediffmal.com' => 'rediffmail.com',
];

// ---------------------------------------------------------------- helpers
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function state_dir(): string
{
    // Prefer a private folder outside the web root; fall back to the system temp dir.
    $home = dirname(__DIR__, 2) . '/.portfolio-contact';
    if (is_dir($home) || @mkdir($home, 0700, true)) {
        return $home;
    }
    $tmp = sys_get_temp_dir() . '/portfolio-contact';
    if (!is_dir($tmp)) {
        @mkdir($tmp, 0700, true);
    }
    return $tmp;
}

function secret(): string
{
    $env = getenv('CONTACT_FORM_SECRET');
    if (is_string($env) && strlen($env) >= 32) {
        return $env;
    }
    $file = state_dir() . '/secret.key';
    $key = is_file($file) ? (string) file_get_contents($file) : '';
    if (strlen($key) < 32) {
        $key = bin2hex(random_bytes(32));
        @file_put_contents($file, $key, LOCK_EX);
        @chmod($file, 0600);
    }
    return $key;
}

function b64url(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function make_token(): string
{
    $ts = (string) time();
    $nonce = b64url(random_bytes(9));
    return $ts . '.' . $nonce . '.' . b64url(hash_hmac('sha256', $ts . '.' . $nonce, secret(), true));
}

/** Returns the token age in seconds, or null if the token is missing, forged or expired. */
function token_age($token): ?int
{
    if (!is_string($token) || !preg_match('/^(\d{10})\.([A-Za-z0-9_-]{12})\.([A-Za-z0-9_-]{43})$/', $token, $m)) {
        return null;
    }
    $expected = b64url(hash_hmac('sha256', $m[1] . '.' . $m[2], secret(), true));
    if (!hash_equals($expected, $m[3])) {
        return null;
    }
    $age = time() - (int) $m[1];
    return ($age >= 0 && $age <= TOKEN_TTL_SECONDS) ? $age : null;
}

function site_domain(): string
{
    if (SITE_DOMAIN !== '') {
        return SITE_DOMAIN;
    }
    $host = strtolower((string) ($_SERVER['SERVER_NAME'] ?? $_SERVER['HTTP_HOST'] ?? ''));
    $host = preg_replace('/:\d+$/', '', $host) ?? '';
    // Only plain hostnames: this value ends up in mail headers and the sendmail -f argument.
    if (!preg_match('/^(?=.{1,253}$)([a-z0-9](-?[a-z0-9])*\.)*[a-z0-9](-?[a-z0-9])*$/', $host)) {
        return 'localhost';
    }
    return preg_replace('/^www\./', '', $host) ?? 'localhost';
}

function clean_line(string $value, int $max): string
{
    // Strip control characters (incl. CR/LF) so nothing can be injected into headers.
    $value = preg_replace('/[\x00-\x1F\x7F\x{2028}\x{2029}]+/u', ' ', $value) ?? '';
    return mb_substr(trim(preg_replace('/\s{2,}/u', ' ', $value) ?? ''), 0, $max);
}

function display_name(string $name): string
{
    // Quote ASCII names (so ':' or ',' can't be read as header syntax); encode anything else.
    return preg_match('/^[\x20-\x7E]*$/', $name)
        ? '"' . addcslashes($name, '"\\') . '"'
        : mb_encode_mimeheader($name, 'UTF-8');
}

function spam_score(string $name, string $email, string $company, string $message): int
{
    $score = 0;
    $text = mb_strtolower($name . ' ' . $company . ' ' . $message);

    $links = preg_match_all('~(https?://|www\.)\S+~i', $message);
    $score += max(0, $links - 1) * 3;                                   // one link is fine, many is not
    if (preg_match('~(https?://|www\.|\.com\b|\.ru\b)~i', $name . ' ' . $company)) {
        $score += 6;                                                    // links in name/company fields
    }
    if (preg_match('~\[url=|<a\s+href|\[/link\]~i', $message)) {
        $score += 6;                                                    // BBCode / HTML links
    }
    foreach (SPAM_WORDS as $word) {
        if (strpos($text, $word) !== false) {
            $score += 3;
        }
    }
    $letters = preg_match_all('/\p{L}/u', $message);
    if ($letters < mb_strlen($message) * 0.4) {
        $score += 3;                                                    // mostly symbols/numbers
    }
    if (preg_match('/(.)\1{9,}/u', $message)) {
        $score += 2;                                                    // "!!!!!!!!!!" style padding
    }
    $upper = preg_match_all('/\p{Lu}/u', $message);
    if ($letters > 40 && $upper > $letters * 0.6) {
        $score += 2;                                                    // SHOUTING
    }
    if (strcasecmp($name, $company) === 0 && $company !== '') {
        $score += 1;
    }
    return $score;
}

/** Syntax check stricter than FILTER_VALIDATE_EMAIL alone: ASCII only, sane dots and labels. */
function email_syntax_ok(string $email): bool
{
    if (strlen($email) > 160 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    if (!preg_match('/^[A-Za-z0-9._%+\-]{1,64}@([A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/', $email)) {
        return false;
    }
    [$local] = explode('@', $email, 2);
    return $local[0] !== '.' && substr($local, -1) !== '.' && strpos($local, '..') === false;
}

/** True if the domain can receive mail (MX, or A/AAAA as the RFC 5321 fallback). Fails open on DNS errors. */
function email_domain_ok(string $domain): bool
{
    if (!function_exists('checkdnsrr')) {
        return true;
    }
    return checkdnsrr($domain . '.', 'MX') || checkdnsrr($domain . '.', 'A') || checkdnsrr($domain . '.', 'AAAA');
}

function turnstile_secret(): string
{
    $env = getenv('TURNSTILE_SECRET');
    return is_string($env) && $env !== '' ? $env : TURNSTILE_SECRET;
}

/** Verifies a Cloudflare Turnstile response. Returns true when Turnstile is not configured. */
function turnstile_ok($response, string $ip): bool
{
    $secret = turnstile_secret();
    if ($secret === '') {
        return true;
    }
    if (!is_string($response) || $response === '' || strlen($response) > 2048) {
        return false;
    }
    $payload = http_build_query(['secret' => $secret, 'response' => $response, 'remoteip' => $ip]);
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
        ]);
        $result = curl_exec($ch);
        curl_close($ch);
    } else {
        $result = @file_get_contents($url, false, stream_context_create(['http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $payload,
            'timeout' => 8,
        ]]));
    }
    $json = is_string($result) ? json_decode($result, true) : null;
    return is_array($json) && ($json['success'] ?? false) === true;
}

function site_url(): string
{
    $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    return ($https ? 'https://' : 'http://') . site_domain();
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function first_name(string $name): string
{
    $parts = preg_split('/\s+/u', trim($name)) ?: [$name];
    $first = $parts[0];
    // "RAJESH KUMAR" → "Rajesh"; leave mixed-case names (e.g. "McKenzie") alone.
    if ($first === mb_strtoupper($first) || $first === mb_strtolower($first)) {
        $first = mb_convert_case($first, MB_CASE_TITLE, 'UTF-8');
    }
    return $first;
}

function ist_time(int $ts): string
{
    $dt = new DateTimeImmutable('@' . $ts);
    return $dt->setTimezone(new DateTimeZone('Asia/Kolkata'))->format('D, j M Y · g:i A') . ' IST';
}

/**
 * Shared email shell: table layout and inline styles so it renders in Gmail, Outlook and
 * Apple Mail. $content is trusted HTML built by the callers below (all user input escaped).
 */
function email_layout(string $title, string $preheader, string $content, string $footer): string
{
    $font = "'Google Sans',Roboto,'Segoe UI',Helvetica,Arial,sans-serif";
    return '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">'
        . '<title>' . h($title) . '</title></head>'
        . '<body style="margin:0;padding:0;background:#f1f3f4;-webkit-text-size-adjust:100%;">'
        . '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' . h($preheader)
        . str_repeat('&#8203;&nbsp;', 40) . '</div>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f3f4;">'
        . '<tr><td align="center" style="padding:32px 16px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:' . $font . ';">'
        // Brand bar
        . '<tr><td style="padding:0 4px 16px;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td style="width:36px;height:36px;border-radius:5px;background:#1a73e8;color:#ffffff;font-size:15px;font-weight:700;text-align:center;vertical-align:middle;">RK</td>'
        . '<td style="padding-left:12px;font-size:14px;line-height:18px;color:#1e1f20;"><strong>' . h(OWNER_NAME) . '</strong><br>'
        . '<span style="font-size:12px;color:#6f747a;">' . h(OWNER_ROLE) . '</span></td>'
        . '</tr></table></td></tr>'
        // Card
        . '<tr><td style="background:#ffffff;border-radius:10px;border:1px solid #e3e5e8;overflow:hidden;">'
        . '<div style="height:4px;background:#1a73e8;background-image:linear-gradient(90deg,#1a73e8,#8e5cf0);font-size:0;line-height:0;">&nbsp;</div>'
        . '<div style="padding:32px 32px 28px;">' . $content . '</div>'
        . '</td></tr>'
        // Footer
        . '<tr><td style="padding:20px 8px 0;font-size:12px;line-height:18px;color:#6f747a;text-align:center;">' . $footer . '</td></tr>'
        . '</table></td></tr></table></body></html>';
}

function email_button(string $href, string $label, bool $primary = true): string
{
    $style = $primary
        ? 'background:#0b57d0;color:#ffffff;border:1px solid #0b57d0;'
        : 'background:#ffffff;color:#0b57d0;border:1px solid #d2d5d9;';
    return '<a href="' . h($href) . '" style="' . $style . 'display:inline-block;padding:12px 22px;border-radius:999px;'
        . 'font-size:14px;font-weight:600;line-height:20px;text-decoration:none;">' . h($label) . '</a>';
}

function email_rows(array $rows): string
{
    $html = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">';
    $last = count($rows) - 1;
    foreach (array_values($rows) as $i => [$label, $valueHtml]) {
        $border = $i < $last ? 'border-bottom:1px solid #e3e5e8;' : '';
        $html .= '<tr>'
            . '<td style="' . $border . 'padding:10px 0;width:96px;font-size:13px;color:#6f747a;vertical-align:top;">' . h($label) . '</td>'
            . '<td style="' . $border . 'padding:10px 0;font-size:14px;color:#1e1f20;vertical-align:top;word-break:break-word;">' . $valueHtml . '</td>'
            . '</tr>';
    }
    return $html . '</table>';
}

/** Builds a multipart/alternative message (plain text first, HTML preferred by clients). */
function send_mail(string $to, string $subject, string $text, string $html, array $headers, string $from): bool
{
    $boundary = 'b_' . bin2hex(random_bytes(12));
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
    $headers[] = 'Date: ' . date(DATE_RFC2822);
    $headers[] = 'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . site_domain() . '>';

    $body = "This is a multi-part message in MIME format.\r\n\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text)) . "\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . "\r\n"
        . '--' . $boundary . "--\r\n";

    // $from is built only from a validated hostname, so it is safe as the -f argument.
    return @mail($to, mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers), '-f' . $from);
}

// ---------------------------------------------------------------- request
$method = $_SERVER['REQUEST_METHOD'] ?? '';

// Same-site only: browsers send Origin on POST and cross-site fetches.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $originHost = preg_replace('/^www\./', '', $originHost) ?? '';
    if ($originHost !== site_domain()) {
        respond(403, ['ok' => false, 'error' => 'Forbidden.']);
    }
}

if ($method === 'GET' && isset($_GET['token'])) {
    respond(200, ['ok' => true, 'token' => make_token()]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

if (stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== 0) {
    respond(415, ['ok' => false, 'error' => 'Unsupported content type.']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'Message is too long.']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'Message is too long.']);
}
$data = json_decode($raw, true, 4);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid request.']);
}

// Every field must be a string (rejects arrays/objects used to confuse validation).
foreach (['name', 'email', 'company', 'topic', 'message', 'website', 'token', 'captcha'] as $field) {
    if (isset($data[$field]) && !is_string($data[$field])) {
        respond(400, ['ok' => false, 'error' => 'Invalid request.']);
    }
}

// Honeypot: a hidden field people never fill. Pretend success so bots move on.
if (($data['website'] ?? '') !== '') {
    respond(200, ['ok' => true]);
}

$age = token_age($data['token'] ?? null);
if ($age === null) {
    respond(400, ['ok' => false, 'error' => 'This form has expired. Please reload the page and try again.']);
}
if ($age < MIN_FILL_SECONDS) {
    respond(200, ['ok' => true]);                                       // too fast for a person
}

$name = clean_line($data['name'] ?? '', 100);
$email = clean_line($data['email'] ?? '', 160);
$company = clean_line($data['company'] ?? '', 120);
$topic = clean_line($data['topic'] ?? '', 60);
$message = str_replace(["\r\n", "\r"], "\n", (string) ($data['message'] ?? ''));
$message = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $message) ?? '';
$message = mb_substr(trim($message), 0, 5000);

$errors = [];
if (mb_strlen($name) < 2 || preg_match('/[<>"@]/', $name)) {
    $errors['name'] = 'Please enter your name.';
}
if (!email_syntax_ok($email)) {
    $errors['email'] = 'Please enter a valid email address.';
}
if (preg_match('/[<>]/', $company)) {
    $errors['company'] = 'Please remove < and > from the company name.';
}
if (mb_strlen($message) < 10) {
    $errors['message'] = 'Please write a little more (at least 10 characters).';
}
if (!in_array($topic, TOPICS, true)) {
    $topic = 'Something else';
}
$emailDomain = strtolower((string) substr(strrchr($email, '@') ?: '', 1));
if (!isset($errors['email'])) {
    if (isset(EMAIL_TYPOS[$emailDomain])) {
        $errors['email'] = 'Did you mean @' . EMAIL_TYPOS[$emailDomain] . '?';
    } elseif (in_array($emailDomain, DISPOSABLE_DOMAINS, true)) {
        $errors['email'] = 'Please use a permanent email address so I can reply.';
    } elseif (!email_domain_ok($emailDomain)) {
        $errors['email'] = "That email domain doesn't seem to accept mail — please check it.";
    }
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
}

// Checked after field validation so a typo doesn't burn the single-use CAPTCHA token.
if (!turnstile_ok($data['captcha'] ?? null, (string) ($_SERVER['REMOTE_ADDR'] ?? ''))) {
    respond(400, ['ok' => false, 'error' => 'Please complete the verification check and try again.', 'captcha' => true]);
}

// Per-IP rate limit and duplicate suppression (only hashes are stored, no message content).
$dir = state_dir();
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$now = time();
$bucket = $dir . '/rate-' . hash('sha256', $ip) . '.json';
$hits = is_file($bucket) ? (array) json_decode((string) file_get_contents($bucket), true) : [];
$hits = array_values(array_filter($hits, fn($t) => is_int($t) && $t > $now - 3600));
if (count($hits) >= MAX_PER_HOUR) {
    respond(429, ['ok' => false, 'error' => 'Too many messages from this connection. Please email me directly instead.']);
}

$fingerprint = hash('sha256', mb_strtolower($email . '|' . preg_replace('/\s+/u', ' ', $message)));
$dupes = $dir . '/recent.json';
$recent = is_file($dupes) ? (array) json_decode((string) file_get_contents($dupes), true) : [];
$recent = array_filter($recent, fn($t) => is_int($t) && $t > $now - 86400);
if (isset($recent[$fingerprint])) {
    respond(200, ['ok' => true]);                                       // already delivered once today
}

$score = spam_score($name, $email, $company, $message);
if ($score >= SPAM_DROP_SCORE) {
    respond(200, ['ok' => true]);
}

$from = 'no-reply@' . site_domain();
$flagged = $score >= SPAM_FLAG_SCORE;
$domain = site_domain();
$receivedAt = ist_time($now);
$firstName = first_name($name);
$companyText = $company !== '' ? $company : '—';

// ----- 1. Notification to me
$subject = ($flagged ? '[Possible spam] ' : '') . 'New enquiry · ' . $topic . ' — ' . $name
    . ($company !== '' ? ' (' . $company . ')' : '');
$replyHref = 'mailto:' . $email
    . '?subject=' . rawurlencode('Re: ' . $topic . ' — your message on ' . $domain)
    . '&body=' . rawurlencode("Hi {$firstName},\n\nThanks for getting in touch.\n\n");

$text = implode("\n", [
    'New enquiry from ' . $domain,
    str_repeat('-', 40),
    'Name:     ' . $name,
    'Email:    ' . $email,
    'Company:  ' . $companyText,
    'Topic:    ' . $topic,
    'Received: ' . $receivedAt,
    '',
    $message,
    '',
    str_repeat('-', 40),
    'Spam score ' . $score . ($flagged ? ' (flagged)' : '') . ' · Reply to this email to answer ' . $name . '.',
]);

$content = ($flagged
        ? '<div style="margin:0 0 20px;padding:12px 16px;border-radius:6px;background:#fffbeb;border:1px solid #fde68a;font-size:13px;line-height:20px;color:#92400e;">'
            . '<strong>Possible spam</strong> — this message scored ' . $score . '. Check it before replying.</div>'
        : '')
    . '<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:#eef4fe;color:#0842a0;font-size:12px;font-weight:600;">' . h($topic) . '</span>'
    . '<h1 style="margin:14px 0 6px;font-size:24px;line-height:32px;font-weight:600;color:#1e1f20;">New enquiry from ' . h($name) . '</h1>'
    . '<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#5f6368;">'
    . ($company !== '' ? h($company) . ' · ' : '') . 'Received ' . h($receivedAt) . '</p>'
    . '<div style="margin:0 0 24px;padding:18px 20px;border-radius:7px;background:#f8f9fa;border-left:4px solid #1a73e8;font-size:15px;line-height:24px;color:#1e1f20;word-break:break-word;">'
    . nl2br(h($message), false) . '</div>'
    . email_rows([
        ['Name', h($name)],
        ['Email', '<a href="mailto:' . h($email) . '" style="color:#0b57d0;text-decoration:none;">' . h($email) . '</a>'],
        ['Company', h($companyText)],
        ['Topic', h($topic)],
    ])
    . '<div style="margin-top:28px;">' . email_button($replyHref, 'Reply to ' . $firstName) . '</div>'
    . '<p style="margin:12px 0 0;font-size:12px;line-height:18px;color:#6f747a;">Or just hit reply — it goes straight to ' . h($email) . '.</p>';

$footer = 'Sent from the contact form on <a href="' . h(site_url()) . '" style="color:#6f747a;">' . h($domain) . '</a>'
    . ' · spam score ' . $score . ($score === 0 ? ' (clean)' : '');
$preheader = $name . ': ' . mb_substr(preg_replace('/\s+/u', ' ', $message) ?? '', 0, 110);

$sent = send_mail(
    RECIPIENT,
    $subject,
    $text,
    email_layout($subject, $preheader, $content, $footer),
    [
        'From: ' . display_name(SITE_NAME) . ' <' . $from . '>',
        'Reply-To: ' . display_name($name) . ' <' . $email . '>',
    ],
    $from
);
if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'The message could not be sent right now. Please email me directly.']);
}

// ----- 2. Acknowledgement to the sender
// Only for unflagged messages, at most MAX_ACKS_PER_ADDRESS a day per address, and without
// echoing the message back, so nobody can use the form to deliver their text to a third party.
$ackFile = $dir . '/acks.json';
$ackLog = is_file($ackFile) ? (array) json_decode((string) file_get_contents($ackFile), true) : [];
foreach ($ackLog as $key => $times) {
    $times = is_array($times) ? array_values(array_filter($times, fn($t) => is_int($t) && $t > $now - 86400)) : [];
    if ($times) {
        $ackLog[$key] = $times;
    } else {
        unset($ackLog[$key]);
    }
}
$ackKey = hash('sha256', mb_strtolower($email));

if (SEND_ACKNOWLEDGEMENT && !$flagged && count($ackLog[$ackKey] ?? []) < MAX_ACKS_PER_ADDRESS) {
    $ackSubject = 'Thanks, ' . $firstName . " — I've received your message";
    $steps = [
        ['I read every message myself', 'Your note came straight to my inbox — no bots, no sales team.'],
        ['A personal reply', 'With questions, or a few times for a short call (IST, UTC+5:30).'],
        ['A focused first conversation', '30 minutes on your product, team and what success looks like.'],
    ];

    $ackText = implode("\n", [
        'Hi ' . $firstName . ',',
        '',
        'Thanks for getting in touch through ' . $domain . '. Your message about "' . $topic . '" reached me on '
            . $receivedAt . ", and I'll reply personally to " . $email . '.',
        '',
        'What happens next',
        '1. ' . $steps[0][0] . ' — ' . $steps[0][1],
        '2. ' . $steps[1][0] . ' — ' . $steps[1][1],
        '3. ' . $steps[2][0] . ' — ' . $steps[2][1],
        '',
        'Need to add something? Just reply to this email.',
        '',
        'Best,',
        OWNER_NAME,
        OWNER_ROLE,
        site_url() . ' · ' . LINKEDIN_URL,
        '',
        '--',
        'You received this because ' . $email . ' was entered on the contact form at ' . $domain
            . ". If that wasn't you, ignore this email — you won't hear from me again.",
    ]);

    $stepsHtml = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
    foreach ($steps as $i => [$title, $desc]) {
        $stepsHtml .= '<tr><td style="width:40px;padding:0 0 16px;vertical-align:top;">'
            . '<div style="width:28px;height:28px;border-radius:999px;background:#eef4fe;color:#0842a0;font-size:13px;font-weight:700;line-height:28px;text-align:center;">' . ($i + 1) . '</div></td>'
            . '<td style="padding:3px 0 16px;vertical-align:top;font-size:14px;line-height:21px;color:#1e1f20;"><strong>' . h($title) . '</strong><br>'
            . '<span style="color:#5f6368;">' . h($desc) . '</span></td></tr>';
    }
    $stepsHtml .= '</table>';

    $ackContent = '<div style="width:48px;height:48px;border-radius:999px;background:#f0fdf4;color:#16a34a;font-size:24px;line-height:48px;text-align:center;margin:0 0 18px;">&#10003;</div>'
        . '<h1 style="margin:0 0 10px;font-size:24px;line-height:32px;font-weight:600;color:#1e1f20;">Thanks, ' . h($firstName) . ' — message received</h1>'
        . '<p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#3c4043;">Your message is in my inbox and I&rsquo;ll reply personally to '
        . '<strong style="color:#1e1f20;">' . h($email) . '</strong>.</p>'
        . '<div style="margin:0 0 28px;padding:4px 20px;border-radius:7px;background:#f8f9fa;border:1px solid #e3e5e8;">'
        . email_rows([
            ['Topic', h($topic)],
            ['Sent', h($receivedAt)],
            ['Reply to', h($email)],
        ])
        . '</div>'
        . '<h2 style="margin:0 0 16px;font-size:15px;line-height:22px;font-weight:600;color:#1e1f20;">What happens next</h2>'
        . $stepsHtml
        . '<p style="margin:8px 0 24px;font-size:14px;line-height:22px;color:#3c4043;">Need to add something — a job description, a link, a deadline? Just reply to this email.</p>'
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td style="padding:0 8px 8px 0;">' . email_button(site_url() . '/', 'Browse my work') . '</td>'
        . '<td style="padding:0 0 8px;">' . email_button(LINKEDIN_URL, 'LinkedIn', false) . '</td>'
        . '</tr></table>'
        . '<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e3e5e8;font-size:14px;line-height:21px;color:#3c4043;">Best,<br>'
        . '<strong style="color:#1e1f20;">' . h(OWNER_NAME) . '</strong><br>'
        . '<span style="color:#6f747a;font-size:13px;">' . h(OWNER_ROLE) . ' · Chennai, India</span></p>';

    $ackFooter = 'You received this because ' . h($email) . ' was entered on the contact form at '
        . '<a href="' . h(site_url()) . '" style="color:#6f747a;">' . h($domain) . '</a>.<br>'
        . 'If that wasn&rsquo;t you, just ignore this email — you won&rsquo;t hear from me again.';

    $ackSent = send_mail(
        $email,
        $ackSubject,
        $ackText,
        email_layout($ackSubject, 'Your message about "' . $topic . '" reached me — here’s what happens next.', $ackContent, $ackFooter),
        [
            'From: ' . display_name(OWNER_NAME) . ' <' . $from . '>',
            'Reply-To: ' . display_name(OWNER_NAME) . ' <' . RECIPIENT . '>',
            'Auto-Submitted: auto-replied',   // RFC 3834: stops auto-responder loops
            'X-Auto-Response-Suppress: All',  // Exchange/Outlook: no out-of-office replies
        ],
        $from
    );
    if ($ackSent) {
        $ackLog[$ackKey][] = $now;
        @file_put_contents($ackFile, json_encode($ackLog), LOCK_EX);
    }
}

$hits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);
$recent[$fingerprint] = $now;
@file_put_contents($dupes, json_encode($recent), LOCK_EX);

respond(200, ['ok' => true]);
