import { Outlet, Link, useLocation, Navigate } from 'react-router';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, Calendar, Newspaper, Image,
  FolderOpen, Users, Heart, Menu, X, LogOut, ExternalLink,
  ChevronRight, Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampaign } from '../../context/CampaignContext';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Propostas', href: '/admin/propostas', icon: FileText },
  { label: 'Eventos', href: '/admin/eventos', icon: Calendar },
  { label: 'Notícias', href: '/admin/noticias', icon: Newspaper },
  { label: 'Galeria', href: '/admin/galeria', icon: Image },
  { label: 'Documentos', href: '/admin/documentos', icon: FolderOpen },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users },
  { label: 'Apoiadores', href: '/admin/apoiadores', icon: Heart },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { candidate } = useCampaign();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/admin/login" replace />;

  const Sidebar = () => (
    <div className="admin-sidebar h-full flex flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="number-badge w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-[#0D2137] text-sm flex-shrink-0">
            {candidate.number}
          </div>
          <div>
            <div className="font-display font-bold text-white text-base uppercase">{candidate.nickname}</div>
            <div className="text-[#F0A500] text-xs tracking-widest">Painel da Campanha</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#F0A500] text-[#0D2137]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon size={17} />
                  {item.label}
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink size={15} />
          Ver site público
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
        >
          <LogOut size={15} />
          Sair
        </button>
        <div className="px-3 pt-1">
          <p className="text-white/30 text-xs">{user.name}</p>
          <p className="text-white/20 text-xs">{user.role === 'admin' ? 'Administrador' : 'Funcionário'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 fixed top-0 left-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex-shrink-0 animate-slide-in-bottom">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-40">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-semibold text-[#0D2137] text-base uppercase tracking-wide">
              {navItems.find(n => pathname.startsWith(n.href))?.label || 'Painel'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1B3A6B] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user.name[0]}</span>
            </div>
            <span className="hidden sm:block text-sm text-gray-600">{user.name}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
