import { useCampaign } from '../../context/CampaignContext';
import { useInView } from '../../hooks/useInView';
import { MapPin, Clock, Calendar, ExternalLink } from 'lucide-react';

const typeColors: Record<string, string> = { comicio: 'bg-red-100 text-red-700 border-red-200', reuniao: 'bg-blue-100 text-blue-700 border-blue-200', debate: 'bg-purple-100 text-purple-700 border-purple-200', caminhada: 'bg-green-100 text-green-700 border-green-200', outro: 'bg-gray-100 text-gray-700 border-gray-200' };
const typeLabels: Record<string, string> = { comicio: 'Comício', reuniao: 'Reunião', debate: 'Debate', caminhada: 'Caminhada', outro: 'Evento' };

function EventRow({ event, index }: { event: any; index: number }) {
  const { ref, inView } = useInView();
  const date = new Date(event.date + 'T00:00:00');
  const isPast = date < new Date();

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row gap-0 bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm card-hover ${isPast ? 'opacity-60' : ''} ${inView ? `animate-fade-in-up delay-${Math.min(index * 100, 500)}` : 'opacity-0'}`}
    >
      {/* Date column */}
      <div className="md:w-28 flex-shrink-0 bg-[#1B3A6B] flex flex-col items-center justify-center p-5 text-white">
        <div className="font-mono font-bold text-3xl leading-none">
          {date.getDate().toString().padStart(2, '0')}
        </div>
        <div className="font-display text-sm uppercase tracking-widest mt-1">
          {date.toLocaleString('pt-BR', { month: 'short' })}
        </div>
        <div className="text-white/50 text-xs">{date.getFullYear()}</div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>{typeLabels[event.type]}</span>
            {isPast && <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">Encerrado</span>}
          </div>
          <h3 className="font-display font-bold text-[#0D2137] uppercase text-xl mb-2">{event.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{event.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} className="text-[#F0A500]" />
              {event.time}{event.endTime ? ` às ${event.endTime}` : ''}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} className="text-[#F0A500]" />
              {event.location}
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="flex flex-col items-end justify-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold btn-primary whitespace-nowrap"
            >
              <ExternalLink size={12} />
              Ver no mapa
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Agenda() {
  const { events } = useCampaign();

  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = events
    .filter(e => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">Agenda de Eventos</h1>
          <p className="text-white/60 text-lg">Encontre o Pedrinho perto de você e participe da campanha.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {upcoming.length > 0 && (
            <div className="mb-14">
              <h2 className="font-display font-bold text-2xl text-[#0D2137] uppercase mb-6 flex items-center gap-2">
                <Calendar size={22} className="text-[#F0A500]" />
                Próximos Eventos
              </h2>
              <div className="space-y-4">
                {upcoming.map((event, i) => <EventRow key={event.id} event={event} index={i} />)}
              </div>
            </div>
          )}

          {upcoming.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <p>Nenhum evento agendado no momento. Fique ligado!</p>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl text-[#0D2137] uppercase mb-6 flex items-center gap-2">
                <Calendar size={22} className="text-gray-400" />
                Eventos Passados
              </h2>
              <div className="space-y-4">
                {past.map((event, i) => <EventRow key={event.id} event={event} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
