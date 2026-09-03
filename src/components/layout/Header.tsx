import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Star } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';

const navLinks = [
  { label: 'Candidato', href: '/candidato' },
  { label: 'Propostas', href: '/propostas' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Transparência', href: '/transparencia' },
  { label: 'Contato', href: '/contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { candidate } = useCampaign();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const headerBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-[#0D2137]/95 backdrop-blur-md shadow-lg shadow-black/20';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex flex-col items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#F0A500]/80 shadow-[0_0_0_2px_rgba(240,165,0,0.2)]"
              />
              <span className="mt-1 font-mono font-bold text-[#F0A500] text-[10px] leading-none">
                {candidate.number}
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-lg leading-tight uppercase tracking-wide">
                {candidate.nickname}
              </div>
              <div className="text-[#F0A500] text-xs font-medium tracking-widest uppercase">
                {candidate.position} · {candidate.partyAcronym}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#F0A500] bg-white/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${candidate.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full btn-gold text-sm font-bold uppercase tracking-wide"
            >
              <Star size={14} />
              Apoie Pedrinho
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(o => !o)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#0D2137] border-t border-white/10 px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#F0A500] bg-white/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={`https://wa.me/${candidate.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full btn-gold text-sm font-bold uppercase tracking-wide"
          >
            <Star size={14} />
            Apoie o Pedrinho
          </a>
        </div>
      </div>
    </header>
  );
}
