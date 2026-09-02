import { Eye, Users, MousePointer, Share2, FileText, Calendar, Newspaper, Heart, TrendingUp, MessageCircle, Star } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useStats } from '../../context/StatsContext';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

function StatCard({ icon: Icon, label, value, color, suffix = '' }: { icon: React.ElementType; label: string; value: number; color: string; suffix?: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1500, inView);
  return (
    <div ref={ref} className={`bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <TrendingUp size={14} className="text-green-500 mt-1" />
      </div>
      <div className="font-mono font-bold text-2xl text-[#0D2137]">
        {count.toLocaleString('pt-BR')}{suffix}
      </div>
      <div className="text-gray-500 text-sm mt-0.5">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { proposals, events, news, gallery, documents, socialLinks } = useCampaign();
  const { stats } = useStats();

  const topProposals = Object.entries(stats.proposalViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, views]) => ({ proposal: proposals.find(p => p.id === id), views }))
    .filter(x => x.proposal);

  const topNews = Object.entries(stats.newsViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, views]) => ({ item: news.find(n => n.id === id), views }))
    .filter(x => x.item);

  const totalSocialClicks = Object.values(stats.socialClicks).reduce((a, b) => a + b, 0);

  const viewDates = Object.entries(stats.viewsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7);

  const maxViews = Math.max(...viewDates.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Visualizações do site" value={stats.pageViews} color="bg-[#1B3A6B]" />
        <StatCard icon={Heart} label="Apoiadores" value={stats.supporters} color="bg-[#F0A500]" />
        <StatCard icon={Share2} label="Compartilhamentos" value={stats.shares} color="bg-[#00875A]" />
        <StatCard icon={MessageCircle} label="Cliques no WhatsApp" value={stats.whatsappClicks} color="bg-[#25D366]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Propostas" value={proposals.length} color="bg-blue-500" />
        <StatCard icon={Calendar} label="Eventos" value={events.length} color="bg-purple-500" />
        <StatCard icon={Newspaper} label="Notícias" value={news.length} color="bg-pink-500" />
        <StatCard icon={MousePointer} label="Cliques nas redes" value={totalSocialClicks} color="bg-indigo-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views by date chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-base mb-5">Visualizações — Últimos 7 dias</h3>
          <div className="flex items-end gap-2 h-32">
            {viewDates.map(([date, views]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-[#1B3A6B] transition-all duration-500 hover:bg-[#F0A500]"
                  style={{ height: `${(views / maxViews) * 100}%`, minHeight: 4 }}
                  title={`${views} views`}
                />
                <div className="text-xs text-gray-400 w-full text-center truncate">
                  {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social clicks */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-base mb-5">Cliques por Rede Social</h3>
          <div className="space-y-3">
            {Object.entries(stats.socialClicks).map(([platform, clicks]) => {
              const total = Object.values(stats.socialClicks).reduce((a, b) => a + b, 1);
              const pct = Math.round((clicks / total) * 100);
              return (
                <div key={platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{platform}</span>
                    <span className="text-gray-500">{clicks.toLocaleString('pt-BR')} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F0A500] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top proposals */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-base mb-5 flex items-center gap-2">
            <Star size={16} className="text-[#F0A500]" />
            Propostas Mais Acessadas
          </h3>
          <div className="space-y-3">
            {topProposals.map(({ proposal, views }, i) => (
              <div key={proposal!.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center text-xs font-bold text-[#1B3A6B]">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 truncate">{proposal!.title}</div>
                </div>
                <div className="text-sm font-bold text-[#F0A500] font-mono">{views.toLocaleString('pt-BR')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top news */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-base mb-5 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00875A]" />
            Notícias Mais Lidas
          </h3>
          <div className="space-y-3">
            {topNews.map(({ item, views }, i) => (
              <div key={item!.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#00875A]/10 flex items-center justify-center text-xs font-bold text-[#00875A]">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 line-clamp-1">{item!.title}</div>
                </div>
                <div className="text-sm font-bold text-[#00875A] font-mono">{views.toLocaleString('pt-BR')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
