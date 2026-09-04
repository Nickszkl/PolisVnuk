import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Candidate, ProposalCategory, Proposal, CampaignEvent, NewsItem, GalleryItem, Document, SocialLink, AdminUser } from '../types';
import { candidateData, proposalCategories, proposalsData, eventsData, newsData, galleryData, documentsData, socialLinksData, adminUsersData } from '../data/mockData';

interface CampaignContextType {
  candidate: Candidate;
  updateCandidate: (c: Candidate) => void;
  categories: ProposalCategory[];
  setCategories: (cats: ProposalCategory[]) => void;
  proposals: Proposal[];
  addProposal: (p: Omit<Proposal, 'id'>) => void;
  updateProposal: (p: Proposal) => void;
  deleteProposal: (id: string) => void;
  events: CampaignEvent[];
  addEvent: (e: Omit<CampaignEvent, 'id'>) => void;
  updateEvent: (e: CampaignEvent) => void;
  deleteEvent: (id: string) => void;
  news: NewsItem[];
  addNews: (n: Omit<NewsItem, 'id'>) => void;
  updateNews: (n: NewsItem) => void;
  deleteNews: (id: string) => void;
  gallery: GalleryItem[];
  addGalleryItem: (g: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  documents: Document[];
  addDocument: (d: Omit<Document, 'id'>) => void;
  updateDocument: (d: Document) => void;
  deleteDocument: (id: string) => void;
  socialLinks: SocialLink[];
  setSocialLinks: (links: SocialLink[]) => void;
  adminUsers: AdminUser[];
  addAdminUser: (u: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (u: AdminUser) => void;
  deleteAdminUser: (id: string) => void;
}

const CampaignContext = createContext<CampaignContextType | null>(null);
const STORAGE_VERSION_KEY = 'pedrinho_campaign_data_version';
const STORAGE_VERSION = '2026-09-02';

function syncStorageVersion() {
  try {
    const current = localStorage.getItem(STORAGE_VERSION_KEY);
    if (current === STORAGE_VERSION) return;

    const keys = [
      'pedrinho_candidate',
      'pedrinho_categories',
      'pedrinho_proposals',
      'pedrinho_events',
      'pedrinho_news',
      'pedrinho_gallery',
      'pedrinho_documents',
      'pedrinho_social',
      'pedrinho_admin_users',
    ];

    keys.forEach(key => localStorage.removeItem(key));
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  } catch {
    // ignore storage access issues in restricted browser contexts
  }
}

function load<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function CampaignProvider({ children }: { children: ReactNode }) {
  syncStorageVersion();

  const [candidate, setCandidate] = useState<Candidate>(() => {
    const storedCandidate = load('pedrinho_candidate', candidateData);
    const isLegacyCandidatePhoto = storedCandidate.photo.startsWith('blob:https://gemini.google.com/')
      || storedCandidate.photo.includes('media.gazetadopovo.com.br/2025/03/09170035');
    return isLegacyCandidatePhoto
      ? { ...storedCandidate, photo: candidateData.photo }
      : storedCandidate;
  });
  const [categories, setCategories] = useState<ProposalCategory[]>(() => load('pedrinho_categories', proposalCategories));
  const [proposals, setProposals] = useState<Proposal[]>(() => load('pedrinho_proposals', proposalsData));
  const [events, setEvents] = useState<CampaignEvent[]>(() => {
    const storedEvents = load('pedrinho_events', eventsData);
    return storedEvents.map(event => event.title === 'Grande Comício no Ipiranga'
      ? { ...event, image: eventsData.find(defaultEvent => defaultEvent.id === event.id)?.image ?? event.image }
      : event);
  });
  const [news, setNews] = useState<NewsItem[]>(() => load('pedrinho_news', newsData));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => load('pedrinho_gallery', galleryData));
  const [documents, setDocuments] = useState<Document[]>(() => load('pedrinho_documents', documentsData));
  const [socialLinks, setSocialLinksState] = useState<SocialLink[]>(() => load('pedrinho_social', socialLinksData));
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => load('pedrinho_admin_users', adminUsersData));

  useEffect(() => { save('pedrinho_candidate', candidate); }, [candidate]);
  useEffect(() => { save('pedrinho_categories', categories); }, [categories]);
  useEffect(() => { save('pedrinho_proposals', proposals); }, [proposals]);
  useEffect(() => { save('pedrinho_events', events); }, [events]);
  useEffect(() => { save('pedrinho_news', news); }, [news]);
  useEffect(() => { save('pedrinho_gallery', gallery); }, [gallery]);
  useEffect(() => { save('pedrinho_documents', documents); }, [documents]);
  useEffect(() => { save('pedrinho_social', socialLinks); }, [socialLinks]);
  useEffect(() => { save('pedrinho_admin_users', adminUsers); }, [adminUsers]);

  const updateCandidate = (c: Candidate) => setCandidate(c);
  const setSocialLinks = (links: SocialLink[]) => setSocialLinksState(links);

  const addProposal = (p: Omit<Proposal, 'id'>) => setProposals(prev => [...prev, { ...p, id: uid() }]);
  const updateProposal = (p: Proposal) => setProposals(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProposal = (id: string) => setProposals(prev => prev.filter(x => x.id !== id));

  const addEvent = (e: Omit<CampaignEvent, 'id'>) => setEvents(prev => [...prev, { ...e, id: uid() }]);
  const updateEvent = (e: CampaignEvent) => setEvents(prev => prev.map(x => x.id === e.id ? e : x));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(x => x.id !== id));

  const addNews = (n: Omit<NewsItem, 'id'>) => setNews(prev => [...prev, { ...n, id: uid() }]);
  const updateNews = (n: NewsItem) => setNews(prev => prev.map(x => x.id === n.id ? n : x));
  const deleteNews = (id: string) => setNews(prev => prev.filter(x => x.id !== id));

  const addGalleryItem = (g: Omit<GalleryItem, 'id'>) => setGallery(prev => [...prev, { ...g, id: uid() }]);
  const deleteGalleryItem = (id: string) => setGallery(prev => prev.filter(x => x.id !== id));

  const addDocument = (d: Omit<Document, 'id'>) => setDocuments(prev => [...prev, { ...d, id: uid() }]);
  const updateDocument = (d: Document) => setDocuments(prev => prev.map(x => x.id === d.id ? d : x));
  const deleteDocument = (id: string) => setDocuments(prev => prev.filter(x => x.id !== id));

  const addAdminUser = (u: Omit<AdminUser, 'id'>) => setAdminUsers(prev => [...prev, { ...u, id: uid() }]);
  const updateAdminUser = (u: AdminUser) => setAdminUsers(prev => prev.map(x => x.id === u.id ? u : x));
  const deleteAdminUser = (id: string) => setAdminUsers(prev => prev.filter(x => x.id !== id));

  return (
    <CampaignContext.Provider value={{
      candidate, updateCandidate,
      categories, setCategories,
      proposals, addProposal, updateProposal, deleteProposal,
      events, addEvent, updateEvent, deleteEvent,
      news, addNews, updateNews, deleteNews,
      gallery, addGalleryItem, deleteGalleryItem,
      documents, addDocument, updateDocument, deleteDocument,
      socialLinks, setSocialLinks,
      adminUsers, addAdminUser, updateAdminUser, deleteAdminUser,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaign must be used within CampaignProvider');
  return ctx;
}
