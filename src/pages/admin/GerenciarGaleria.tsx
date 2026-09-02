import { useState } from 'react';
import { Plus, Trash2, X, Image, Star } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import type { GalleryItem } from '../../types';

const empty: Omit<GalleryItem, 'id'> = {
  url: '', caption: '', type: 'photo', videoUrl: '', createdAt: new Date().toISOString().slice(0, 10), featured: false,
};

export default function GerenciarGaleria() {
  const { gallery, addGalleryItem, deleteGalleryItem } = useCampaign();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(empty);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  const filtered = gallery.filter(g => filter === 'all' || g.type === filter);

  const save = () => {
    if (!form.url) return;
    addGalleryItem(form);
    setModal(false);
    setForm(empty);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Galeria ({gallery.length})</h2>
        <button onClick={() => { setForm(empty); setModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
          <Plus size={15} /> Adicionar
        </button>
      </div>

      <div className="flex gap-2">
        {[['all', 'Todos'], ['photo', 'Fotos'], ['video', 'Vídeos']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v as any)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === v ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-[#E2E8F0] hover:bg-gray-50'}`}>{l}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm aspect-square">
            <img src={item.url + '&w=300&h=300&fit=crop'} alt={item.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
              <p className="text-white text-xs text-center line-clamp-2">{item.caption}</p>
              <button onClick={() => setDeleteConfirm(item.id)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            {item.featured && (
              <div className="absolute top-2 left-2 w-6 h-6 bg-[#F0A500] rounded-full flex items-center justify-center text-xs shadow">⭐</div>
            )}
            {item.type === 'video' && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">▶ Vídeo</div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <Image size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum item nesta categoria.</p>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[#0D2137] uppercase">Adicionar à Galeria</h3>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Tipo</label>
                <div className="flex gap-3">
                  {[['photo', '📸 Foto'], ['video', '🎬 Vídeo']].map(([v, l]) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={form.type === v} onChange={() => setForm(f => ({ ...f, type: v as any }))} />
                      <span className="text-sm">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">URL da imagem *</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              </div>
              {form.url && (
                <div className="rounded-xl overflow-hidden h-40 bg-gray-100">
                  <img src={form.url + '&w=400&h=200&fit=crop'} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Legenda da foto" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Imagem em destaque</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.url} className="flex-1 py-3 rounded-full btn-primary font-bold uppercase text-sm tracking-wide disabled:opacity-50">Adicionar</button>
              <button onClick={() => setModal(false)} className="px-6 py-3 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display font-bold text-[#0D2137] uppercase mb-3">Remover da galeria?</h3>
            <p className="text-gray-500 text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteGalleryItem(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Remover</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
