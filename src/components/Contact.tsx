import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Download, Send, CheckCircle, Github, Linkedin, Twitter, Briefcase } from 'lucide-react';
import { useContactContent } from '../hooks/useContent';
import { useContactInfo, useSocialLinks } from '../hooks/useConfig';

interface ContactProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const content = useContactContent();
  const contactInfo = useContactInfo();
  const socialLinks = useSocialLinks();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 mb-4 tracking-tight">{content.title}</h2>
          <p className="text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">{content.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-8">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-ink-900">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-ink-50/60 rounded-xl border border-ink-100">
                  <div className="p-2.5 bg-ink-900 rounded-lg flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-ink-500 mb-0.5">Email</div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm text-ink-900 font-medium hover:text-brand-600 transition-colors truncate block"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-ink-50/60 rounded-xl border border-ink-100">
                  <div className="p-2.5 bg-ink-900 rounded-lg flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-ink-500 mb-0.5">Phone</div>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm text-ink-900 font-medium hover:text-brand-600 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-ink-50/60 rounded-xl border border-ink-100">
                  <div className="p-2.5 bg-ink-900 rounded-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-ink-500 mb-0.5">Location</div>
                    <div className="text-sm text-ink-900 font-medium">{contactInfo.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xl font-bold text-ink-900">{content.quickActionsTitle}</h3>
              <div className="space-y-2.5">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex items-center justify-between p-4 bg-ink-900 text-white rounded-xl hover:bg-ink-800 transition-all hover:shadow-card"
                >
                  <span className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium text-sm">{content.bookCallLabel}</span>
                  </span>
                  <span className="text-xs text-ink-300 group-hover:text-white">{content.bookCallSubtext}</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="group flex items-center justify-between p-4 bg-white border border-ink-200 rounded-xl hover:border-ink-300 hover:bg-ink-50 transition-all w-full text-left"
                >
                  <span className="flex items-center gap-3 text-ink-900">
                    <Download className="w-5 h-5" />
                    <span className="font-medium text-sm">{content.downloadResumeLabel}</span>
                  </span>
                  <span className="text-xs text-ink-500">{content.resumeSubtext}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="group flex items-center justify-between p-4 bg-white border border-ink-200 rounded-xl hover:border-ink-300 hover:bg-ink-50 transition-all w-full text-left"
                >
                  <span className="flex items-center gap-3 text-ink-900">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">{content.viewPortfolioLabel}</span>
                  </span>
                  <span className="text-xs text-ink-500">{content.portfolioSubtext}</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-success-50/60 rounded-xl border border-success-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 bg-success-500 rounded-full animate-pulse" />
                <h4 className="font-bold text-ink-900 text-sm">{content.availabilityTitle}</h4>
              </div>
              <p className="text-ink-600 text-sm leading-relaxed mb-2">
                {content.availabilityMessage}
              </p>
              <span className="text-xs font-medium text-success-700">{content.availabilityStatus}</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-ink-900">Find Me Online</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {socialLinks.map((link) => {
                  const Icon = link.icon === 'Github' ? Github : link.icon === 'Linkedin' ? Linkedin : link.icon === 'Twitter' ? Twitter : Briefcase;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3.5 bg-white border border-ink-200 rounded-xl hover:border-ink-300 transition-all duration-300 hover:shadow-soft"
                    >
                      <div className="p-2 bg-ink-50 group-hover:bg-ink-900 rounded-lg transition-colors">
                        <Icon className="w-4 h-4 text-ink-700 group-hover:text-white transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-ink-900 text-sm">{link.platform}</div>
                        <div className="text-xs text-ink-500 truncate">{link.username}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8 bg-ink-50/60 rounded-2xl border border-ink-100">
              <div>
                <h3 className="text-xl font-bold text-ink-900 mb-1">{content.formTitle}</h3>
                <p className="text-ink-500 text-sm">{content.formDescription}</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink-900 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-900 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-ink-900 mb-1.5">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink-900 mb-1.5">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-ink-900 text-white font-semibold rounded-xl hover:bg-ink-800 transition-all disabled:bg-success-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-gradient-to-br from-ink-900 to-ink-800 text-white rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-3">{content.ctaTitle}</h3>
          <p className="text-ink-300 mb-6 max-w-xl mx-auto leading-relaxed">{content.ctaDescription}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center px-6 py-3 bg-white text-ink-900 font-semibold rounded-xl hover:bg-ink-50 transition-all hover:shadow-card focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink-900"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule a Call
            </a>
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink-900"
            >
              View My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
