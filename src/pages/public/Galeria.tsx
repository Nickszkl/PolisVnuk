import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Video } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';

export default function Galeria() {
  const { gallery } = useCampaign();
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = gallery.filter(item => filter === 'all' || item.type === filter);

  const prev = () => setLightbox(l => l !== null ? (l - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(l => l !== null ? (l + 1) % filtered.length : null);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">Galeria</h1>
          <p className="text-white/60 text-lg">Momentos marcantes da campanha Pedrinho 55555.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      <section className="py-12 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex justify-center gap-3 mb-10">
            {[['all', '🖼️ Todos', gallery.length], ['photo', '📸 Fotos', gallery.filter(g => g.type === 'photo').length], ['video', '🎬 Vídeos', gallery.filter(g => g.type === 'video').length]].map(([val, label, count]) => (
              <button
                key={val as string}
                onClick={() => setFilter(val as any)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === val ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-[#E2E8F0] hover:bg-gray-50'}`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setLightbox(i)}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.url + '&auto=format'}
                  alt={item.caption}
                  className="w-full block object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs leading-snug">{item.caption}</p>
                  </div>
                </div>
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <Video size={14} className="text-[#1B3A6B]" />
                    </div>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-3 left-3">
                    <div className="w-7 h-7 bg-[#F0A500] rounded-full flex items-center justify-center text-xs">⭐</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Camera size={48} className="mx-auto mb-4 opacity-30" />
              <p>Nenhum item nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
            <ChevronLeft size={24} />
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
            <ChevronRight size={24} />
          </button>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
            <X size={20} />
          </button>
          <div onClick={e => e.stopPropagation()} className="relative max-w-5xl max-h-[80vh] mx-4">
            <img
              src={filtered[lightbox].url + '&w=1200&h=800&fit=crop'}
              alt={filtered[lightbox].caption}
              className="max-h-[75vh] max-w-full object-contain rounded-xl"
            />
            <div className="mt-3 text-center">
              <p className="text-white/80 text-sm">{filtered[lightbox].caption}</p>
              <p className="text-white/40 text-xs mt-1">{lightbox + 1} / {filtered.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
