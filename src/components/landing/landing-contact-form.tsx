import { useRef, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/messages';
import { PUBLIC_CONTACT_API_ORIGIN } from 'astro:env/client';

import styles from './landing-page.module.css';

type ContactCopy = Dictionary['landing']['contact'];
type ContactField = 'name' | 'email' | 'message';
type FieldErrors = Partial<Record<ContactField, string>>;
type Notice = { kind: 'error' | 'success'; message: string };

const producerLimits = {
  email: 254,
  name: 100,
  message: 5000,
  requestBytes: 32768,
} as const;

async function readLocalizedMessage(response: Response) {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string' &&
      body.message.trim().length > 0
    ) {
      return body.message;
    }
  } catch {
    return null;
  }

  return null;
}

export function LandingContactForm({
  copy,
  locale,
}: {
  copy: ContactCopy;
  locale: Locale;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submissionInFlight = useRef(false);

  function handleFieldChange(
    field: ContactField,
    value: string,
    setValue: (next: string) => void,
  ) {
    setValue(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice(null);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;

    setNotice(null);
    const nextErrors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = copy.requiredFields;
    } else if (
      email.length > producerLimits.email ||
      emailRef.current?.validity.typeMismatch
    ) {
      nextErrors.email =
        email.length > producerLimits.email ? copy.tooLong : copy.emailInvalid;
    }

    if (name.length > producerLimits.name) nextErrors.name = copy.tooLong;
    if (!message.trim()) {
      nextErrors.message = copy.messageEmpty;
    } else if (message.length > producerLimits.message) {
      nextErrors.message = copy.tooLong;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    setErrors({});
    const payload = {
      email: trimmedEmail,
      ...(name.trim().length > 0 ? { name } : {}),
      message,
    };
    const body = JSON.stringify(payload);
    if (
      new TextEncoder().encode(body).byteLength > producerLimits.requestBytes
    ) {
      setNotice({ kind: 'error', message: copy.requestTooLarge });
      return;
    }

    submissionInFlight.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        new URL('/contact-requests', PUBLIC_CONTACT_API_ORIGIN),
        {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          redirect: 'error',
          headers: {
            Accept: 'application/json',
            'Accept-Language': locale,
            'Content-Type': 'application/json',
          },
          body,
        },
      );

      if (response.status === 201) {
        setName('');
        setEmail('');
        setMessage('');
        setNotice({ kind: 'success', message: copy.success });
        return;
      }

      if (response.status === 400) {
        setNotice({
          kind: 'error',
          message:
            (await readLocalizedMessage(response)) ?? copy.validationFallback,
        });
        return;
      }

      if (response.status === 413) {
        setNotice({
          kind: 'error',
          message:
            (await readLocalizedMessage(response)) ?? copy.requestTooLarge,
        });
        return;
      }

      if (response.status === 429) {
        setNotice({
          kind: 'error',
          message: (await readLocalizedMessage(response)) ?? copy.rateLimit,
        });
        return;
      }

      setNotice({ kind: 'error', message: copy.submissionError });
    } catch {
      setNotice({ kind: 'error', message: copy.submissionError });
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.contactFormCard} data-contact-form-card>
      <h3 id="contact-form-heading" className={styles.contactFormHeading}>
        {copy.formTitle}
      </h3>
      <p className={styles.contactRequired}>{copy.requiredFields}</p>
      <form
        id="contact-request-form"
        aria-labelledby="contact-form-heading"
        noValidate
        onSubmit={handleSubmit}
      >
        <fieldset disabled={isSubmitting} className={styles.contactFieldset}>
          <legend className="sr-only">{copy.formTitle}</legend>
          <div className={styles.contactFieldGrid}>
            <div className={styles.contactField}>
              <label htmlFor="contact-name" className={styles.contactLabel}>
                {copy.nameLabel}
              </label>
              <input
                ref={nameRef}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={copy.namePlaceholder}
                maxLength={producerLimits.name}
                value={name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? 'contact-name-error' : undefined
                }
                className={styles.contactInput}
                onChange={(event) =>
                  handleFieldChange('name', event.currentTarget.value, setName)
                }
              />
              {errors.name && (
                <p id="contact-name-error" className={styles.contactFieldError}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className={styles.contactField}>
              <label htmlFor="contact-email" className={styles.contactLabel}>
                {copy.emailLabel}
              </label>
              <input
                ref={emailRef}
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={copy.emailPlaceholder}
                maxLength={producerLimits.email}
                required
                value={email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'contact-email-error' : undefined
                }
                className={styles.contactInput}
                onChange={(event) =>
                  handleFieldChange(
                    'email',
                    event.currentTarget.value,
                    setEmail,
                  )
                }
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  className={styles.contactFieldError}
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className={styles.contactField}>
            <label htmlFor="contact-message" className={styles.contactLabel}>
              {copy.messageLabel}
            </label>
            <textarea
              ref={messageRef}
              id="contact-message"
              name="message"
              rows={5}
              placeholder={copy.messagePlaceholder}
              maxLength={producerLimits.message}
              required
              value={message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? 'contact-message-error' : undefined
              }
              className={styles.contactTextarea}
              onChange={(event) =>
                handleFieldChange(
                  'message',
                  event.currentTarget.value,
                  setMessage,
                )
              }
            />
            {errors.message && (
              <p
                id="contact-message-error"
                className={styles.contactFieldError}
              >
                {errors.message}
              </p>
            )}
          </div>
        </fieldset>

        {notice && (
          <p
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className={`${styles.contactFormNotice} ${notice.kind === 'error' ? styles.contactFormNoticeError : styles.contactFormNoticeSuccess}`}
          >
            {notice.message}
          </p>
        )}

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={styles.contactSubmit}
        >
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>
        <p className={styles.contactIntent}>{copy.intent}</p>
      </form>
    </div>
  );
}
