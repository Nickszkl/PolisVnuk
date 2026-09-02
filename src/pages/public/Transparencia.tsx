import { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { useInView } from '../../hooks/useInView';

export default function Transparencia() {
  const { documents } = useCampaign();
  const [category, setCategory] = useState('all');
  const { ref, inView } = useInView();

  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];
  const filtered = category === 'all' ? documents : documents.filter(d => d.category === category);

  const categoryLabels: Record<string, string> = { all: 'Todos', candidato: 'Candidato', financeiro: 'Financeiro', campanha: 'Campanha' };
  const fileTypeColors: Record<string, string> = { PDF: 'bg-red-100 text-red-700' };

  return (
    <div>
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-white uppercase mb-4">Transparência</h1>
          <p className="text-white/60 text-lg">Documentos públicos da candidatura com total transparência.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 30 720 40 0 0Z" fill="#F7F8FC"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Commitment text */}
          <div className="bg-[#1B3A6B] text-white rounded-2xl p-8 mb-10">
            <h2 className="font-display font-bold text-2xl uppercase mb-3">Nosso Compromisso com a Transparência</h2>
            <p className="text-white/70 leading-relaxed">
              A campanha de Pedrinho é movida pela confiança dos cidadãos. Por isso, todos os documentos exigidos pela legislação eleitoral são disponibilizados aqui de forma acessível. Acreditamos que a transparência não é apenas uma obrigação legal — é um valor democrático fundamental.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${category === cat ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-[#E2E8F0] hover:bg-gray-50'}`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* Documents list */}
          <div ref={ref} className="space-y-4">
            {filtered.map((doc, i) => (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm card-hover ${inView ? `animate-fade-in-up delay-${Math.min(i * 100, 500)}` : 'opacity-0'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={22} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-display font-bold text-[#0D2137] uppercase mb-1">{doc.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{doc.description}</p>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-bold whitespace-nowrap flex-shrink-0"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${fileTypeColors[doc.fileType] || 'bg-gray-100 text-gray-600'}`}>
                        {doc.fileType}
                      </span>
                      <span>{doc.fileSize}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-[#1B3A6B]/10 text-[#1B3A6B]">
                        {categoryLabels[doc.category] || doc.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">Nenhum documento nesta categoria.</div>
          )}

          <div className="mt-10 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-blue-700 text-sm">
              <strong>Atenção:</strong> Para verificar a autenticidade dos documentos ou solicitar informações adicionais, entre em contato pelo e-mail <strong>{useCampaign().candidate.email}</strong> ou pelo WhatsApp da campanha.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
