import { useState, useEffect } from 'react';
import { Menu, X, Download, Calendar, Github, Sun, Moon } from 'lucide-react';
import { useNavigation, useContactInfo, useSocialLinks } from '../hooks/useConfig';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const navItems = useNavigation();
  const { email } = useContactInfo();
  const socialLinks = useSocialLinks();
  const githubLink = socialLinks.find(s => s.platform === 'GitHub');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled
          ? 'glass shadow-soft border-b border-ink-100 dark:border-ink-800'
          : 'bg-transparent'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-18 py-4">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-lg p-1"
            aria-label="Go to home page"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold text-lg shadow-soft group-hover:shadow-glow transition-all duration-300">
              RK
            </span>
            <span className={`hidden sm:block text-sm font-semibold transition-colors ${isScrolled ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-white' : 'text-ink-300 group-hover:text-white'}`}>
              Rajesh Kumar
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  currentPage === item.id
                    ? 'text-brand-600 dark:text-brand-400'
                    : isScrolled
                    ? 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-900'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
            ))}

            <div className="ml-3 flex items-center gap-2 pl-3 border-l border-ink-100/50 dark:border-ink-700/50">
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  isScrolled
                    ? 'text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-ink-50 dark:hover:bg-ink-900'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              {githubLink && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    isScrolled
                      ? 'text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-ink-50 dark:hover:bg-ink-900'
                      : 'text-ink-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Visit GitHub profile"
                >
                  <Github className="w-[18px] h-[18px]" />
                </a>
              )}
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className={`inline-flex items-center px-3.5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-lg ${
                  isScrolled
                    ? 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-900'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Resume
              </button>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-ink-950"
              >
                <Calendar className="w-4 h-4 mr-1.5" />
                Book Call
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                isScrolled
                  ? 'text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-900'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                isScrolled
                  ? 'text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-900'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-ink-100 dark:border-ink-800 animate-fade-in glass">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    currentPage === item.id
                      ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400'
                      : 'text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900'
                  }`}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-3 flex flex-col gap-2 border-t border-ink-100 dark:border-ink-800 mt-2">
                {githubLink && (
                  <a
                    href={githubLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-3 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 rounded-xl transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="inline-flex items-center px-4 py-3 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </button>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-xl"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Call
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
