import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Briefcase } from 'lucide-react';
import { useNavigation, useSocialLinks, useContactInfo } from '../hooks/useConfig';

interface FooterProps {
  onNavigate: (page: string, slug?: string) => void;
}

const iconMap: Record<string, any> = {
  Linkedin,
  Github,
  Twitter,
  Dribbble: Github,
  Briefcase,
  Behance: Briefcase
};

export default function Footer({ onNavigate }: FooterProps) {
  const navItems = useNavigation();
  const socialLinks = useSocialLinks();
  const contactInfo = useContactInfo();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-white">
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white font-bold text-lg">
                RK
              </span>
              <h3 className="text-lg font-bold">Rajesh Kumar</h3>
            </div>
            <p className="text-ink-400 text-sm leading-relaxed max-w-xs">
              UI/UX Product Designer & UI Developer with 20+ years of experience creating impactful digital experiences.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Navigation</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-ink-300 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-ink-950 rounded"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 text-ink-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 text-ink-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-ink-300 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {contactInfo.location}
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Connect</h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon] || Linkedin;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-ink-800 hover:bg-ink-700 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-ink-950"
                    aria-label={link.platform}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-ink-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-ink-400">
              © {currentYear} Rajesh Kumar. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-ink-400">
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-ink-950 rounded"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-ink-950 rounded"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
