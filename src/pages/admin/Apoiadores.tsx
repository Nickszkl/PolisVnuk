import { Heart, TrendingUp, Users, Share2, MessageCircle } from 'lucide-react';
import { useStats } from '../../context/StatsContext';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

function BigStat({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 2000, inView);
  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm text-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="font-mono font-bold text-4xl text-[#0D2137] mb-1">{count.toLocaleString('pt-BR')}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

export default function Apoiadores() {
  const { stats } = useStats();

  const viewDates = Object.entries(stats.viewsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14);

  const maxViews = Math.max(...viewDates.map(([, v]) => v), 1);

  const totalProposalViews = Object.values(stats.proposalViews).reduce((a, b) => a + b, 0);
  const totalNewsViews = Object.values(stats.newsViews).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-[#0D2137] uppercase text-xl">Apoiadores e Estatísticas</h2>

      {/* Big stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BigStat label="Apoiadores" value={stats.supporters} icon={Heart} color="bg-[#F0A500]" />
        <BigStat label="Visualizações" value={stats.pageViews} icon={TrendingUp} color="bg-[#1B3A6B]" />
        <BigStat label="Compartilhamentos" value={stats.shares} icon={Share2} color="bg-[#00875A]" />
        <BigStat label="Cliques WhatsApp" value={stats.whatsappClicks} icon={MessageCircle} color="bg-[#25D366]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Supporters growth visual */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-base mb-5">Crescimento dos Apoiadores</h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              {/* Circular progress */}
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="80" fill="none" stroke="#F0F0F0" strokeWidth="12" />
                <circle
                  cx="90" cy="90" r="80"
                  fill="none"
                  stroke="#F0A500"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - Math.min(stats.supporters / 20000, 1))}`}
                  transform="rotate(-90 90 90)"
                  style={{ transition: 'stroke-dashoffset 2s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono font-bold text-3xl text-[#0D2137]">{stats.supporters.toLocaleString('pt-BR')}</div>
                <div className="text-xs text-gray-400">de 20.000</div>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            Meta: <strong>20.000 apoiadores</strong> — {Math.round((stats.supporters / 20000) * 100)}% concluído
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#F0A500] rounded-full transition-all duration-1000" style={{ width: `${Math.min((stats.supporters / 20000) * 100, 100)}%` }} />
          </div>
        </div>

        {/* Views by period */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-base mb-5">Visualizações por Dia (14 dias)</h3>
          <div className="flex items-end gap-1.5 h-36">
            {viewDates.map(([date, views]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#1B3A6B] hover:bg-[#F0A500] transition-colors cursor-default"
                  style={{ height: `${(views / maxViews) * 100}%`, minHeight: 4 }}
                  title={`${new Date(date).toLocaleDateString('pt-BR')}: ${views} views`}
                />
                <div className="text-[9px] text-gray-400 w-full text-center">
                  {new Date(date).getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-sm mb-4">Engajamento</h3>
          <div className="space-y-3">
            {[
              { label: 'Views de Propostas', value: totalProposalViews },
              { label: 'Views de Notícias', value: totalNewsViews },
              { label: 'Clicks no WhatsApp', value: stats.whatsappClicks },
              { label: 'Compartilhamentos', value: stats.shares },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-bold font-mono text-[#1B3A6B]">{item.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-sm mb-4">Redes Sociais</h3>
          <div className="space-y-3">
            {Object.entries(stats.socialClicks).map(([platform, clicks]) => (
              <div key={platform} className="flex justify-between text-sm">
                <span className="text-gray-600">{platform}</span>
                <span className="font-bold font-mono text-[#1B3A6B]">{clicks.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D2137] rounded-2xl p-6 text-white">
          <h3 className="font-display font-bold uppercase text-sm mb-4 text-[#F0A500]">Resumo da Campanha</h3>
          <div className="space-y-3">
            {[
              { label: 'Total apoiadores', value: stats.supporters.toLocaleString('pt-BR') },
              { label: 'Total visualizações', value: stats.pageViews.toLocaleString('pt-BR') },
              { label: 'Total compartilhamentos', value: stats.shares.toLocaleString('pt-BR') },
              { label: 'Total cliques', value: (stats.whatsappClicks + Object.values(stats.socialClicks).reduce((a, b) => a + b, 0)).toLocaleString('pt-BR') },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-white/60">{item.label}</span>
                <span className="font-bold font-mono text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
