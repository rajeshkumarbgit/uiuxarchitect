import { useState, useEffect } from 'react';
import { usePageMetadata } from './hooks/useContent';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedWork from './components/FeaturedWork';
import Portfolio from './components/Portfolio';
import PortfolioDetail from './components/PortfolioDetail';
import CaseStudies from './components/CaseStudies';
import CaseStudyDetail from './components/CaseStudyDetail';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [projectSlug, setProjectSlug] = useState<string>('');
  const [caseStudySlug, setCaseStudySlug] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const metadata = usePageMetadata(currentPage);

  const handleNavigate = (page: string, slug?: string) => {
    setCurrentPage(page);
    if (page === 'portfolio-detail' && slug) {
      setProjectSlug(slug);
    } else if (page === 'case-study-detail' && slug) {
      setCaseStudySlug(slug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.title = metadata.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metadata.description);
    }
  }, [currentPage, metadata]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDetailPage = currentPage === 'portfolio-detail' || currentPage === 'case-study-detail';

  return (
    <div className="min-h-screen bg-white">
      {!isDetailPage && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {!isDetailPage && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      <main>
        {currentPage === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <FeaturedWork onNavigate={handleNavigate} />
          </>
        )}
        {currentPage === 'about' && <About />}
        {currentPage === 'portfolio' && <Portfolio onNavigate={handleNavigate} />}
        {currentPage === 'portfolio-detail' && <PortfolioDetail projectSlug={projectSlug} onNavigate={handleNavigate} />}
        {currentPage === 'case-studies' && <CaseStudies onNavigate={handleNavigate} />}
        {currentPage === 'case-study-detail' && <CaseStudyDetail caseStudySlug={caseStudySlug} onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <Contact onNavigate={handleNavigate} />}
      </main>

      {!isDetailPage && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
