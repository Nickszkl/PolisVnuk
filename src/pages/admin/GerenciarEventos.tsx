import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, MapPin } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import type { CampaignEvent } from '../../types';

const empty: Omit<CampaignEvent, 'id'> = {
  title: '', description: '', date: '', time: '', endTime: '', location: '', address: '', image: '', type: 'reuniao', featured: false,
};

const typeLabels: Record<string, string> = { comicio: '🎤 Comício', reuniao: '🤝 Reunião', debate: '🗣️ Debate', caminhada: '🚶 Caminhada', outro: '📌 Outro' };

export default function GerenciarEventos() {
  const { events, addEvent, updateEvent, deleteEvent } = useCampaign();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<CampaignEvent | null>(null);
  const [form, setForm] = useState<Omit<CampaignEvent, 'id'>>(empty);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (e: CampaignEvent) => { setEditing(e); setForm(e); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (editing) updateEvent({ ...form, id: editing.id });
    else addEvent(form);
    closeModal();
  };

  const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Eventos ({events.length})</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
          <Plus size={15} /> Novo Evento
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map(event => {
          const date = new Date(event.date + 'T00:00:00');
          const isPast = date < new Date();
          return (
            <div key={event.id} className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex gap-4 ${isPast ? 'opacity-60' : ''}`}>
              <div className="w-16 h-16 flex-shrink-0 bg-[#1B3A6B] rounded-xl flex flex-col items-center justify-center text-white">
                <div className="font-mono font-bold text-lg leading-none">{date.getDate().toString().padStart(2, '0')}</div>
                <div className="text-xs uppercase">{date.toLocaleString('pt-BR', { month: 'short' })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{typeLabels[event.type]}</span>
                  {isPast && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Passado</span>}
                  {event.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0A500]/10 text-[#F0A500]">⭐ Destaque</span>}
                </div>
                <div className="font-display font-bold text-[#0D2137] uppercase text-sm truncate">{event.title}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {event.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {event.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(event)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(event.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[#0D2137] uppercase">{editing ? 'Editar' : 'Novo'} Evento</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título do evento *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Descrição..." className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B] resize-none" />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Data *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Início *</label>
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Término</label>
                  <input type="time" value={form.endTime || ''} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Tipo</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]">
                  {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Local (nome) *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Endereço completo *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <input value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="URL da imagem" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Evento em destaque</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.title || !form.date || !form.time} className="flex-1 py-3 rounded-full btn-primary font-bold uppercase text-sm tracking-wide disabled:opacity-50">Salvar</button>
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
              <button onClick={() => { deleteEvent(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Excluir</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
