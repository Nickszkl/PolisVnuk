import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Shield, User } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useAuth } from '../../context/AuthContext';
import type { AdminUser } from '../../types';

const empty: Omit<AdminUser, 'id'> = {
  name: '', email: '', password: '', role: 'employee', createdAt: new Date().toISOString().slice(0, 10), active: true,
};

export default function GerenciarUsuarios() {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser } = useCampaign();
  const { user: me, isAdmin } = useAuth();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<Omit<AdminUser, 'id'>>(empty);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Shield size={48} className="mb-4 opacity-30" />
        <p className="font-display font-bold uppercase">Acesso restrito a administradores.</p>
      </div>
    );
  }

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (u: AdminUser) => { setEditing(u); setForm(u); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (editing) updateAdminUser({ ...form, id: editing.id });
    else addAdminUser(form);
    closeModal();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Usuários da Equipe ({adminUsers.length})</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
          <Plus size={15} /> Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FC] border-b border-[#E2E8F0]">
              <tr>
                {['Nome', 'E-mail', 'Perfil', 'Status', 'Cadastro', 'Ações'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {adminUsers.map(u => (
                <tr key={u.id} className="hover:bg-[#F7F8FC] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1B3A6B] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{u.name[0]}</span>
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#1B3A6B]/10 text-[#1B3A6B]' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                      {u.role === 'admin' ? 'Administrador' : 'Funcionário'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Edit2 size={14} /></button>
                      {u.id !== me?.id && (
                        <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                      )}
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[#0D2137] uppercase">{editing ? 'Editar' : 'Novo'} Usuário</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="E-mail *" className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editing ? 'Nova senha (deixe vazio para manter)' : 'Senha *'} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]" />
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Perfil</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1B3A6B]">
                  <option value="employee">Funcionário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Usuário ativo</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.name || !form.email || (!editing && !form.password)} className="flex-1 py-3 rounded-full btn-primary font-bold uppercase text-sm tracking-wide disabled:opacity-50">Salvar</button>
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
              <button onClick={() => { deleteAdminUser(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Excluir</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-[#E2E8F0] text-gray-600 font-bold text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
