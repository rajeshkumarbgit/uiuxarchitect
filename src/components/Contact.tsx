/**
 * Contact Component - Fully Dynamic
 * References: REQ-09
 */

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{content.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-900 font-medium hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Phone</div>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-900 font-medium hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Location</div>
                    <div className="text-gray-900 font-medium">{contactInfo.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">{content.quickActionsTitle}</h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex items-center justify-between p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  <span className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">{content.bookCallLabel}</span>
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white">{content.bookCallSubtext}</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="group flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-900 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-gray-900">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">{content.downloadResumeLabel}</span>
                  </span>
                  <span className="text-sm text-gray-600">{content.resumeSubtext}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="group flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-900 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-gray-900">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{content.viewPortfolioLabel}</span>
                  </span>
                  <span className="text-sm text-gray-600">{content.portfolioSubtext}</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">{content.availabilityTitle}</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {content.availabilityMessage}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900">{content.availabilityStatus}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Find Me Online</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon === 'Github' ? Github : link.icon === 'Linkedin' ? Linkedin : link.icon === 'Twitter' ? Twitter : Briefcase;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="p-2.5 bg-gray-100 group-hover:bg-gray-900 rounded-lg transition-colors">
                        <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{link.platform}</div>
                        <div className="text-xs text-gray-500">{link.username}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gray-50 rounded-2xl">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.formTitle}</h3>
                <p className="text-gray-600 text-sm">{content.formDescription}</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-green-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-3">{content.ctaTitle}</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">{content.ctaDescription}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule a Call
            </a>
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
            >
              View My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
