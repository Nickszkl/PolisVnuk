import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Globe, ExternalLink } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useStats } from '../../context/StatsContext';

const SocialIcons: Record<string, React.ElementType> = { Instagram: Globe, Facebook: Globe, Twitter: Globe, YouTube: Globe, TikTok: MessageCircle };

export default function Contato() {
  const { candidate, socialLinks } = useCampaign();
  const { trackWhatsApp, trackSocial } = useStats();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">Fale com Pedrinho</h1>
          <p className="text-white/60 text-lg">Sua mensagem é importante. Juntos, fazemos São Paulo melhor.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
              <h2 className="font-display font-bold text-2xl text-[#0D2137] uppercase mb-6">Envie uma mensagem</h2>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#00875A]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#0D2137] uppercase mb-2">Mensagem Enviada!</h3>
                  <p className="text-gray-500">Obrigado pelo contato. Responderemos em breve.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }} className="mt-6 px-6 py-2.5 rounded-full btn-primary text-sm font-bold uppercase tracking-wide">
                    Enviar outra
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Sua mensagem, sugestão ou dúvida..."
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-all resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-full btn-primary font-bold uppercase tracking-wide text-sm">
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-xl uppercase mb-2">Prefere pelo WhatsApp?</h3>
                <p className="text-white/80 text-sm mb-5">Fale diretamente com a equipe do Pedrinho pelo WhatsApp. Resposta rápida!</p>
                <a
                  href={`https://wa.me/${candidate.whatsapp}?text=Olá Pedrinho! Quero saber mais sobre sua campanha.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsApp}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#128C7E] rounded-full text-sm font-bold hover:shadow-lg transition-all"
                >
                  <MessageCircle size={16} />
                  Abrir WhatsApp
                </a>
              </div>

              {/* Contact info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                <h3 className="font-display font-bold text-[#0D2137] uppercase text-lg mb-5">Informações</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-[#1B3A6B]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">E-mail</div>
                      <div className="text-sm text-gray-700">{candidate.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-[#1B3A6B]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Cidade</div>
                      <div className="text-sm text-gray-700">{candidate.city}, {candidate.state}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
                <h3 className="font-display font-bold text-[#0D2137] uppercase text-lg mb-5">Redes Sociais</h3>
                <div className="space-y-3">
                  {socialLinks.filter(s => s.active).map(link => {
                    const Icon = SocialIcons[link.platform] || ExternalLink;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackSocial(link.platform)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F8FC] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#1B3A6B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F0A500] transition-colors">
                          <Icon size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">{link.platform}</div>
                          <div className="text-xs text-gray-400">{link.handle}</div>
                        </div>
                        <ExternalLink size={12} className="ml-auto text-gray-300 group-hover:text-[#F0A500] transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
