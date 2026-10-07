<?php
/**
 * Contact form endpoint for the portfolio site.
 *
 * Deployed with the static build (Vite copies public/ into dist/), so it runs
 * on the cPanel host. The Contact page first GETs a signed form token, then
 * POSTs the message as JSON. The message is emailed with PHP mail().
 *
 * Defences: signed time token (blocks scripted posts and instant submits),
 * honeypot field, origin check, per-IP rate limit, duplicate suppression,
 * spam scoring, strict input typing/validation and header-injection guards.
 */

declare(strict_types=1);

// ---------------------------------------------------------------- settings
const RECIPIENT = 'rajeshkumarb1@gmail.com';
const SITE_NAME = 'Rajesh Kumar Portfolio';
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
const SPAM_WORDS = [
    'casino', 'viagra', 'cialis', 'crypto', 'bitcoin', 'forex', 'loan', 'betting', 'porn', 'escort',
    'seo services', 'backlinks', 'guest post', 'rank your website', 'web traffic', 'increase sales',
    'dear sir/madam', 'click here', 'unsubscribe', 'whatsapp me', 'telegram',
];
const DISPOSABLE_DOMAINS = [
    'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'maildrop.cc',
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
foreach (['name', 'email', 'company', 'topic', 'message', 'website', 'token'] as $field) {
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
if (
    !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !preg_match('/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/', $email)
) {
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
if (!isset($errors['email']) && in_array($emailDomain, DISPOSABLE_DOMAINS, true)) {
    $errors['email'] = 'Please use a permanent email address so I can reply.';
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
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
$prefix = $score >= SPAM_FLAG_SCORE ? '[Possible spam] ' : '';
$subject = mb_encode_mimeheader($prefix . 'Portfolio enquiry: ' . $topic . ' — ' . $name, 'UTF-8');

$body = implode("\n", [
    'New enquiry from the portfolio site',
    str_repeat('-', 40),
    'Name:    ' . $name,
    'Email:   ' . $email,
    'Company: ' . ($company !== '' ? $company : '—'),
    'Topic:   ' . $topic,
    '',
    $message,
    '',
    str_repeat('-', 40),
    'Sent ' . gmdate('Y-m-d H:i') . ' UTC · spam score ' . $score,
    'Reply directly to this email to answer ' . $name . '.',
]);

$headers = implode("\r\n", [
    'From: ' . display_name(SITE_NAME) . ' <' . $from . '>',
    'Reply-To: ' . display_name($name) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

// $from is built only from a validated hostname, so it is safe as the -f argument.
$sent = @mail(RECIPIENT, $subject, $body, $headers, '-f' . $from);
if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'The message could not be sent right now. Please email me directly.']);
}

$hits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);
$recent[$fingerprint] = $now;
@file_put_contents($dupes, json_encode($recent), LOCK_EX);

respond(200, ['ok' => true]);
