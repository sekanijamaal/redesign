import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, MapPin, MessageCircle, Phone, Mail } from 'lucide-react';
import {
  BUDGET_OPTIONS,
  BUSINESS,
  SERVICE_OPTIONS,
} from '../data/metalBridgesData';
import type { QuotePrefill } from '../types';

interface QuoteSectionProps {
  prefill: QuotePrefill | null;
}

type Mode = 'project' | 'enquiry';

interface ProjectFields {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  budget: string;
  completionDate: string;
  description: string;
  scope: string;
}

interface EnquiryFields {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactSubject: string;
  contactMessage: string;
}

const EMPTY_PROJECT: ProjectFields = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  service: '',
  budget: '',
  completionDate: '',
  description: '',
  scope: '',
};

const EMPTY_ENQUIRY: EnquiryFields = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactSubject: '',
  contactMessage: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="type-mono mt-1.5 text-[#fff313]" role="alert">
      {message}
    </p>
  );
}

const inputClass =
  'w-full min-h-11 rounded-[6px] border border-[#4b4b4b] bg-[#1a1a1a] px-4 py-2.5 type-body-sm text-[#eeeeee] placeholder:text-[#6f6f6f] transition-colors duration-200 hover:border-[#6f6f6f] focus:border-[#fff313]';
const labelClass = 'type-mono text-[#afafaf]';

export function QuoteSection({ prefill }: QuoteSectionProps) {
  const [mode, setMode] = useState<Mode>('project');
  const [project, setProject] = useState<ProjectFields>(EMPTY_PROJECT);
  const [enquiry, setEnquiry] = useState<EnquiryFields>(EMPTY_ENQUIRY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    if (!prefill) return;
    setProject((current) => ({
      ...current,
      scope: prefill.config,
      service: prefill.serviceValue ?? current.service,
    }));
    setReference(null);
    setMode('project');
  }, [prefill]);

  const set = <K extends keyof ProjectFields>(key: K, value: ProjectFields[K]) => {
    setProject((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const setContact = <K extends keyof EnquiryFields>(key: K, value: EnquiryFields[K]) => {
    setEnquiry((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (mode === 'project') {
      if (!project.fullName.trim()) next.fullName = 'Enter your full name.';
      if (!project.phone.trim()) next.phone = 'Enter a phone number we can reach you on.';
      if (project.email.trim() && !EMAIL_RE.test(project.email.trim())) {
        next.email = 'That email address looks incomplete.';
      }
      if (!project.location.trim()) next.location = 'Tell us where the project is.';
      if (!project.service) next.service = 'Choose the service you need.';
      if (!project.description.trim()) next.description = 'Describe the project briefly.';
    } else {
      if (!enquiry.contactName.trim()) next.contactName = 'Enter your full name.';
      if (!EMAIL_RE.test(enquiry.contactEmail.trim())) {
        next.contactEmail = 'Enter a valid email address.';
      }
      if (!enquiry.contactSubject.trim()) next.contactSubject = 'Add a short subject.';
      if (!enquiry.contactMessage.trim()) next.contactMessage = 'Write your message.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const whatsappHref = useMemo(() => {
    const ref = reference ?? 'MB-000000';
    const lines =
      mode === 'project'
        ? [
            `Reference: ${ref}`,
            `Name: ${project.fullName}`,
            `Phone: ${project.phone}`,
            project.email ? `Email: ${project.email}` : '',
            `Location: ${project.location}`,
            `Service: ${SERVICE_OPTIONS.find((option) => option.value === project.service)?.label ?? project.service}`,
            project.scope ? `Scope: ${project.scope}` : '',
            project.budget
              ? `Budget: ${BUDGET_OPTIONS.find((option) => option.value === project.budget)?.label ?? project.budget}`
              : '',
            project.completionDate ? `Preferred completion: ${project.completionDate}` : '',
            `Project: ${project.description}`,
            photoCount ? `Reference photos: ${photoCount} ready to share` : '',
          ]
        : [
            `Reference: ${ref}`,
            `Name: ${enquiry.contactName}`,
            `Email: ${enquiry.contactEmail}`,
            enquiry.contactPhone ? `Phone: ${enquiry.contactPhone}` : '',
            `Subject: ${enquiry.contactSubject}`,
            `Message: ${enquiry.contactMessage}`,
          ];
    return `${BUSINESS.whatsapp}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
  }, [enquiry, mode, photoCount, project, reference]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    const generated = `MB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setReference(generated);
  };

  const reset = () => {
    setReference(null);
    setProject(EMPTY_PROJECT);
    setEnquiry(EMPTY_ENQUIRY);
    setErrors({});
    setPhotoCount(0);
  };

  return (
    <section
      id="quote"
      className="w-full border-t border-[#4b4b4b]/50 bg-black px-6 py-[120px] md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1360px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <span className="type-mono text-[#fff313]">Project engineering</span>
          <h2 className="type-heading-lg mt-3 max-w-[16ch] text-[#eeeeee]">
            Tell us what you are building.
          </h2>
          <p className="type-body mt-5 max-w-[440px] text-[#afafaf]">
            Send a brief and we will arrange a site measure. Every quotation is itemised:
            material, fabrication, finish, and installation.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex gap-3">
              <MapPin size={17} strokeWidth={1.5} className="mt-1 shrink-0 text-[#fff313]" aria-hidden="true" />
              <div>
                <p className="type-mono text-[#afafaf]">Workshop</p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="type-body-sm mt-1 block max-w-[320px] text-[#eeeeee] underline decoration-[#4b4b4b] underline-offset-4 transition-colors hover:decoration-[#fff313]"
                >
                  {BUSINESS.workshop}
                </a>
                <p className="type-mono mt-2 text-[#afafaf]">{BUSINESS.postalAddress}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone size={17} strokeWidth={1.5} className="mt-1 shrink-0 text-[#fff313]" aria-hidden="true" />
              <div>
                <p className="type-mono text-[#afafaf]">Phone</p>
                <a
                  href={BUSINESS.phoneHref}
                  className="type-body-sm mt-1 block text-[#eeeeee] transition-colors hover:text-[#fff313]"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <MessageCircle size={17} strokeWidth={1.5} className="mt-1 shrink-0 text-[#fff313]" aria-hidden="true" />
              <div>
                <p className="type-mono text-[#afafaf]">WhatsApp</p>
                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="type-body-sm mt-1 block text-[#eeeeee] transition-colors hover:text-[#fff313]"
                >
                  Message the workshop
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail size={17} strokeWidth={1.5} className="mt-1 shrink-0 text-[#fff313]" aria-hidden="true" />
              <div>
                <p className="type-mono text-[#afafaf]">Email</p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="type-body-sm mt-1 block text-[#eeeeee] transition-colors hover:text-[#fff313]"
                >
                  {BUSINESS.email}
                </a>
              </div>
            </div>
          </div>

          <dl className="mt-10 border-t border-[#4b4b4b] pt-5">
            {BUSINESS.hours.map((entry) => (
              <div key={entry.label} className="flex justify-between gap-6 py-1.5">
                <dt className="type-mono text-[#afafaf]">{entry.label}</dt>
                <dd className="type-mono text-[#eeeeee]">{entry.value}</dd>
              </div>
            ))}
          </dl>

          <p className="type-mono mt-8 text-[#afafaf]">
            Founded by {BUSINESS.founder} · {BUSINESS.founderTitle}
          </p>
        </div>

        <div className="rounded-[9px] border border-[#333333] bg-[#111111] p-6 md:p-8">
          {reference ? (
            <div className="rounded-[9px] border border-[#fff313] bg-[#333333] p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#fff313] text-black">
                <Check size={17} strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="type-heading mt-5 text-[#eeeeee]">Brief prepared.</h3>
              <p className="type-body-sm mt-3 max-w-[440px] text-[#afafaf]">
                Your reference is below. Send it to the workshop on WhatsApp and we will
                confirm the site visit.
              </p>
              <p className="type-heading mt-6 tabular-nums text-[#fff313]">{reference}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="type-body-sm inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#eeeeee] px-5 text-black transition-colors hover:bg-[#fff313]"
                >
                  Send on WhatsApp
                  <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a
                  href={BUSINESS.phoneHref}
                  className="type-body-sm inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-[#4b4b4b] px-5 text-[#eeeeee] transition-colors hover:border-[#fff313]"
                >
                  Call {BUSINESS.phoneDisplay}
                </a>
              </div>

              <button
                type="button"
                onClick={reset}
                className="type-body-sm mt-5 border-b border-[#4b4b4b] pb-1 text-[#afafaf] transition-colors hover:border-[#fff313] hover:text-[#fff313]"
              >
                Start another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="flex gap-1 rounded-[6px] bg-[#1a1a1a] p-1">
                <button
                  type="button"
                  onClick={() => setMode('project')}
                  aria-pressed={mode === 'project'}
                  className={`type-body-sm min-h-9 flex-1 rounded-[6px] px-3 transition-colors ${
                    mode === 'project'
                      ? 'bg-[#eeeeee] text-black'
                      : 'text-[#afafaf] hover:text-[#eeeeee]'
                  }`}
                >
                  Project brief
                </button>
                <button
                  type="button"
                  onClick={() => setMode('enquiry')}
                  aria-pressed={mode === 'enquiry'}
                  className={`type-body-sm min-h-9 flex-1 rounded-[6px] px-3 transition-colors ${
                    mode === 'enquiry'
                      ? 'bg-[#eeeeee] text-black'
                      : 'text-[#afafaf] hover:text-[#eeeeee]'
                  }`}
                >
                  General enquiry
                </button>
              </div>

              {mode === 'project' ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className={labelClass}>
                      Full name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={project.fullName}
                      onChange={(event) => set('fullName', event.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.fullName)}
                    />
                    <FieldError message={errors.fullName} />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={project.phone}
                      onChange={(event) => set('phone', event.target.value)}
                      placeholder="0244-044001"
                      autoComplete="tel"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    <FieldError message={errors.phone} />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={project.email}
                      onChange={(event) => set('email', event.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.email)}
                    />
                    <FieldError message={errors.email} />
                  </div>

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      Project location *
                    </label>
                    <input
                      id="location"
                      name="location"
                      value={project.location}
                      onChange={(event) => set('location', event.target.value)}
                      placeholder="e.g. East Legon, Accra"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.location)}
                    />
                    <FieldError message={errors.location} />
                  </div>

                  <div>
                    <label htmlFor="service" className={labelClass}>
                      Type of service *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={project.service}
                      onChange={(event) => set('service', event.target.value)}
                      className={`${inputClass} mt-2 cursor-pointer`}
                      aria-invalid={Boolean(errors.service)}
                    >
                      <option value="">Select a service</option>
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.service} />
                  </div>

                  <div>
                    <label htmlFor="budget" className={labelClass}>
                      Estimated budget (GHS)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={project.budget}
                      onChange={(event) => set('budget', event.target.value)}
                      className={`${inputClass} mt-2 cursor-pointer`}
                    >
                      <option value="">Select a range</option>
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="completionDate" className={labelClass}>
                      Preferred completion date
                    </label>
                    <input
                      id="completionDate"
                      name="completionDate"
                      type="date"
                      value={project.completionDate}
                      onChange={(event) => set('completionDate', event.target.value)}
                      className={`${inputClass} mt-2`}
                    />
                  </div>

                  <div>
                    <label htmlFor="scope" className={labelClass}>
                      Attached scope
                    </label>
                    <input
                      id="scope"
                      name="scope"
                      value={project.scope}
                      onChange={(event) => set('scope', event.target.value)}
                      placeholder="Filled from the estimator"
                      className={`${inputClass} mt-2`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className={labelClass}>
                      Project description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={project.description}
                      onChange={(event) => set('description', event.target.value)}
                      placeholder="Describe your project in detail"
                      className={`${inputClass} mt-2 resize-y`}
                      aria-invalid={Boolean(errors.description)}
                    />
                    <FieldError message={errors.description} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="photos" className={labelClass}>
                      Reference photos
                    </label>
                    <input
                      id="photos"
                      name="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setPhotoCount(event.target.files?.length ?? 0)}
                      className="type-body-sm mt-2 w-full rounded-[6px] border border-[#4b4b4b] bg-[#1a1a1a] px-3 py-2.5 text-[#afafaf] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#333333] file:px-3 file:py-1.5 file:text-[#eeeeee]"
                    />
                    <p className="type-micro mt-2 text-[#6f6f6f]">
                      {photoCount
                        ? `${photoCount} file${photoCount === 1 ? '' : 's'} ready — send them with your brief on WhatsApp.`
                        : 'Photos stay on your device; share them on WhatsApp after preparing the brief.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contactName" className={labelClass}>
                      Full name *
                    </label>
                    <input
                      id="contactName"
                      name="contactName"
                      value={enquiry.contactName}
                      onChange={(event) => setContact('contactName', event.target.value)}
                      placeholder="Your full name"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.contactName)}
                    />
                    <FieldError message={errors.contactName} />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className={labelClass}>
                      Email *
                    </label>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={enquiry.contactEmail}
                      onChange={(event) => setContact('contactEmail', event.target.value)}
                      placeholder="your@email.com"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.contactEmail)}
                    />
                    <FieldError message={errors.contactEmail} />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      value={enquiry.contactPhone}
                      onChange={(event) => setContact('contactPhone', event.target.value)}
                      placeholder="Your phone number"
                      className={`${inputClass} mt-2`}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactSubject" className={labelClass}>
                      Subject *
                    </label>
                    <input
                      id="contactSubject"
                      name="contactSubject"
                      value={enquiry.contactSubject}
                      onChange={(event) => setContact('contactSubject', event.target.value)}
                      placeholder="How can we help?"
                      className={`${inputClass} mt-2`}
                      aria-invalid={Boolean(errors.contactSubject)}
                    />
                    <FieldError message={errors.contactSubject} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contactMessage" className={labelClass}>
                      Message *
                    </label>
                    <textarea
                      id="contactMessage"
                      name="contactMessage"
                      rows={5}
                      value={enquiry.contactMessage}
                      onChange={(event) => setContact('contactMessage', event.target.value)}
                      placeholder="Your message..."
                      className={`${inputClass} mt-2 resize-y`}
                      aria-invalid={Boolean(errors.contactMessage)}
                    />
                    <FieldError message={errors.contactMessage} />
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="type-body-sm inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#eeeeee] px-5 py-3 text-black transition-colors duration-200 hover:bg-[#fff313]"
                >
                  Submit request
                  <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <p className="type-micro max-w-[300px] text-[#6f6f6f]">
                  No account needed. We reply with an itemised quotation after the site
                  measure.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
