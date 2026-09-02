import { createBrowserRouter } from 'react-router';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import Home from '../pages/public/Home';
import Bio from '../pages/public/Bio';
import Propostas from '../pages/public/Propostas';
import PropostaDetalhe from '../pages/public/PropostaDetalhe';
import Agenda from '../pages/public/Agenda';
import Noticias from '../pages/public/Noticias';
import NoticiaDetalhe from '../pages/public/NoticiaDetalhe';
import Galeria from '../pages/public/Galeria';
import Transparencia from '../pages/public/Transparencia';
import Contato from '../pages/public/Contato';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import GerenciarPropostas from '../pages/admin/GerenciarPropostas';
import GerenciarEventos from '../pages/admin/GerenciarEventos';
import GerenciarNoticias from '../pages/admin/GerenciarNoticias';
import GerenciarGaleria from '../pages/admin/GerenciarGaleria';
import GerenciarDocumentos from '../pages/admin/GerenciarDocumentos';
import GerenciarUsuarios from '../pages/admin/GerenciarUsuarios';
import Apoiadores from '../pages/admin/Apoiadores';

export const router = createBrowserRouter([
  {
    Component: PublicLayout,
    children: [
      { path: '/', Component: Home },
      { path: '/candidato', Component: Bio },
      { path: '/propostas', Component: Propostas },
      { path: '/propostas/:slug', Component: PropostaDetalhe },
      { path: '/agenda', Component: Agenda },
      { path: '/noticias', Component: Noticias },
      { path: '/noticias/:slug', Component: NoticiaDetalhe },
      { path: '/galeria', Component: Galeria },
      { path: '/transparencia', Component: Transparencia },
      { path: '/contato', Component: Contato },
    ],
  },
  { path: '/admin/login', Component: Login },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'dashboard', Component: Dashboard },
      { path: 'propostas', Component: GerenciarPropostas },
      { path: 'eventos', Component: GerenciarEventos },
      { path: 'noticias', Component: GerenciarNoticias },
      { path: 'galeria', Component: GerenciarGaleria },
      { path: 'documentos', Component: GerenciarDocumentos },
      { path: 'usuarios', Component: GerenciarUsuarios },
      { path: 'apoiadores', Component: Apoiadores },
    ],
  },
]);
