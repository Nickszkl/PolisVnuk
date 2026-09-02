import { useParams, Link, Navigate } from 'react-router';
import { useEffect } from 'react';
import { ArrowLeft, Eye, Share2, ChevronRight, MessageCircle } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useStats } from '../../context/StatsContext';

export default function PropostaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { proposals, categories, candidate } = useCampaign();
  const { trackProposalView, trackShare, trackWhatsApp } = useStats();

  const proposal = proposals.find(p => p.slug === slug);
  const category = proposal ? categories.find(c => c.id === proposal.categoryId) : null;
  const related = proposals.filter(p => p.categoryId === proposal?.categoryId && p.id !== proposal?.id).slice(0, 3);

  useEffect(() => {
    if (proposal) trackProposalView(proposal.id);
  }, [proposal?.id]);

  if (!proposal) return <Navigate to="/propostas" replace />;

  const handleShare = () => {
    trackShare(proposal.id);
    if (navigator.share) {
      navigator.share({ title: proposal.title, text: proposal.summary, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  const handleWhatsApp = () => {
    trackWhatsApp();
    const text = encodeURIComponent(`Veja a proposta "${proposal.title}" do Pedrinho 55555: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="font-display font-bold text-xl text-[#0D2137] uppercase mt-8 mb-3">{line.replace('## ', '')}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="text-gray-600 text-base ml-4 mb-1">{line.replace('- ', '')}</li>;
      if (line === '') return <br key={i} />;
      return <p key={i} className="text-gray-600 leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 relative">
          <Link to="/propostas" className="inline-flex items-center gap-2 text-white/60 hover:text-[#F0A500] text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Voltar às propostas
          </Link>
          {category && (
            <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ background: category.bgColor, color: category.textColor }}>
              {category.icon} {category.name}
            </span>
          )}
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-white uppercase mb-4 leading-tight">{proposal.title}</h1>
          <p className="text-white/70 text-lg">{proposal.summary}</p>
          <div className="flex items-center gap-4 mt-6 text-white/50 text-sm">
            <span className="flex items-center gap-1"><Eye size={14} /> {proposal.views.toLocaleString('pt-BR')} visualizações</span>
            <span>Atualizado em {new Date(proposal.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {proposal.image && (
                <img src={proposal.image} alt={proposal.title} className="w-full h-64 object-cover rounded-2xl mb-8 shadow-sm" />
              )}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                <ul className="list-none">
                  {formatContent(proposal.content)}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                <h3 className="font-display font-bold text-[#0D2137] uppercase mb-4">Compartilhe</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20B858] transition-colors"
                  >
                    <MessageCircle size={16} />
                    Compartilhar no WhatsApp
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-[#1B3A6B] bg-[#1B3A6B]/10 hover:bg-[#1B3A6B]/20 transition-colors"
                  >
                    <Share2 size={16} />
                    Copiar link
                  </button>
                </div>
              </div>

              {/* Candidate card */}
              <div className="bg-[#0D2137] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="number-badge w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-[#0D2137] text-sm">
                    {candidate.number}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm uppercase">{candidate.nickname}</div>
                    <div className="text-white/50 text-xs">{candidate.position}</div>
                  </div>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-4">{candidate.shortBio.slice(0, 120)}...</p>
                <Link to="/candidato" className="text-[#F0A500] text-xs font-semibold hover:underline flex items-center gap-1">
                  Conheça mais <ChevronRight size={12} />
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                  <h3 className="font-display font-bold text-[#0D2137] uppercase mb-4">Propostas Relacionadas</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link key={r.id} to={`/propostas/${r.slug}`} className="block group">
                        <div className="text-sm font-medium text-gray-700 group-hover:text-[#1B3A6B] transition-colors line-clamp-2 leading-snug">{r.title}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
