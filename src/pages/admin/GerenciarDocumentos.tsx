import { useState } from 'react';
import { Plus, Edit2, Trash2, X, FileText, Download } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import type { Document } from '../../types';

const empty: Omit<Document, 'id'> = {
  title: '', description: '', url: '#', category: 'candidato', fileType: 'PDF', fileSize: '', uploadedAt: new Date().toISOString().slice(0, 10),
};

const categories = ['candidato', 'financeiro', 'campanha'];

export default function GerenciarDocumentos() {
  const { documents, addDocument, updateDocument, deleteDocument } = useCampaign();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Document | null>(null);
  const [form, setForm] = useState<Omit<Document, 'id'>>(empty);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (d: Document) => { setEditing(d); setForm(d); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (editing) updateDocument({ ...form, id: editing.id });
    else addDocument(form);
    closeModal();
  };

  const catColors: Record<string, string> = { candidato: 'bg-blue-100 text-blue-700', financeiro: 'bg-green-100 text-green-700', campanha: 'bg-purple-100 text-purple-700' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Documentos ({documents.length})</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
          <Plus size={15} /> Novo Documento
        </button>
      </div>

      <div className="space-y-3">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 bg-red-50 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-display font-bold text-[#0D2137] uppercase text-sm">{doc.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${catColors[doc.category] || 'bg-gray-100 text-gray-600'}`}>{doc.category}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">{doc.fileType}</span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-1 mb-1">{doc.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{doc.fileSize}</span>
                <span>{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 transition-colors">
                <Download size={14} />
              </a>
              <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Edit2 size={14} /></button>
              <button onClick={() => setDeleteConfirm(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[#0D2137] uppercase">{editing ? 'Editar' : 'Novo'} Documento</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título do documento *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Descrição" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B] resize-none" />
              <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="URL do documento *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Categoria</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]">
                    {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Tipo</label>
                  <select value={form.fileType} onChange={e => setForm(f => ({ ...f, fileType: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]">
                    {['PDF', 'DOC', 'XLS', 'ZIP'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Tamanho</label>
                  <input value={form.fileSize} onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))} placeholder="1.2 MB" className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Data de upload</label>
                <input type="date" value={form.uploadedAt} onChange={e => setForm(f => ({ ...f, uploadedAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.title || !form.url} className="flex-1 py-3 rounded-full btn-primary font-bold uppercase text-sm tracking-wide disabled:opacity-50">Salvar</button>
              <button onClick={closeModal} className="px-6 py-3 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display font-bold text-[#0D2137] uppercase mb-3">Confirmar exclusão</h3>
            <div className="flex gap-3">
              <button onClick={() => { deleteDocument(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Excluir</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
