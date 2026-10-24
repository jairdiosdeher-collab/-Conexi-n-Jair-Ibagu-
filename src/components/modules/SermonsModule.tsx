import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Search, 
  ChevronRight,
  Loader2,
  Monitor,
  HelpCircle,
  Heart,
  Maximize2,
  ChevronLeft,
  Clock,
  Compass,
  BookmarkCheck,
  Flame,
  Layers,
  Info
} from 'lucide-react';
import { Sermon, UserProfile, HomileticSlide, SermonType } from '../../types';
import { HomileticEngine, HomileticInput } from '../../services/homileticEngine';
import { useToast } from '../../context/ToastContext';

interface SermonsModuleProps {
  user: UserProfile;
  sermons: Sermon[];
  onAddSermon: (sermon: Sermon) => void;
}

export const SermonsModule: React.FC<SermonsModuleProps> = ({
  user,
  sermons,
  onAddSermon,
}) => {
  const { showSuccess, showInfo, showError } = useToast();
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(sermons[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'bosquejo' | 'exegesis' | 'celulas' | 'devocional' | 'diapositivas'>('bosquejo');

  // Slide Deck Presenter state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreenSlides, setIsFullscreenSlides] = useState(false);

  // Generator form state
  const [mainPassage, setMainPassage] = useState('Efesios 2:1-10');
  const [theme, setTheme] = useState('La gracia de Dios');
  const [sermonType, setSermonType] = useState<SermonType>('expositivo');
  const [targetAudience, setTargetAudience] = useState('Congregación general y familias');
  const [objective, setObjective] = useState('Comprender la suficiencia de la gracia soberana y activar una vida de buenas obras nacidas de la fe.');
  const [seriesName, setSeriesName] = useState('Fundamentos del Evangelio');
  const [durationMinutes, setDurationMinutes] = useState<number>(35);
  const [bibleTranslation, setBibleTranslation] = useState('RVR1960');
  const [pastoralNeed, setPastoralNeed] = useState('Sanar el desgaste por perfeccionismo religioso o culpa moral');
  const [isLoading, setIsLoading] = useState(false);

  const filteredSermons = sermons.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mainPassage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Selector rápido de escenarios de prueba teológicos y bíblicos
  const applyPresetScenario = (scenario: 'efesios' | 'santiago' | 'colosenses' | 'salmo23') => {
    if (scenario === 'efesios') {
      setMainPassage('Efesios 2:1-10');
      setTheme('La gracia de Dios');
      setSermonType('expositivo');
      setTargetAudience('Congregación general y creyentes bajo autoexigencia');
      setObjective('Comprender que la salvación es un don de Dios y no por obras, para vivir como su obra maestra.');
      setSeriesName('Gracia Inagotable');
      setDurationMinutes(35);
      setBibleTranslation('RVR1960');
      setPastoralNeed('Derribar la culpa neurótica y recordar la suficiencia de la obra consumada de Cristo.');
    } else if (scenario === 'santiago') {
      setMainPassage('Santiago 1:2-8');
      setTheme('La perseverancia en la prueba');
      setSermonType('expositivo');
      setTargetAudience('Personas y familias atravesando crisis o incertidumbre');
      setObjective('Aprender a considerar la prueba con gozo sabiendo que forja madurez mediante la oración sabia.');
      setSeriesName('Fe a Prueba de Fuego');
      setDurationMinutes(35);
      setBibleTranslation('RVR1960');
      setPastoralNeed('Evitar que las dificultades económicas o de salud apaguen la esperanza y la confianza en Dios.');
    } else if (scenario === 'colosenses') {
      setMainPassage('Colosenses 3:12-15');
      setTheme('El perdón en la familia');
      setSermonType('tematico');
      setTargetAudience('Matrimonios, padres, hijos y núcleos familiares');
      setObjective('Promover la reconciliación y cancelación mutua de ofensas familiares bajo el arbitraje de la paz de Cristo.');
      setSeriesName('Hogares de Gracia');
      setDurationMinutes(40);
      setBibleTranslation('RVR1960');
      setPastoralNeed('Sanar resentimientos no resueltos entre cónyuges o padres e hijos antes de que rompan la comunión.');
    } else if (scenario === 'salmo23') {
      setMainPassage('Salmo 23:1-6');
      setTheme('El Buen Pastor en Tiempos de Escasez');
      setSermonType('pastoral');
      setTargetAudience('Líderes y familias bajo estrés financiero o emocional');
      setObjective('Descansar en la provisión, protección y compañía incondicional de Jehová-Rohi.');
      setSeriesName('Descanso para el Alma');
      setDurationMinutes(30);
      setBibleTranslation('RVR1960');
      setPastoralNeed('Renovar la paz interior en medio de noticias alarmantes o valles oscuros.');
    }
  };

  // Generador dinámico de diapositivas automáticas basadas en el sermón seleccionado
  const generateSlides = (sermon: Sermon): HomileticSlide[] => {
    return [
      {
        slideNumber: 1,
        title: sermon.title,
        subtitle: `Serie: ${sermon.series || 'Predicación Bíblica'} • ${sermon.sermonType ? sermon.sermonType.toUpperCase() : 'HOMILÉTICA'}`,
        scriptureReference: `${sermon.mainPassage} (${sermon.bibleTranslation || 'RVR1960'})`,
        contentBulletPoints: [
          `Pasaje: ${sermon.mainPassage}`,
          `Propósito: ${sermon.objective}`,
          `Tiempo sugerido: ${sermon.durationMinutes || 35} minutos`
        ],
        speakerNotes: 'Introducción del mensaje: capturar la atención con la historia y el dilema humano.'
      },
      {
        slideNumber: 2,
        title: 'Idea Homilética Central',
        subtitle: 'Proposición Teológica',
        scriptureReference: sermon.mainPassage,
        contentBulletPoints: [
          `"${sermon.homileticalIdea}"`
        ],
        speakerNotes: 'Declarar la idea central con nitidez; pedir a la congregación que la reflexione.'
      },
      ...sermon.points.map((pt, idx) => ({
        slideNumber: idx + 3,
        title: pt.title,
        subtitle: `Punto ${idx + 1}`,
        scriptureReference: sermon.mainPassage,
        contentBulletPoints: [
          `Exégesis: ${pt.scriptureExplanation}`,
          `Ilustración: ${pt.contemporaryIllustration}`,
          `Aplicación: ${pt.practicalApplication}`
        ],
        speakerNotes: `Énfasis ministerial del punto ${idx + 1}. Contextualizar la aplicación a la audiencia.`
      })),
      {
        slideNumber: sermon.points.length + 3,
        title: 'Conclusión & Desafío de Fe',
        subtitle: 'Respuesta al Evangelio',
        scriptureReference: sermon.mainPassage,
        contentBulletPoints: [
          sermon.conclusion,
          `Llamado: ${sermon.callToAction}`
        ],
        speakerNotes: 'Llamado al altar y oración pastoral de entrega y ministración espiritual.'
      }
    ];
  };

  const slides = selectedSermon ? generateSlides(selectedSermon) : [];

  const handleGenerateAiSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainPassage.trim() || !theme.trim()) {
      showError('Campos Requeridos', 'Por favor ingresa el pasaje bíblico y el tema del sermón.');
      return;
    }

    setIsLoading(true);

    try {
      const input: HomileticInput = {
        mainPassage: mainPassage.trim(),
        theme: theme.trim(),
        sermonType,
        targetAudience: targetAudience.trim(),
        objective: objective.trim(),
        seriesName: seriesName.trim(),
        durationMinutes,
        bibleTranslation,
        pastoralNeed: pastoralNeed.trim(),
      };

      const result = await HomileticEngine.generateSermon(input);

      onAddSermon(result.sermon);
      setSelectedSermon(result.sermon);
      setIsGeneratorOpen(false);
      setCurrentSlideIndex(0);

      if (result.source === 'gemini-3.8-flash') {
        showSuccess('Sermón Exegético Generado', `Generado exitosamente con Gemini 3.8 Flash.`);
      } else {
        showInfo('Sermón Contextual Generado', `Generado mediante Motor Hermenéutico Autónomo.`);
      }
    } catch (err: any) {
      console.error('Error generando sermón:', err);
      showError('Error en la Generación', err?.message || 'No se pudo generar el sermón.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySermon = () => {
    if (!selectedSermon) return;
    const text = `TÍTULO: ${selectedSermon.title}
PASAJE BÍBLICO: ${selectedSermon.mainPassage} (${selectedSermon.bibleTranslation || 'RVR1960'})
GÉNERO HOMILÉTICO: ${selectedSermon.sermonType ? selectedSermon.sermonType.toUpperCase() : 'EXPOSITIVO'}
DURACIÓN: ${selectedSermon.durationMinutes || 35} minutos
SERIE: ${selectedSermon.series || 'General'}
AUDIENCIA: ${selectedSermon.targetAudience}

IDEA HOMILÉTICA CENTRAL:
"${selectedSermon.homileticalIdea}"

OBJETIVO ESPIRITUAL:
${selectedSermon.objective}

INTRODUCCIÓN:
${selectedSermon.introduction}

DESARROLLO HOMILÉTICO:
${selectedSermon.points.map((p, i) => `${p.title}\n• Exégesis Bíblica: ${p.scriptureExplanation}\n• Ilustración: ${p.contemporaryIllustration}\n• Aplicación Práctica: ${p.practicalApplication}`).join('\n\n')}

CONCLUSIÓN:
${selectedSermon.conclusion}

LLAMADO AL ALTAR:
${selectedSermon.callToAction}

PASAJES DE APOYO:
${(selectedSermon.supportingPassages || []).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Pilar Homilético de Alta Fidelidad
            </span>
            <span className="text-xs text-slate-400">Exégesis, Diapositivas, Células & Devocionales</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Productor de Sermones Bíblicos & Homilética</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generación exegética auténticamente contextual. Adaptación rigurosa a pasaje, tema, género homilético, términos originales e ilustraciones.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Generar Sermón con IA</span>
        </button>
      </div>

      {/* Main Grid: Library on Left, Selected Sermon on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Sermon Catalog (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por pasaje, título o etiqueta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>{filteredSermons.length} sermones disponibles</span>
              <span className="text-amber-400 font-semibold">Listo para Púlpito</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredSermons.map((sermon) => {
              const isSelected = selectedSermon?.id === sermon.id;
              return (
                <div
                  key={sermon.id}
                  onClick={() => {
                    setSelectedSermon(sermon);
                    setCurrentSlideIndex(0);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-amber-400">{sermon.series || 'Mensaje Bíblico'}</span>
                    <span>{sermon.dateCreated}</span>
                  </div>

                  <h3 className="font-bold text-xs text-white mb-1 line-clamp-2">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono text-cyan-300">
                      {sermon.mainPassage}
                    </span>
                    {sermon.sermonType && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase font-bold border border-indigo-500/30">
                        {sermon.sermonType}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sermon.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Sermon Multi-View (8 cols) */}
        <div className="lg:col-span-8">
          {selectedSermon ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
              {/* Top Sermon Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {selectedSermon.series || 'Predicación Bíblica'}
                    </span>
                    {selectedSermon.sermonType && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                        Sermón {selectedSermon.sermonType}
                      </span>
                    )}
                    {selectedSermon.durationMinutes && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {selectedSermon.durationMinutes} min
                      </span>
                    )}
                    {selectedSermon.bibleTranslation && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                        {selectedSermon.bibleTranslation}
                      </span>
                    )}
                    {selectedSermon.generationSource && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        selectedSermon.generationSource === 'gemini-3.8-flash'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {selectedSermon.generationSource === 'gemini-3.8-flash' ? '✨ Gemini 3.8 Flash' : '⚡ Motor Hermenéutico Contextual'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight font-serif">
                    {selectedSermon.title}
                  </h2>
                  <p className="text-xs font-mono text-cyan-300">
                    Pasaje Central: {selectedSermon.mainPassage}
                    {selectedSermon.supportingPassages && selectedSermon.supportingPassages.length > 0 && (
                      <span className="text-slate-400 ml-2">
                        • Apoyo: {selectedSermon.supportingPassages.join(', ')}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Audiencia:</strong> {selectedSermon.targetAudience}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopySermon}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Púlpito</span>
                  </button>
                </div>
              </div>

              {/* View Switcher Tabs (5 Dimensions) */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'bosquejo', label: 'Bosquejo Homilético', icon: BookOpen },
                  { id: 'exegesis', label: 'Exégesis & Contexto', icon: Sparkles },
                  { id: 'celulas', label: 'Grupos Pequeños', icon: HelpCircle },
                  { id: 'devocional', label: 'Plan Devocional 3D', icon: Heart },
                  { id: 'diapositivas', label: 'Presentación & Diapositivas', icon: Monitor },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                        activeTab === tab.id
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: BOSQUEJO HOMILÉTICO */}
              {activeTab === 'bosquejo' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Homiletical Proposition */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                      Idea Homilética Central (Proposición Teológica)
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-amber-100 font-serif leading-relaxed">
                      "{selectedSermon.homileticalIdea}"
                    </p>
                    {selectedSermon.objective && (
                      <div className="mt-2 pt-2 border-t border-amber-500/20 text-[11px] text-amber-200/80">
                        <strong className="text-amber-300">Objetivo Pastoral:</strong> {selectedSermon.objective}
                      </div>
                    )}
                  </div>

                  {/* Introduction */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>Introducción & Conexión Bíblica</span>
                    </h3>
                    <div className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
                      {selectedSermon.introduction}
                    </div>
                  </div>

                  {/* Main Points */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Desarrollo Homilético ({selectedSermon.points.length} Puntos Exegéticos)</span>
                    </h3>

                    {selectedSermon.points.map((pt, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs shadow-inner">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5 border border-amber-500/30">
                            {idx + 1}
                          </span>
                          <h4 className="font-extrabold text-sm text-white">
                            {pt.title}
                          </h4>
                        </div>

                        <div className="space-y-2 pl-8 border-l-2 border-slate-800 ml-3">
                          <div className="text-slate-300">
                            <span className="font-bold text-cyan-300 block mb-0.5">Exégesis Bíblica:</span>
                            <p className="leading-relaxed">{pt.scriptureExplanation}</p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-slate-300">
                            <span className="font-bold text-amber-400 block mb-0.5 text-[11px]">Ilustración Pertinente:</span>
                            <p className="italic leading-relaxed text-slate-200 font-serif">{pt.contemporaryIllustration}</p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-slate-300">
                            <span className="font-bold text-emerald-400 block mb-0.5 text-[11px]">Aplicación Práctica para la Vida Cotidiana:</span>
                            <p className="leading-relaxed font-medium text-emerald-200">{pt.practicalApplication}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Conclusion & Altarcall */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                        <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                        <span>Conclusión Cristocéntrica</span>
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{selectedSermon.conclusion}</p>
                    </div>
                    <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Llamado al Altar & Respuesta de Fe</span>
                      </h4>
                      <p className="text-amber-100 leading-relaxed font-serif">{selectedSermon.callToAction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EXÉGESIS & CONTEXTO HISTÓRICO */}
              {activeTab === 'exegesis' && (
                <div className="space-y-4 text-xs animate-fadeIn">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Contexto Histórico y Cultural del Pasaje ({selectedSermon.mainPassage})</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedSermon.historicalContext ||
                        `El pasaje de ${selectedSermon.mainPassage} fue transmitido a una comunidad concreta en un momento histórico determinado para fundamentar su fe en la fidelidad divina y responder a las presiones de su entorno cultural.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="font-bold text-cyan-300">Contexto Literario & Género Bíblico</h5>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedSermon.literaryContext ||
                          `Estructura retórica inspirada por el Espíritu Santo que conduce desde la verdad revelada hacia la responsabilidad de obediencia de los creyentes.`}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="font-bold text-emerald-300">Conexión Teológica Cristocéntrica</h5>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedSermon.theologicalContext ||
                          `Toda la Escritura testifica de Cristo Jesús. Este pasaje encuentra su cumplimiento y sentido pleno en la gracia consumada en la cruz y la resurrección.`}
                      </p>
                    </div>
                  </div>

                  {/* Términos originales clave */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Términos Clave en Idiomas Originales ({selectedSermon.mainPassage})</span>
                    </h5>

                    {selectedSermon.keyTerms && selectedSermon.keyTerms.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedSermon.keyTerms.map((term, i) => (
                          <div key={i} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-serif font-black text-amber-300">{term.originalWord}</span>
                              <span className="text-[10px] font-mono text-cyan-300">({term.transliteration})</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                              {term.language}
                            </span>
                            <p className="text-slate-300 text-[11px] font-medium pt-1">{term.meaning}</p>
                            <p className="text-slate-400 text-[10px] italic leading-tight">{term.theologicalDepth}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">
                        Los términos de este pasaje enriquecen la comprensión del pacto divino y la gracia en {selectedSermon.mainPassage}.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: GRUPOS PEQUEÑOS / CÉLULAS */}
              {activeTab === 'celulas' && (
                <div className="space-y-4 text-xs animate-fadeIn">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Guía de Diálogo para Grupos Pequeños & Células</span>
                    </h4>
                    <p className="text-slate-400">
                      Preguntas diseñadas específicamente para el pasaje {selectedSermon.mainPassage} y el tema "{selectedSermon.title}".
                    </p>

                    {selectedSermon.smallGroupQuestions && selectedSermon.smallGroupQuestions.length > 0 ? (
                      <ol className="space-y-3 list-decimal list-inside text-slate-200">
                        {selectedSermon.smallGroupQuestions.map((q, i) => (
                          <li key={i} className="p-3 bg-slate-900 rounded-lg leading-relaxed border border-slate-800">
                            <strong>Pregunta {i + 1}:</strong> {q}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ol className="space-y-3 list-decimal list-inside text-slate-200">
                        <li className="p-3 bg-slate-900 rounded-lg">
                          <strong>Rompehielos:</strong> ¿Cuál ha sido un momento donde experimentaste con claridad la verdad de {selectedSermon.mainPassage} en tu vida?
                        </li>
                        <li className="p-3 bg-slate-900 rounded-lg">
                          <strong>Profundización:</strong> ¿Por qué nos resulta desafiante aplicar {selectedSermon.title} cuando las circunstancias son adversas?
                        </li>
                        <li className="p-3 bg-slate-900 rounded-lg">
                          <strong>Aplicación:</strong> ¿Qué paso práctico darás esta semana para vivir la proposición: "{selectedSermon.homileticalIdea}"?
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PLAN DEVOCIONAL 3 DÍAS */}
              {activeTab === 'devocional' && (
                <div className="space-y-3 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between pb-1">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-amber-400" />
                      <span>Plan Devocional de 3 Días para la Congregación</span>
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-300">{selectedSermon.mainPassage}</span>
                  </div>

                  {selectedSermon.devotionalDays && selectedSermon.devotionalDays.length > 0 ? (
                    selectedSermon.devotionalDays.map((dev, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-amber-400 font-bold">
                          <span>{dev.day}: {dev.title}</span>
                          <span className="font-mono text-cyan-300 text-[11px]">{dev.passage}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{dev.reflection}</p>
                        {dev.prayer && (
                          <p className="text-emerald-300/90 text-[11px] italic pt-1 border-t border-slate-800/80">
                            <strong>Oración del día:</strong> "{dev.prayer}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    [
                      { dia: 'Día 1', titulo: 'Fundamento en la Palabra', pasaje: selectedSermon.mainPassage, reflexion: `Medita en las promesas y demandas de ${selectedSermon.mainPassage}. Permite que el Espíritu Santo hable a tu corazón.` },
                      { dia: 'Día 2', titulo: 'Renovación de la Mente', pasaje: selectedSermon.mainPassage, reflexion: `Examina tus prioridades a la luz del propósito: ${selectedSermon.objective}.` },
                      { dia: 'Día 3', titulo: 'Fe en Acción', pasaje: selectedSermon.mainPassage, reflexion: `Pon por obra la aplicación del sermón: ${selectedSermon.homileticalIdea}.` },
                    ].map((dev, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-amber-400 font-bold">
                          <span>{dev.dia}: {dev.titulo}</span>
                          <span className="font-mono text-cyan-300 text-[11px]">{dev.pasaje}</span>
                        </div>
                        <p className="text-slate-300">{dev.reflexion}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: PRESENTACIÓN AUTOMÁTICA DE DIAPOSITIVAS */}
              {activeTab === 'diapositivas' && (
                <div className="space-y-4 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">
                      Diapositiva {currentSlideIndex + 1} de {slides.length}
                    </span>
                    <button
                      onClick={() => setIsFullscreenSlides(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center space-x-1 transition"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Modo Proyector Pantalla Completa</span>
                    </button>
                  </div>

                  {/* Slide Preview Canvas */}
                  {slides[currentSlideIndex] && (
                    <div className="aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/40 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden text-center">
                      <div className="space-y-2">
                        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                          {slides[currentSlideIndex].subtitle}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white font-serif tracking-tight">
                          {slides[currentSlideIndex].title}
                        </h3>
                        <p className="text-sm font-mono text-cyan-300">
                          {slides[currentSlideIndex].scriptureReference}
                        </p>
                      </div>

                      <div className="my-auto max-w-xl mx-auto space-y-2">
                        {slides[currentSlideIndex].contentBulletPoints.map((bp, i) => (
                          <p key={i} className="text-base text-slate-200 font-medium leading-relaxed">
                            {bp}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-800">
                        <span>PastoralMente Slide Deck Engine • {selectedSermon.mainPassage}</span>
                        <span>{selectedSermon.title}</span>
                      </div>
                    </div>
                  )}

                  {/* Slide controls */}
                  <div className="flex items-center justify-center space-x-4 pt-2">
                    <button
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl font-bold flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>
                    <button
                      disabled={currentSlideIndex === slides.length - 1}
                      onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold flex items-center space-x-1"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
              Selecciona un sermón para revisar su bosquejo homilético completo.
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Projector Modal */}
      {isFullscreenSlides && slides[currentSlideIndex] && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 text-center animate-fadeIn">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>{selectedSermon?.title} &bull; Diapositiva {currentSlideIndex + 1}/{slides.length}</span>
            <button
              onClick={() => setIsFullscreenSlides(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Salir de Pantalla Completa (Esc)
            </button>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 my-auto">
            <span className="text-sm uppercase tracking-widest text-amber-400 font-bold block">
              {slides[currentSlideIndex].subtitle}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white font-serif leading-tight">
              {slides[currentSlideIndex].title}
            </h1>
            <p className="text-lg font-mono text-cyan-400">
              {slides[currentSlideIndex].scriptureReference}
            </p>
            <div className="space-y-4 pt-6">
              {slides[currentSlideIndex].contentBulletPoints.map((bp, i) => (
                <p key={i} className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed">
                  {bp}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              className="px-6 py-3 bg-slate-800 text-white rounded-2xl text-sm font-bold disabled:opacity-30"
            >
              Anterior
            </button>
            <button
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
              className="px-6 py-3 bg-amber-500 text-slate-950 rounded-2xl text-sm font-bold disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal: AI Sermon Generator */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Generador Homilético de Alta Precisión con IA</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Construye sermones exegéticos, temáticos y textuales totalmente contextualizados a tus parámetros.
                </p>
              </div>
              <button onClick={() => setIsGeneratorOpen(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {/* Accesos rápidos de escenarios */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Cargar Escenario Teológico Rápido:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPresetScenario('efesios')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-amber-300 font-medium transition-colors"
                >
                  ⚡ Efesios 2 (La gracia de Dios)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScenario('santiago')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-amber-300 font-medium transition-colors"
                >
                  ⚡ Santiago 1 (Perseverancia en la prueba)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScenario('colosenses')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-amber-300 font-medium transition-colors"
                >
                  ⚡ Colosenses 3 (Perdón en la familia)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScenario('salmo23')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-medium transition-colors"
                >
                  ⚡ Salmo 23 (El Buen Pastor)
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerateAiSermon} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pasaje Bíblico Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={mainPassage}
                    onChange={(e) => setMainPassage(e.target.value)}
                    placeholder="Ej. Efesios 2:1-10, Santiago 1:2-8"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tema o Asunto Central *
                  </label>
                  <input
                    type="text"
                    required
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Ej. La gracia de Dios, La perseverancia"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tipo de Sermón *
                  </label>
                  <select
                    value={sermonType}
                    onChange={(e) => setSermonType(e.target.value as SermonType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="expositivo">Expositivo (Versículo a versículo)</option>
                    <option value="textual">Textual (Cláusulas del texto)</option>
                    <option value="tematico">Temático (Articulación doctrinal)</option>
                    <option value="evangelistico">Evangelístico (Llamado de salvación)</option>
                    <option value="doctrinal">Doctrinal (Sistemático)</option>
                    <option value="pastoral">Pastoral (Cuidado y sanidad)</option>
                    <option value="devocional">Devocional (Comunión íntima)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Duración Estimada
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={25}>25 minutos (Breve)</option>
                    <option value={35}>35 minutos (Estándar dominical)</option>
                    <option value={45}>45 minutos (Profundo)</option>
                    <option value={60}>60 minutos (Cátedra teológica)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Traducción Bíblica
                  </label>
                  <select
                    value={bibleTranslation}
                    onChange={(e) => setBibleTranslation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="RVR1960">Reina Valera 1960 (RVR1960)</option>
                    <option value="NVI">Nueva Versión Internacional (NVI)</option>
                    <option value="NBLA">Nueva Biblia de las Américas (NBLA)</option>
                    <option value="LBLA">La Biblia de las Américas (LBLA)</option>
                    <option value="DHH">Dios Habla Hoy (DHH)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Audiencia Objetivo
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ej. Familias, jóvenes, congregación general"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Serie de Predicación (Opcional)
                  </label>
                  <input
                    type="text"
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    placeholder="Ej. Caminando en Victoria"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Objetivo Espiritual y Formativo
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ej. Desmantelar la culpa religiosa y llevar a descansar en la gracia de Dios."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Enfoque Pastoral / Necesidad de la Congregación (Opcional)
                </label>
                <input
                  type="text"
                  value={pastoralNeed}
                  onChange={(e) => setPastoralNeed(e.target.value)}
                  placeholder="Ej. Sanar heridas de rechazo, animar a creyentes en crisis económica"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300">Cero plantillas fijas:</strong> Cada sermón se procesa a partir del pasaje bíblico, construyendo proposición teológica, exégesis en griego/hebreo, ilustraciones diferenciadas, preguntas para células y devocionales acordes al tema.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Elaborando Homilética Exegética...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Generar Sermón Bíblico Completo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
