import { useState, useEffect } from 'react';
import { Menu, X, Download, Calendar, Github } from 'lucide-react';
import { useNavigation, useContactInfo, useSocialLinks } from '../hooks/useConfig';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const navItems = useNavigation();
  const { email } = useContactInfo();
  const socialLinks = useSocialLinks();
  const githubLink = socialLinks.find(s => s.platform === 'GitHub');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded cursor-pointer"
            aria-label="Go to home page"
          >
            RK
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-4 flex items-center space-x-3 pl-4 border-l border-gray-200">
              {githubLink && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Visit GitHub profile"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl cursor-pointer"
                aria-label="Download resume"
              >
                <Download className="w-4 h-4 mr-2" />
                Resume
              </button>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Book a call"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Call
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 flex flex-col space-y-2 border-t border-gray-100 mt-2">
                {githubLink && (
                  <a
                    href={githubLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="inline-flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </button>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
