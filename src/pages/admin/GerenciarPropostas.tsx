import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Eye, Star } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import type { Proposal } from '../../types';

const empty: Omit<Proposal, 'id'> = {
  title: '', summary: '', content: '', categoryId: '', image: '', views: 0, shares: 0,
  createdAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString().slice(0, 10),
  slug: '', featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function GerenciarPropostas() {
  const { proposals, categories, addProposal, updateProposal, deleteProposal } = useCampaign();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [form, setForm] = useState<Omit<Proposal, 'id'>>(empty);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (p: Proposal) => { setEditing(p); setForm(p); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = () => {
    const data = { ...form, slug: form.slug || slugify(form.title), updatedAt: new Date().toISOString().slice(0, 10) };
    if (editing) updateProposal({ ...data, id: editing.id });
    else addProposal(data);
    closeModal();
  };

  const cat = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Propostas ({proposals.length})</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
          <Plus size={15} /> Nova Proposta
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FC] border-b border-[#E2E8F0]">
              <tr>
                {['Título', 'Categoria', 'Views', 'Destaque', 'Ações'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {proposals.map(p => {
                const c = cat(p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-[#F7F8FC] transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-gray-800 text-sm truncate">{p.title}</div>
                      <div className="text-gray-400 text-xs truncate">{p.summary.slice(0, 60)}...</div>
                    </td>
                    <td className="px-4 py-3">
                      {c && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: c.bgColor, color: c.textColor }}>
                          {c.icon} {c.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye size={12} /> {p.views.toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? <Star size={16} className="text-[#F0A500] fill-[#F0A500]" /> : <Star size={16} className="text-gray-300" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[#0D2137] uppercase">{editing ? 'Editar' : 'Nova'} Proposta</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Título *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} className="input-field" placeholder="Título da proposta" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Categoria *</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="input-field">
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Resumo *</label>
                <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} className="input-field resize-none" placeholder="Resumo curto..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Conteúdo *</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className="input-field resize-none font-mono text-sm" placeholder="Conteúdo completo (suporta ## Título, - item)..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">URL da Imagem</label>
                  <input value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Slug (URL)</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input-field font-mono text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Proposta em destaque</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.title || !form.categoryId || !form.summary} className="flex-1 py-3 rounded-full btn-primary font-bold uppercase text-sm tracking-wide disabled:opacity-50">
                {editing ? 'Salvar alterações' : 'Criar proposta'}
              </button>
              <button onClick={closeModal} className="px-6 py-3 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display font-bold text-[#0D2137] uppercase mb-3">Confirmar exclusão</h3>
            <p className="text-gray-500 text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteProposal(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Excluir</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.input-field { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.75rem; border: 1px solid #E2E8F0; font-size: 0.875rem; outline: none; transition: all 0.15s; } .input-field:focus { border-color: #1B3A6B; box-shadow: 0 0 0 3px rgba(27,58,107,0.08); }`}</style>
    </div>
  );
}
