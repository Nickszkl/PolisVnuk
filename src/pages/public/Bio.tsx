import { Link } from 'react-router';
import { ArrowRight, GraduationCap, Briefcase, MapPin, Calendar, Heart } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useInView } from '../../hooks/useInView';

function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-4xl mx-auto px-4 text-center relative">
        <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">{title}</h1>
        {subtitle && <p className="text-white/60 text-lg">{subtitle}</p>}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
      </div>
    </section>
  );
}

export default function Bio() {
  const { candidate } = useCampaign();
  const { ref: bioRef, inView: bioInView } = useInView();
  const { ref: timelineRef, inView: timelineInView } = useInView();

  return (
    <div>
      <PageHero title={`Conheça o ${candidate.nickname}`} subtitle="Uma trajetória dedicada ao serviço público e à transformação social." />

      {/* Main bio */}
      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Photo */}
            <div className={`${bioInView ? 'animate-fade-in-left' : 'opacity-0'}`} ref={bioRef}>
              <div className="sticky top-24">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-4 border-[#F0A500]/20" />
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="relative w-full rounded-3xl shadow-2xl"
                  />
                </div>

                {/* Quick info */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                  <h3 className="font-display font-bold text-[#0D2137] uppercase text-lg mb-4">Dados do Candidato</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Calendar, label: 'Nascimento', value: new Date(candidate.birthDate).toLocaleDateString('pt-BR') },
                      { icon: MapPin, label: 'Natural de', value: candidate.birthPlace },
                      { icon: Briefcase, label: 'Cargo', value: `${candidate.position} · ${candidate.city}/${candidate.state}` },
                      { icon: GraduationCap, label: 'Formação', value: candidate.education.split('|')[0].trim() },
                      { icon: Heart, label: 'Partido', value: `${candidate.party} (${candidate.partyAcronym})` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <Icon size={16} className="text-[#F0A500] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-400 font-medium">{label}</div>
                          <div className="text-sm text-gray-700">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-[#1B3A6B]/10 text-[#1B3A6B]">
                Trajetória
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#0D2137] uppercase mb-6">
                {candidate.name}
              </h2>
              <div className="prose prose-gray max-w-none">
                {candidate.bio.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <Link to="/propostas" className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
                  Ver propostas <ArrowRight size={15} />
                </Link>
                <Link to="/contato" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold uppercase tracking-wide text-sm hover:bg-[#1B3A6B] hover:text-white transition-all">
                  Contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-[#F0A500]/10 text-[#F0A500]">
              Cronologia
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#0D2137] uppercase">Uma Vida de Dedicação</h2>
          </div>

          <div ref={timelineRef} className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-0.5 bg-[#E2E8F0]" />

            {candidate.trajectory.map((item, i) => (
              <div
                key={i}
                className={`relative flex items-center mb-10 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-0 gap-4 ${timelineInView ? `animate-fade-in-up delay-${Math.min(i * 100, 700)}` : 'opacity-0'}`}
              >
                {/* Content */}
                <div className={`lg:w-[calc(50%-2.5rem)] w-full ${i % 2 === 0 ? 'lg:text-right lg:pr-8' : 'lg:text-left lg:pl-8'}`}>
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm card-hover">
                    <div className="font-mono font-bold text-[#F0A500] text-lg mb-1">{item.year}</div>
                    <h3 className="font-display font-bold text-[#0D2137] uppercase mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 z-10 w-5 h-5 rounded-full bg-[#F0A500] border-4 border-white shadow-md flex-shrink-0" />

                {/* Empty side */}
                <div className="lg:w-[calc(50%-2.5rem)] hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
