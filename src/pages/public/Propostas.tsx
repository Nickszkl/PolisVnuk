import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Eye, Share2 } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useInView } from '../../hooks/useInView';

function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-4xl mx-auto px-4 text-center relative">
        <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">{title}</h1>
        {subtitle && <p className="text-white/60 text-lg">{subtitle}</p>}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
      </div>
    </section>
  );
}

export default function Propostas() {
  const { proposals, categories } = useCampaign();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { ref, inView } = useInView();

  const filtered = proposals.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <PageHero title="Nossas Propostas" subtitle="Compromissos concretos para transformar São Paulo." />

      <section className="py-12 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Buscar propostas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-[#1B3A6B] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E2E8F0]'}`}
            >
              Todas ({proposals.length})
            </button>
            {categories.map(cat => {
              const count = proposals.filter(p => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? 'text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E2E8F0]'}`}
                  style={activeCategory === cat.id ? { background: cat.color } : {}}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Category description */}
          {activeCategory !== 'all' && (() => {
            const cat = categories.find(c => c.id === activeCategory);
            return cat ? (
              <div className="mb-8 p-5 rounded-2xl border" style={{ background: cat.bgColor, borderColor: cat.color + '33' }}>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h2 className="font-display font-bold uppercase text-xl" style={{ color: cat.textColor }}>{cat.name}</h2>
              </div>
            ) : null;
          })()}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Nenhuma proposta encontrada.</div>
          ) : (
            <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((proposal, i) => {
                const cat = categories.find(c => c.id === proposal.categoryId);
                return (
                  <div
                    key={proposal.id}
                    className={`card-hover bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm ${inView ? `animate-fade-in-up delay-${Math.min(i * 80, 500)}` : 'opacity-0'}`}
                  >
                    {proposal.image && (
                      <div className="h-44 overflow-hidden">
                        <img src={proposal.image} alt={proposal.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      {cat && (
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: cat.bgColor, color: cat.textColor }}>
                          {cat.icon} {cat.name}
                        </span>
                      )}
                      {proposal.featured && (
                        <span className="inline-block ml-2 text-xs font-bold px-3 py-1 rounded-full bg-[#F0A500]/10 text-[#F0A500] mb-3">⭐ Destaque</span>
                      )}
                      <h3 className="font-display font-semibold text-[#0D2137] text-lg uppercase mb-2 leading-tight">{proposal.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">{proposal.summary}</p>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/propostas/${proposal.slug}`}
                          className="inline-flex items-center gap-1 text-[#1B3A6B] text-sm font-semibold hover:text-[#F0A500] transition-colors"
                        >
                          Ler mais <ChevronRight size={14} />
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Eye size={12} />
                          {proposal.views.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
