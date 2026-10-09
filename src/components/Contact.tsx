import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Github, Linkedin, Briefcase, Copy, Check, AlertCircle, Loader2, Clock, ArrowRight } from 'lucide-react';
import { useContactContent } from '../hooks/useContent';
import { useContactInfo, useSocialLinks } from '../hooks/useConfig';

interface ContactProps {
  onNavigate: (page: string, slug?: string) => void;
}

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact.php';
// Optional Cloudflare Turnstile CAPTCHA; also set TURNSTILE_SECRET in public/api/contact.php.
const TURNSTILE_SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';
const MAX_MESSAGE = 5000;

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Field = 'name' | 'email' | 'company' | 'message';

const emptyForm = { name: '', email: '', company: '', topic: '', message: '', website: '' };

// Mirrors the server-side rules in public/api/contact.php
// No leading, trailing or double dots in the local part (written without lookbehind for older Safari).
const EMAIL_PATTERN = /^(?=[^@]{1,64}@)(?=.{1,160}$)[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@([A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

// Common domain typos (kept in sync with EMAIL_TYPOS in public/api/contact.php).
const EMAIL_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'gnail.com': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yahoo.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'iclod.com': 'icloud.com',
  'icloud.con': 'icloud.com', 'rediffmal.com': 'rediffmail.com',
};

/** Returns the corrected address when the domain looks like a typo of a common provider. */
function suggestEmail(email: string): string | null {
  const [local, domain] = email.trim().split('@');
  const fix = domain && EMAIL_TYPOS[domain.toLowerCase()];
  return local && fix ? `${local}@${fix}` : null;
}

function validate(form: typeof emptyForm): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  const email = form.email.trim();
  if (form.name.trim().length < 2 || /[<>"@]/.test(form.name)) errors.name = 'Please enter your name.';
  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address, like name@company.com.';
  if (/[<>]/.test(form.company)) errors.company = 'Please remove < and > from the company name.';
  if (form.message.trim().length < 10) errors.message = 'Please write a little more (at least 10 characters).';
  return errors;
}

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Renders the Turnstile widget when a site key is configured; returns the current response token. */
function useTurnstile(container: React.RefObject<HTMLDivElement | null>, active: boolean) {
  const [token, setToken] = useState('');
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !active || !container.current) return;
    const el = container.current;
    const render = () => {
      if (!window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (window.turnstile) {
      render();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.dataset.turnstile = '';
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
    }
    return () => {
      script?.removeEventListener('load', render);
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
      setToken('');
    };
  }, [container, active]);

  const reset = () => {
    setToken('');
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  return { enabled: !!TURNSTILE_SITE_KEY, token, reset };
}

function useIstTime() {
  const format = () =>
    new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Contact({ onNavigate }: ContactProps) {
  const content = useContactContent();
  const contactInfo = useContactInfo();
  const socialLinks = useSocialLinks();
  const istTime = useIstTime();

  const [form, setForm] = useState({ ...emptyForm, topic: content.topics[0] });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const token = useRef('');
  const successRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const captcha = useTurnstile(captchaRef, status !== 'sent');

  // A signed, time-stamped token from the server proves the form was loaded
  // before it was sent; the server rejects posts without one.
  const loadToken = () => {
    fetch(`${ENDPOINT}?token=1`, { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.token === 'string') token.current = data.token;
      })
      .catch(() => undefined);
  };

  useEffect(loadToken, []);

  const clientErrors = validate(form);
  const emailSuggestion = suggestEmail(form.email);

  // The send button stays disabled until everything the server checks is satisfied;
  // the hint next to it says exactly what is still missing.
  const missing = [
    (clientErrors.name || serverErrors.name) && 'your name',
    (clientErrors.email || serverErrors.email) && 'a valid email',
    !clientErrors.email && emailSuggestion && 'a corrected email domain',
    (clientErrors.company || serverErrors.company) && 'a company name without < or >',
    (clientErrors.message || serverErrors.message) && 'a message (10+ characters)',
    captcha.enabled && !captcha.token && 'the verification check',
  ].filter((item): item is string => !!item);
  const canSend = missing.length === 0;
  const errorFor = (field: Field) => (touched[field] ? clientErrors[field] : undefined) ?? serverErrors[field];

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus();
  }, [status]);

  const update = (field: keyof typeof emptyForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field in serverErrors) setServerErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, company: true, message: true });
    if (Object.keys(clientErrors).length > 0) return;
    if (captcha.enabled && !captcha.token) {
      setErrorMessage('Please complete the verification check above.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email: form.email.trim(), token: token.current, captcha: captcha.token }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus('sent');
        return;
      }
      if (data?.fields) setServerErrors(data.fields);
      if (res.status === 400) loadToken();
      // Turnstile tokens are single-use; field errors (422) are rejected before it is checked.
      if (res.status !== 422) captcha.reset();
      setErrorMessage(data?.error ?? 'The message could not be sent right now.');
      setStatus('error');
    } catch {
      setErrorMessage('The message could not be sent — check your connection and try again.');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setForm({ ...emptyForm, topic: content.topics[0] });
    setTouched({});
    setServerErrors({});
    setStatus('idle');
    loadToken();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  const mailtoFallback = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`Portfolio enquiry: ${form.topic}`)}&body=${encodeURIComponent(form.message)}`;

  const fieldClass = (field?: Field) =>
    `input-field rounded-2xl px-4 py-3 ${field && errorFor(field) ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10' : ''}`;

  return (
    <section className="pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white dark:bg-ink-950 transition-colors duration-500">
      <div className="section-container">
        <header className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium mb-4">
            <Mail className="w-3.5 h-3.5" />
            Contact
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink-900 dark:text-white tracking-tight mb-4">{content.title}</h1>
          <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-[1.7]">{content.description}</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="card-base p-6 sm:p-8">
              {status === 'sent' ? (
                <div ref={successRef} tabIndex={-1} className="py-10 text-center focus:outline-none" role="status">
                  <div className="mx-auto w-16 h-16 rounded-full bg-success-50 dark:bg-success-500/15 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-success-600 dark:text-success-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-ink-900 dark:text-white mb-2">{content.successTitle}</h2>
                  <p className="text-ink-600 dark:text-ink-300 max-w-md mx-auto leading-[1.7] mb-8">
                    {content.successMessage.replace('{email}', form.email)}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={resetForm} className="btn-secondary">Send another message</button>
                    <button type="button" onClick={() => onNavigate('portfolio')} className="btn-primary group">
                      Browse my work
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-ink-900 dark:text-white">{content.formTitle}</h2>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{content.formDescription}</p>
                  </div>

                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 dark:text-white mb-3">{content.topicsLabel}</legend>
                    <div className="flex flex-wrap gap-2">
                      {content.topics.map((topic) => {
                        const selected = form.topic === topic;
                        return (
                          <label
                            key={topic}
                            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full border text-sm font-medium cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-brand-500 ${
                              selected
                                ? 'bg-brand-50 dark:bg-brand-500/15 border-brand-200 dark:border-brand-500/40 text-brand-700 dark:text-brand-200'
                                : 'border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800'
                            }`}
                          >
                            <input type="radio" name="topic" value={topic} checked={selected} onChange={() => update('topic', topic)} className="sr-only" />
                            {selected && <Check className="w-3.5 h-3.5" />}
                            {topic}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-ink-900 dark:text-white mb-1.5">Name</label>
                      <input
                        id="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={!!errorFor('name')}
                        aria-describedby={errorFor('name') ? 'name-error' : undefined}
                        className={fieldClass('name')}
                        placeholder="Your name"
                      />
                      {errorFor('name') && <p id="name-error" className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">{errorFor('name')}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-ink-900 dark:text-white mb-1.5">Email</label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        aria-invalid={!!errorFor('email')}
                        aria-describedby={emailSuggestion || errorFor('email') ? 'email-error' : undefined}
                        spellCheck={false}
                        autoCapitalize="off"
                        className={fieldClass('email')}
                        placeholder="you@company.com"
                      />
                      {emailSuggestion ? (
                        <p id="email-error" className="mt-1.5 text-xs text-ink-600 dark:text-ink-300">
                          Did you mean{' '}
                          <button
                            type="button"
                            onClick={() => update('email', emailSuggestion)}
                            className="font-medium text-brand-600 dark:text-brand-300 underline underline-offset-2"
                          >
                            {emailSuggestion}
                          </button>
                          ?
                        </p>
                      ) : (
                        errorFor('email') && <p id="email-error" className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">{errorFor('email')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-ink-900 dark:text-white mb-1.5">
                      Company <span className="font-normal text-ink-400">(optional)</span>
                    </label>
                    <input
                      id="company"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, company: true }))}
                      aria-invalid={!!errorFor('company')}
                      aria-describedby={errorFor('company') ? 'company-error' : undefined}
                      className={fieldClass('company')}
                      placeholder="Where you work"
                    />
                    {errorFor('company') && <p id="company-error" className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">{errorFor('company')}</p>}
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <label htmlFor="message" className="block text-sm font-medium text-ink-900 dark:text-white">Message</label>
                      <span className="text-xs text-ink-400 tabular-nums">{form.message.length} / {MAX_MESSAGE}</span>
                    </div>
                    <textarea
                      id="message"
                      rows={6}
                      maxLength={MAX_MESSAGE}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                      aria-invalid={!!errorFor('message')}
                      aria-describedby={errorFor('message') ? 'message-error' : undefined}
                      className={`${fieldClass('message')} resize-y min-h-[140px]`}
                      placeholder="A few lines about the role, product or problem you're working on…"
                    />
                    {errorFor('message') && <p id="message-error" className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">{errorFor('message')}</p>}
                  </div>

                  {/* Honeypot: hidden from people, tempting to bots */}
                  <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
                  </div>

                  {captcha.enabled && <div ref={captchaRef} className="min-h-[65px]" />}

                  {status === 'error' && (
                    <div role="alert" className="flex items-start gap-3 p-4 rounded-2xl bg-danger-50 dark:bg-danger-500/10 border border-danger-100 dark:border-danger-500/30">
                      <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-ink-700 dark:text-ink-200">
                        <p>{errorMessage}</p>
                        <p className="mt-1">
                          {content.errorFallback}{' '}
                          <a href={mailtoFallback} className="font-medium text-brand-600 dark:text-brand-300 underline underline-offset-2">{contactInfo.email}</a>.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={!canSend || status === 'sending'}
                      aria-describedby="send-hint"
                      className={`btn-primary h-12 px-8 flex-shrink-0 whitespace-nowrap self-start sm:self-auto ${
                        status === 'sending'
                          ? 'cursor-wait opacity-80'
                          : 'disabled:bg-ink-200 disabled:text-ink-500 disabled:shadow-none disabled:cursor-not-allowed dark:disabled:bg-ink-800 dark:disabled:text-ink-400'
                      }`}
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send message
                        </>
                      )}
                    </button>
                    <p id="send-hint" aria-live="polite" className="text-xs text-ink-500 dark:text-ink-400 leading-[1.6]">
                      {canSend || status === 'sending' ? (
                        "Your details are only used to reply to you. You'll get a confirmation email; nothing is stored on this site."
                      ) : (
                        <>
                          <span className="font-medium text-ink-700 dark:text-ink-200">To send, add </span>
                          {missing.join(', ').replace(/, ([^,]*)$/, ' and $1')}.
                        </>
                      )}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Direct contact & expectations */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="card-base p-6">
              <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-4">Reach me directly</h2>
              <ul className="space-y-1">
                <li className="flex items-center gap-3 py-2">
                  <span className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-[18px] h-[18px] text-brand-600 dark:text-brand-300" />
                  </span>
                  <a href={`mailto:${contactInfo.email}`} className="min-w-0 flex-1 text-sm font-medium text-ink-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-300 truncate">
                    {contactInfo.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                    aria-label="Copy email address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </li>
                <li className="flex items-center gap-3 py-2">
                  <span className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-[18px] h-[18px] text-brand-600 dark:text-brand-300" />
                  </span>
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-sm font-medium text-ink-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-300">
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 py-2">
                  <span className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-[18px] h-[18px] text-brand-600 dark:text-brand-300" />
                  </span>
                  <div className="text-sm">
                    <div className="font-medium text-ink-900 dark:text-white">{contactInfo.location}</div>
                    <div className="text-ink-500 dark:text-ink-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {istTime} local time · IST (UTC+5:30)
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card-base p-6">
              <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-4">{content.nextStepsTitle}</h2>
              <ol className="space-y-4">
                {content.nextSteps.map((step, idx) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-ink-900 dark:text-white">{step.title}</div>
                      <div className="text-sm text-ink-500 dark:text-ink-400 leading-[1.6]">{step.description}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-60 animate-ping" />
                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-success-500" />
                </span>
                <h2 className="text-sm font-semibold text-ink-900 dark:text-white">{content.availabilityStatus}</h2>
              </div>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-[1.7]">{content.availabilityMessage}</p>

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
                  {socialLinks.map((link) => {
                    const Icon = link.icon === 'Github' ? Github : link.icon === 'Linkedin' ? Linkedin : Briefcase;
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-ink-200 dark:border-ink-700 text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {link.platform}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
