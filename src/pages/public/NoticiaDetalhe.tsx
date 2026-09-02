import { useParams, Link, Navigate } from 'react-router';
import { useEffect } from 'react';
import { ArrowLeft, Eye, Share2, MessageCircle, Calendar, User } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useStats } from '../../context/StatsContext';

export default function NoticiaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { news, candidate } = useCampaign();
  const { trackNewsView, trackShare, trackWhatsApp } = useStats();

  const item = news.find(n => n.slug === slug);
  const related = news.filter(n => n.id !== item?.id).slice(0, 3);

  useEffect(() => {
    if (item) trackNewsView(item.id);
  }, [item?.id]);

  if (!item) return <Navigate to="/noticias" replace />;

  const handleShare = () => {
    trackShare();
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.summary, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 relative">
          <Link to="/noticias" className="inline-flex items-center gap-2 text-white/60 hover:text-[#F0A500] text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Voltar às notícias
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags?.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#F0A500]/20 text-[#F0A500] font-bold capitalize">#{tag}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-white uppercase mb-4 leading-tight">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
            <span className="flex items-center gap-1.5"><User size={13} />{item.author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={13} />{new Date(item.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Eye size={13} />{item.views.toLocaleString('pt-BR')} leituras</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full h-72 object-cover rounded-2xl mb-8 shadow-sm" />
              )}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                <p className="text-lg text-gray-700 font-medium mb-6 leading-relaxed">{item.summary}</p>
                <hr className="border-[#E2E8F0] mb-6" />
                {item.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                <h3 className="font-display font-bold text-[#0D2137] uppercase mb-4">Compartilhe</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { trackWhatsApp(); window.open(`https://wa.me/?text=${encodeURIComponent(`${item.title} ${window.location.href}`)}`, '_blank'); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20B858] transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
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

              {/* Candidate */}
              <div className="bg-[#0D2137] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="number-badge w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-[#0D2137] text-sm">{candidate.number}</div>
                  <div>
                    <div className="font-display font-bold text-sm uppercase">{candidate.nickname}</div>
                    <div className="text-white/50 text-xs">{candidate.position}</div>
                  </div>
                </div>
                <Link to="/candidato" className="text-[#F0A500] text-xs font-semibold hover:underline">Conheça o candidato →</Link>
              </div>

              {/* Related news */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                  <h3 className="font-display font-bold text-[#0D2137] uppercase mb-4">Outras Notícias</h3>
                  <div className="space-y-4">
                    {related.map(r => (
                      <Link key={r.id} to={`/noticias/${r.slug}`} className="flex gap-3 group">
                        {r.image && <img src={r.image + '&w=80&h=60'} alt={r.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />}
                        <div>
                          <div className="text-xs text-gray-400 mb-1">{new Date(r.publishedAt).toLocaleDateString('pt-BR')}</div>
                          <div className="text-sm text-gray-700 group-hover:text-[#1B3A6B] transition-colors line-clamp-2 font-medium">{r.title}</div>
                        </div>
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
