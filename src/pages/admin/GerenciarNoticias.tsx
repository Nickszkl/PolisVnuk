import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Eye, Star } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import type { NewsItem } from '../../types';

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const empty: Omit<NewsItem, 'id'> = {
  title: '', summary: '', content: '', image: '', publishedAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString().slice(0, 10), slug: '', views: 0, shares: 0, featured: false,
  author: 'Equipe Pedrinho 55555', tags: [],
};

export default function GerenciarNoticias() {
  const { news, addNews, updateNews, deleteNews } = useCampaign();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<Omit<NewsItem, 'id'>>(empty);
  const [tagInput, setTagInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openNew = () => { setEditing(null); setForm(empty); setTagInput(''); setModal(true); };
  const openEdit = (n: NewsItem) => { setEditing(n); setForm(n); setTagInput((n.tags || []).join(', ')); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = () => {
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    const data = { ...form, tags, slug: form.slug || slugify(form.title) };
    if (editing) updateNews({ ...data, id: editing.id });
    else addNews(data);
    closeModal();
  };

  const sorted = [...news].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Notícias ({news.length})</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
          <Plus size={15} /> Nova Notícia
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FC] border-b border-[#E2E8F0]">
              <tr>
                {['Título', 'Data', 'Views', 'Destaque', 'Ações'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sorted.map(n => (
                <tr key={n.id} className="hover:bg-[#F7F8FC] transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-800 text-sm line-clamp-1">{n.title}</div>
                    <div className="text-xs text-gray-400">{n.author}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(n.publishedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye size={12} /> {n.views.toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {n.featured ? <Star size={16} className="text-[#F0A500] fill-[#F0A500]" /> : <Star size={16} className="text-gray-300" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteConfirm(n.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[#0D2137] uppercase">{editing ? 'Editar' : 'Nova'} Notícia</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} placeholder="Título *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} placeholder="Resumo *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B] resize-none" />
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} placeholder="Conteúdo completo *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B] resize-none" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Data de publicação</label>
                  <input type="date" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Autor</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Tags (separadas por vírgula)</label>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="saúde, educação, proposta" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              </div>
              <input value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="URL da imagem" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Notícia em destaque</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.title || !form.summary} className="flex-1 py-3 rounded-full btn-primary font-bold uppercase text-sm tracking-wide disabled:opacity-50">Salvar</button>
              <button onClick={closeModal} className="px-6 py-3 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display font-bold text-[#0D2137] uppercase mb-3">Confirmar exclusão</h3>
            <p className="text-gray-500 text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteNews(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Excluir</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
