import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, ChevronRight } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useInView } from '../../hooks/useInView';

function NewsGrid({ items, formatDate }: { items: any[]; formatDate: (s: string) => string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <Link
          key={item.id}
          to={`/noticias/${item.slug}`}
          className={`card-hover block bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm ${inView ? `animate-fade-in-up delay-${Math.min(i * 80, 500)}` : 'opacity-0'}`}
        >
          {item.image && (
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div className="p-5">
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags?.slice(0, 2).map((tag: string) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#1B3A6B]/10 text-[#1B3A6B] font-medium">{tag}</span>
              ))}
            </div>
            <h3 className="font-display font-semibold text-[#0D2137] uppercase text-base mb-2 leading-tight line-clamp-3">{item.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{item.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{formatDate(item.publishedAt)} · {item.author}</span>
              <div className="flex items-center gap-1">
                <Eye size={11} />
                {item.views.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Noticias() {
  const { news } = useCampaign();
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  const allTags = Array.from(new Set(news.flatMap(n => n.tags || [])));

  const sorted = [...news].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const featured = sorted.filter(n => n.featured);
  const regular = sorted.filter(n => !n.featured);

  const filtered = sorted.filter(n => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase());
    const matchTag = !tag || (n.tags || []).includes(tag);
    return matchSearch && matchTag;
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  return (
    <div>
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">Notícias</h1>
          <p className="text-white/60 text-lg">Acompanhe as últimas novidades da campanha Pedrinho 55555.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + tags */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Buscar notícias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setTag('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!tag ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-[#E2E8F0] hover:bg-gray-50'}`}
            >
              Todas
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setTag(t === tag ? '' : t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${tag === t ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-[#E2E8F0] hover:bg-gray-50'}`}
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Featured */}
          {!search && !tag && featured.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display font-bold text-xl text-[#0D2137] uppercase mb-6">Em Destaque</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featured.slice(0, 2).map(item => (
                  <Link key={item.id} to={`/noticias/${item.slug}`} className="card-hover block bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />}
                    <div className="p-5">
                      <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#F0A500]/10 text-[#F0A500] mb-3">⭐ Destaque</span>
                      <h3 className="font-display font-bold text-[#0D2137] uppercase text-lg mb-2 leading-tight">{item.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{item.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All news */}
          <h2 className="font-display font-bold text-xl text-[#0D2137] uppercase mb-6">
            {search || tag ? `Resultados (${filtered.length})` : 'Todas as Notícias'}
          </h2>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Nenhuma notícia encontrada.</div>
          ) : (
            <NewsGrid items={filtered} formatDate={formatDate} />
          )}
        </div>
      </section>
    </div>
  );
}
