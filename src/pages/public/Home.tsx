import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart, Share2, ChevronRight, Calendar, Newspaper, Camera, MapPin, Clock, Star, ArrowRight, Users, FileText, CheckCircle } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useStats } from '../../context/StatsContext';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 2200, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-bold text-4xl lg:text-5xl gradient-text">
        {count.toLocaleString('pt-BR')}{suffix}
      </div>
      <div className="text-white/60 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle, light = false }: { eyebrow: string; title: string; subtitle?: string; light?: boolean }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`text-center max-w-2xl mx-auto mb-12 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full ${light ? 'bg-[#F0A500]/20 text-[#F0A500]' : 'bg-[#1B3A6B]/10 text-[#1B3A6B]'}`}>
        {eyebrow}
      </span>
      <h2 className={`font-display font-bold text-3xl lg:text-4xl uppercase mb-3 ${light ? 'text-white' : 'text-[#0D2137]'}`}>
        {title}
      </h2>
      {subtitle && <p className={`text-base ${light ? 'text-white/60' : 'text-gray-500'}`}>{subtitle}</p>}
    </div>
  );
}

function SupportSection() {
  const { stats, addSupporter, hasSupported, trackShare } = useStats();
  const [justSupported, setJustSupported] = useState(false);
  const [ripple, setRipple] = useState(false);
  const { ref, inView } = useInView();
  const count = useCountUp(stats.supporters, 2000, inView);

  const handleSupport = () => {
    const added = addSupporter();
    if (added) {
      setJustSupported(true);
      setRipple(true);
      setTimeout(() => setRipple(false), 600);
    }
  };

  const handleShare = () => {
    trackShare();
    if (navigator.share) {
      navigator.share({ title: 'Pedrinho 55555', text: 'Eu apoio o Pedrinho! Vote 55555', url: window.location.origin });
    } else {
      navigator.clipboard.writeText(window.location.origin);
    }
  };

  return (
    <section className="py-20 bg-[#0D2137] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F0A500 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1B3A6B 0%, transparent 50%)' }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div ref={ref} className={inView ? 'animate-fade-in-up' : 'opacity-0'}>
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full bg-[#F0A500]/20 text-[#F0A500]">
            Faça parte
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white uppercase mb-4">
            Eu Apoio o <span className="gradient-text">Pedrinho!</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Sem precisar de cadastro. Seu clique conta — mostre que a mudança começa com você.
          </p>

          {/* Counter */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex -space-x-2">
              {[40, 60, 45, 55, 50].map((h, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0D2137] bg-gradient-to-br from-[#F0A500] to-[#E09200] flex items-center justify-center text-[#0D2137] font-bold text-xs">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-2xl text-white">{count.toLocaleString('pt-BR')}</div>
              <div className="text-white/50 text-xs">apoiadores</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSupport}
              disabled={hasSupported}
              className={`relative overflow-hidden flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wide transition-all duration-300 ${
                hasSupported
                  ? 'bg-[#00875A] text-white cursor-default'
                  : 'btn-gold animate-pulse-gold hover:scale-105 active:scale-95'
              }`}
            >
              {ripple && <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />}
              <Heart size={20} className={hasSupported || justSupported ? 'fill-white text-white' : ''} />
              {hasSupported ? '✓ Eu Apoio!' : '#EuSouPedrinho'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wide border-2 border-white/30 text-white hover:border-[#F0A500] hover:text-[#F0A500] transition-all duration-200"
            >
              <Share2 size={20} />
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { candidate, proposals, events, news, categories, socialLinks } = useCampaign();
  const { stats } = useStats();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const heroRef = useInView();
  const statsRef = useInView();

  const filteredProposals = activeCategory === 'all'
    ? proposals.slice(0, 6)
    : proposals.filter(p => p.categoryId === activeCategory).slice(0, 6);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const latestNews = [...news].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3);

  const eventTypeColors: Record<string, string> = {
    comicio: 'bg-red-100 text-red-700',
    reuniao: 'bg-blue-100 text-blue-700',
    debate: 'bg-purple-100 text-purple-700',
    caminhada: 'bg-green-100 text-green-700',
    outro: 'bg-gray-100 text-gray-700',
  };
  const eventTypeLabels: Record<string, string> = {
    comicio: 'Comício', reuniao: 'Reunião', debate: 'Debate', caminhada: 'Caminhada', outro: 'Evento'
  };

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-20">
        {/* Decorative circles */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#F0A500]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#1B3A6B]/30 rounded-full blur-3xl" />
        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div ref={heroRef.ref} className={heroRef.inView ? 'animate-fade-in-left' : 'opacity-0'}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="number-badge px-4 py-2 rounded-full font-mono font-bold text-[#0D2137] text-xl">
                    {candidate.number}
                  </div>
                  <span className="text-[#F0A500] text-sm font-bold uppercase tracking-widest">{candidate.position} · {candidate.partyAcronym}</span>
                </div>

                <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white uppercase leading-none mb-4">
                  Vote no<br />
                  <span className="shimmer-text">{candidate.nickname}!</span>
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-md leading-relaxed">
                  {candidate.shortBio}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/propostas"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full btn-gold font-bold text-base uppercase tracking-wide"
                  >
                    Conheça as propostas
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/candidato"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-base uppercase tracking-wide hover:border-white hover:bg-white/10 transition-all"
                  >
                    Quem é Pedrinho?
                  </Link>
                </div>

                {/* Social quick links */}
                <div className="flex items-center gap-3 mt-8">
                  {socialLinks.filter(s => s.active).slice(0, 4).map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F0A500] hover:text-[#0D2137] text-white flex items-center justify-center transition-all text-xs font-bold"
                      title={link.platform}
                    >
                      {link.platform[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo + badge */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative animate-fade-in-right delay-300">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-[#F0A500]/20 blur-2xl scale-110" />
                {/* Photo frame */}
                <div className="relative w-72 sm:w-80 lg:w-96 rounded-3xl overflow-hidden border-4 border-[#F0A500]/30 shadow-2xl">
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="w-full h-[420px] lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="font-display font-bold text-white text-xl uppercase">{candidate.name}</div>
                    <div className="text-[#F0A500] text-sm">{candidate.position} · {candidate.city}/{candidate.state}</div>
                  </div>
                </div>
                {/* Floating number badge */}
                <div className="absolute -top-4 -right-4 number-badge w-20 h-20 rounded-full flex flex-col items-center justify-center animate-float shadow-xl">
                  <span className="font-mono font-bold text-[#0D2137] text-xs leading-none">Vote</span>
                  <span className="font-mono font-bold text-[#0D2137] text-xl leading-none">{candidate.number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#F7F8FC"/>
          </svg>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#0D2137] py-12" ref={statsRef.ref}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter value={stats.supporters} label="Apoiadores" />
            <StatCounter value={proposals.length} label="Propostas" />
            <StatCounter value={events.length} label="Eventos" />
            <StatCounter value={stats.pageViews} label="Visualizações" />
          </div>
        </div>
      </section>

      {/* ── Bio preview ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <BioImagePanel candidate={candidate} />
            {/* Text side */}
            <BioTextPanel candidate={candidate} />
          </div>
        </div>
      </section>

      {/* ── Proposals ── */}
      <section className="py-24 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Compromissos" title="Nossas Propostas" subtitle="Soluções concretas para os desafios de São Paulo." />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#E2E8F0]'}`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#E2E8F0]'}`}
                style={activeCategory === cat.id ? { background: cat.color } : {}}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProposals.map((proposal, i) => {
              const cat = categories.find(c => c.id === proposal.categoryId);
              return (
                <ProposalCard key={proposal.id} proposal={proposal} category={cat} index={i} />
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/propostas" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
              Ver todas as propostas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Agenda" title="Próximos Eventos" subtitle="Encontre o Pedrinho perto de você." />
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} formatDate={formatDate} eventTypeColors={eventTypeColors} eventTypeLabels={eventTypeLabels} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/agenda" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
              Ver agenda completa <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── News ── */}
      <section className="py-24 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Imprensa" title="Últimas Notícias" subtitle="Acompanhe as ações e conquistas da campanha." />
          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} formatDate={formatDate} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/noticias" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
              Ver todas as notícias <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Support CTA ── */}
      <SupportSection />

      {/* ── Gallery Preview ── */}
      <GalleryPreview />
    </div>
  );
}

function BioImagePanel({ candidate }: { candidate: any }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`relative ${inView ? 'animate-fade-in-left' : 'opacity-0'}`}>
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-4 border-[#F0A500]/20" />
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&h=500&fit=crop&auto=format"
          alt="Pedrinho com moradores"
          className="relative rounded-3xl w-full h-80 object-cover shadow-xl"
        />
      </div>
      <div className="absolute -bottom-6 -right-6 bg-[#1B3A6B] text-white rounded-2xl p-5 shadow-xl">
        <div className="font-display font-bold text-3xl">{new Date().getFullYear() - 2003}+</div>
        <div className="text-white/60 text-sm">anos de serviço público</div>
      </div>
    </div>
  );
}

function BioTextPanel({ candidate }: { candidate: any }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={inView ? 'animate-fade-in-right' : 'opacity-0'}>
      <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-[#1B3A6B]/10 text-[#1B3A6B]">
        Conheça o candidato
      </span>
      <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#0D2137] uppercase mb-4">
        Quem é o <span className="gradient-text">{candidate.nickname}?</span>
      </h2>
      <p className="text-gray-600 leading-relaxed mb-6">{candidate.shortBio}</p>
      <div className="space-y-3 mb-8">
        {[
          { icon: CheckCircle, text: `${candidate.education.split('|')[0].trim()}` },
          { icon: CheckCircle, text: `Fundador do Instituto Renovar SP` },
          { icon: CheckCircle, text: `+3.000 famílias beneficiadas` },
          { icon: CheckCircle, text: `Nascido e criado em ${candidate.city}` },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-gray-700">
            <item.icon size={18} className="text-[#00875A] flex-shrink-0" />
            <span className="text-sm">{item.text}</span>
          </div>
        ))}
      </div>
      <Link to="/candidato" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
        Saiba mais sobre Pedrinho <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function ProposalCard({ proposal, category, index }: { proposal: any; category: any; index: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`card-hover bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm ${inView ? `animate-fade-in-up delay-${Math.min(index * 100, 400)}` : 'opacity-0'}`}
    >
      {proposal.image && (
        <div className="h-44 overflow-hidden">
          <img src={proposal.image} alt={proposal.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
      )}
      <div className="p-5">
        {category && (
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: category.bgColor, color: category.textColor }}>
            {category.icon} {category.name}
          </span>
        )}
        <h3 className="font-display font-semibold text-[#0D2137] text-lg uppercase mb-2 leading-tight line-clamp-2">{proposal.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4">{proposal.summary}</p>
        <Link
          to={`/propostas/${proposal.slug}`}
          className="inline-flex items-center gap-1 text-[#1B3A6B] text-sm font-semibold hover:text-[#F0A500] transition-colors"
        >
          Ler proposta <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function EventCard({ event, index, formatDate, eventTypeColors, eventTypeLabels }: any) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`card-hover bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm ${inView ? `animate-fade-in-up delay-${Math.min(index * 150, 450)}` : 'opacity-0'}`}
    >
      {event.image && (
        <div className="h-40 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${eventTypeColors[event.type]}`}>
            {eventTypeLabels[event.type]}
          </span>
          <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
        </div>
        <h3 className="font-display font-semibold text-[#0D2137] uppercase mb-2 leading-tight">{event.title}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} className="text-[#F0A500]" />
            {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} className="text-[#F0A500]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ item, index, formatDate }: any) {
  const { ref, inView } = useInView();
  return (
    <Link
      to={`/noticias/${item.slug}`}
      ref={ref as any}
      className={`card-hover block bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm ${inView ? `animate-fade-in-up delay-${Math.min(index * 150, 450)}` : 'opacity-0'}`}
    >
      {item.image && (
        <div className="h-44 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
      )}
      <div className="p-5">
        <div className="text-xs text-gray-400 mb-2">{formatDate(item.publishedAt)} · {item.author}</div>
        <h3 className="font-display font-semibold text-[#0D2137] uppercase mb-2 leading-tight line-clamp-3">{item.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{item.summary}</p>
      </div>
    </Link>
  );
}

function GalleryPreview() {
  const { gallery } = useCampaign();
  const { ref, inView } = useInView();
  const preview = gallery.slice(0, 4);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Galeria" title="Momentos da Campanha" subtitle="Registros dos encontros, eventos e ações pelo município." />
        <div ref={ref} className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {preview.map((item, i) => (
            <div
              key={item.id}
              className={`overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2 col-span-1 lg:col-span-2' : ''}`}
            >
              <img
                src={item.url + '&auto=format'}
                alt={item.caption}
                className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/galeria" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
            <Camera size={16} />
            Ver galeria completa
          </Link>
        </div>
      </div>
    </section>
  );
}
