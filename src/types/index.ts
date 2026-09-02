export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface Candidate {
  name: string;
  nickname: string;
  number: string;
  position: string;
  party: string;
  partyAcronym: string;
  city: string;
  state: string;
  bio: string;
  shortBio: string;
  photo: string;
  slogan: string;
  whatsapp: string;
  email: string;
  birthDate: string;
  birthPlace: string;
  education: string;
  occupation: string;
  trajectory: TimelineItem[];
}

export interface ProposalCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface Proposal {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  image?: string;
  views: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  featured: boolean;
}

export interface CampaignEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address: string;
  image?: string;
  type: 'comicio' | 'reuniao' | 'debate' | 'caminhada' | 'outro';
  featured: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  publishedAt: string;
  updatedAt: string;
  slug: string;
  views: number;
  shares: number;
  featured: boolean;
  author: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  type: 'photo' | 'video';
  videoUrl?: string;
  createdAt: string;
  featured: boolean;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  handle: string;
  active: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  createdAt: string;
  active: boolean;
}

export interface Stats {
  pageViews: number;
  proposalViews: Record<string, number>;
  newsViews: Record<string, number>;
  whatsappClicks: number;
  socialClicks: Record<string, number>;
  shares: number;
  proposalShares: Record<string, number>;
  supporters: number;
  viewsByDate: Record<string, number>;
}
