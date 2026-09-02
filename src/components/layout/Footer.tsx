import { Link } from 'react-router';
import { Globe, MessageCircle, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useStats } from '../../context/StatsContext';

const socialIcons: Record<string, React.ElementType> = {
  Instagram: Globe,
  Facebook: Globe,
  Twitter: Globe,
  YouTube: Globe,
  TikTok: MessageCircle,
};

export default function Footer() {
  const { candidate, socialLinks } = useCampaign();
  const { trackSocial } = useStats();

  return (
    <footer className="bg-[#0A1E3C] text-white">
      {/* Wave */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #1B3A6B, #F0A500, #00875A, #1B3A6B)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="number-badge w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-[#0D2137] text-lg">
                {candidate.number}
              </div>
              <div>
                <div className="font-display font-bold text-2xl uppercase">{candidate.nickname}</div>
                <div className="text-[#F0A500] text-sm font-medium tracking-widest uppercase">{candidate.position} · {candidate.partyAcronym}</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              {candidate.shortBio}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.filter(s => s.active).map(link => {
                const Icon = socialIcons[link.platform] || ExternalLink;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackSocial(link.platform)}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0A500] hover:text-[#0D2137] transition-all duration-200"
                    title={link.platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-[#F0A500] uppercase tracking-widest text-sm mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { label: 'Candidato', href: '/candidato' },
                { label: 'Propostas', href: '/propostas' },
                { label: 'Agenda', href: '/agenda' },
                { label: 'Notícias', href: '/noticias' },
                { label: 'Galeria', href: '/galeria' },
                { label: 'Transparência', href: '/transparencia' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/60 hover:text-[#F0A500] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-[#F0A500] uppercase tracking-widest text-sm mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Mail size={15} className="mt-0.5 text-[#F0A500] flex-shrink-0" />
                <span>{candidate.email}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={15} className="mt-0.5 text-[#F0A500] flex-shrink-0" />
                <span>{candidate.city}, {candidate.state}</span>
              </li>
              <li>
                <a
                  href={`https://wa.me/${candidate.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full text-sm font-bold text-[#0D2137] bg-[#25D366] hover:bg-[#20B858] transition-colors"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs text-center">
            © 2026 Pedro Henrique Costa · {candidate.party} ({candidate.partyAcronym}) · CNPJ da Campanha: 00.000.000/0001-00
          </p>
          <div className="flex items-center gap-4">
            <Link to="/transparencia" className="text-white/40 hover:text-[#F0A500] text-xs transition-colors">Transparência</Link>
            <Link to="/admin/login" className="text-white/20 hover:text-white/40 text-xs transition-colors">Painel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
