import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Syringe,
  Flame,
  Activity,
  Heart,
  Stethoscope,
  Shield,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ChatMessage, ContextCategory, DetectedContextInfo, PresenteCode } from '../types';
import { PRESENTE_DIMENSIONS } from '../data/presenteData';
import { detectContext, getAllContextCategories } from '../utils/contextDetector';
import {
  HUMAN_ENTRANCE_DOORS,
} from '../data/canonicalArchitectureData';
import { OfficialBlason } from './OfficialBlason';

interface WillChatProps {
  onSelectDimension?: (code: PresenteCode) => void;
  currentDimension: string;
  setCurrentDimension: (dim: string) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const WELCOME_TEXT =
  'Hola. Soy Will.\n\nEste es un espacio confidencial para hablar, preguntar o informarte con rigor y sin que nadie te juzgue ni te diga lo que tienes que hacer.\n\nTú marcas el ritmo y el contenido. Puedes elegir uno de los temas de abajo o simplemente escribir lo que te pasa.';

const RESET_TEXT =
  'Espacio reiniciado. Recuerda: tú marcas el rumbo, el ritmo y el contenido de esta conversación.';

export const WillChat: React.FC<WillChatProps> = ({
  currentDimension,
  setCurrentDimension,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDimensionBar, setShowDimensionBar] = useState(false);
  const [expandedInspectId, setExpandedInspectId] = useState<string | null>(null);
  const [selectedContextOverride, setSelectedContextOverride] = useState<ContextCategory | 'auto'>('auto');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const liveContext = useMemo(() => {
    if (!input.trim()) return null;
    return detectContext(
      input,
      messages.map((m) => ({ role: m.role, content: m.content }))
    );
  }, [input, messages]);

  const isEntrance = messages.length <= 1;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    let contextInfo: DetectedContextInfo;
    if (selectedContextOverride !== 'auto') {
      const all = getAllContextCategories();
      const match = all.find((c) => c.type === selectedContextOverride);
      contextInfo = detectContext(query);
      if (match) {
        contextInfo.type = match.type;
        contextInfo.label = match.label;
        contextInfo.badgeLabel = match.badgeLabel;
      }
    } else {
      contextInfo = detectContext(
        query,
        messages.map((m) => ({ role: m.role, content: m.content }))
      );
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dimension: currentDimension !== 'all' ? currentDimension : undefined,
      detectedContext: contextInfo,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          contextDimension: currentDimension !== 'all' ? currentDimension : undefined,
          detectedContext: contextInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Will');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'He recibido tu mensaje. ¿Qué aspecto te gustaría explorar ahora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dimension: currentDimension !== 'all' ? currentDimension : undefined,
        detectedContext: contextInfo,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'Ha ocurrido un problema al procesar la respuesta. Puedes reintentar tu pregunta o consultar directamente la sección de Explorar Temas.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: RESET_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const getDoorIcon = (name: string) => {
    switch (name) {
      case 'Compass':
        return Compass;
      case 'Stethoscope':
        return Stethoscope;
      case 'Heart':
        return Heart;
      case 'Activity':
        return Activity;
      case 'Flame':
        return Flame;
      case 'Syringe':
        return Syringe;
      case 'Shield':
        return Shield;
      default:
        return Sparkles;
    }
  };

  const getContextVisuals = (contextType?: ContextCategory) => {
    switch (contextType) {
      case 'slam':
        return {
          icon: Syringe,
          badgeBg: 'bg-red-950/80 border-red-700 text-red-200',
          title: 'SLAM (Uso Intravenoso)',
        };
      case 'chemsex':
        return {
          icon: Flame,
          badgeBg: 'bg-amber-950/80 border-amber-600 text-amber-200',
          title: 'Chemsex (Sexo y Sustancias)',
        };
      case 'consumo-psicotropicas':
        return {
          icon: Activity,
          badgeBg: 'bg-indigo-950/80 border-indigo-700 text-indigo-200',
          title: 'Sustancias (Farmacología)',
        };
      case 'placer-sexual':
        return {
          icon: Heart,
          badgeBg: 'bg-rose-950/80 border-rose-700 text-rose-200',
          title: 'Placer Sexual & Acuerdos',
        };
      case 'salud-sexual':
        return {
          icon: Stethoscope,
          badgeBg: 'bg-cyan-950/80 border-cyan-700 text-cyan-200',
          title: 'Salud Sexual & PrEP',
        };
      case 'prevencion':
        return {
          icon: Shield,
          badgeBg: 'bg-petroleum/80 border-[rgba(232,195,122,0.35)] text-[#e8c37a]',
          title: 'Prevención',
        };
      case 'acompanamiento':
      default:
        return {
          icon: Compass,
          badgeBg: 'bg-stone-800/80 border-stone-700 text-stone-300',
          title: 'Acompañamiento Libre',
        };
    }
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0 max-w-5xl mx-auto w-full px-3 sm:px-5 py-2">
      <div className="glass-panel rounded-2xl p-2.5 mb-2 shrink-0 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8c37a] shrink-0" />
          <span className="text-[#f4efe6]/70 text-xs truncate">
            Acompañamiento no directivo • Sin juicios ni prescripciones
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowDimensionBar(!showDimensionBar)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#f4efe6]/60 hover:text-[#f4efe6] px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Ajustar lentes de conversación"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#e8c37a]" />
            <span className="hidden sm:inline">Lentes P.R.E.S.E.N.T.E.</span>
            <span className="sm:hidden">Lentes</span>
          </button>
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-[#f4efe6]/40 hover:text-rose-300 hover:bg-white/5 transition-colors"
            title="Reiniciar conversación"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showDimensionBar && (
        <div className="mb-2 p-2.5 rounded-xl glass-panel-strong shrink-0 space-y-1.5">
          <span className="text-[10px] uppercase font-mono text-[#f4efe6]/50 block">
            Lentes opcionales de acompañamiento (no obligatorios):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setCurrentDimension('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                currentDimension === 'all'
                  ? 'will-nav-item-active'
                  : 'bg-white/5 text-[#f4efe6]/60 hover:text-[#f4efe6]'
              }`}
            >
              Libre / Sin lente
            </button>
            {PRESENTE_DIMENSIONS.map((dim) => {
              const isActive = currentDimension === dim.name;
              return (
                <button
                  key={dim.code}
                  onClick={() => setCurrentDimension(dim.name)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    isActive
                      ? 'will-nav-item-active'
                      : 'bg-white/5 text-[#f4efe6]/60 hover:text-[#f4efe6]'
                  }`}
                >
                  <span className="font-mono font-bold">{dim.letter}</span>
                  <span>{dim.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 px-1 pr-2 py-2">
        {isEntrance && (
          <div className="flex flex-col items-center text-center pt-4 pb-4 px-4">
            <div className="will-presence mb-6">
              <OfficialBlason size={64} className="h-16 w-16" />
            </div>
            <p className="font-serif text-2xl tracking-wide text-[#f4efe6]">Will</p>
            <p className="mt-3 max-w-lg text-sm sm:text-[15px] text-[#f4efe6]/80 leading-relaxed whitespace-pre-wrap">
              {messages[0]?.content || WELCOME_TEXT}
            </p>
          </div>
        )}

        {isEntrance && (
          <div className="space-y-3 pb-4">
            <div className="space-y-1 px-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#e8c37a]/80 block">
                Puertas de entrada
              </span>
              <p className="text-xs text-[#f4efe6]/50">
                Elige por dónde empezar o escribe directamente abajo lo que quieras:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HUMAN_ENTRANCE_DOORS.map((door) => {
                const Icon = getDoorIcon(door.iconName);
                const isLibre = door.id === 'libre';

                return (
                  <button
                    key={door.id}
                    id={`door-btn-${door.id}`}
                    onClick={() => handleSend(door.quickPrompt)}
                    className={`flex flex-col items-start p-3.5 rounded-2xl glass-panel text-left transition-all group ${
                      isLibre ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg border ${door.badgeColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold font-serif ${door.textColor}`}>
                          {door.doorTitle}
                        </span>
                      </div>
                      {door.number && (
                        <span className="text-[10px] font-mono text-[#f4efe6]/35">
                          0{door.number}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#f4efe6]/70 line-clamp-2 leading-relaxed">
                      {door.humanSubtitle}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[rgba(232,195,122,0.1)] w-full flex items-center justify-between text-[10px] text-[#f4efe6]/45 group-hover:text-[#e8c37a] transition-colors">
                      <span className="truncate">«{door.quickPrompt}»</span>
                      <ArrowRight className="w-3 h-3 shrink-0 ml-1 opacity-60 group-hover:opacity-100" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isEntrance &&
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isInspectOpen = expandedInspectId === msg.id;
            const contextVisuals = getContextVisuals(msg.detectedContext?.type);
            const ContextIcon = contextVisuals.icon;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[94%] sm:max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser ? 'will-msg-user text-[#f4efe6]' : 'will-msg-will text-[#f4efe6]/90'
                  }`}
                >
                  {!isUser && (
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[rgba(232,195,122,0.1)] text-[11px] text-[#f4efe6]/50">
                      <div className="flex items-center gap-2">
                        <div className="will-presence-sm w-5 h-5 shrink-0">
                          <OfficialBlason size={20} className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-[#f4efe6]/80">Will</span>
                        <span className="font-mono text-[10px] text-[#f4efe6]/35">
                          • {msg.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {msg.detectedContext && msg.detectedContext.type !== 'general' && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${contextVisuals.badgeBg}`}
                          >
                            <ContextIcon className="w-3 h-3 shrink-0" />
                            <span>{msg.detectedContext.badgeLabel}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none font-sans text-sm leading-relaxed text-[#f4efe6]/90">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-[rgba(232,195,122,0.1)] flex flex-wrap items-center justify-between gap-2 text-xs text-[#f4efe6]/45">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.content)}
                          className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                            speakingId === msg.id ? 'text-[#e8c37a] bg-white/5' : 'text-[#f4efe6]/45'
                          }`}
                          title={speakingId === msg.id ? 'Detener lectura' : 'Escuchar en voz alta'}
                          aria-label={speakingId === msg.id ? 'Detener lectura' : 'Escuchar en voz alta'}
                          aria-pressed={speakingId === msg.id}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 rounded-lg text-[#f4efe6]/45 hover:text-[#f4efe6] hover:bg-white/5 transition-colors"
                          title="Copiar texto"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedInspectId(isInspectOpen ? null : msg.id)}
                          className="flex items-center gap-1 text-[11px] text-[#f4efe6]/50 hover:text-[#e8c37a] transition-colors px-2 py-1 rounded bg-white/5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Verificación ética</span>
                          {isInspectOpen ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isUser && isInspectOpen && (
                  <div className="max-w-[94%] sm:max-w-[82%] rounded-2xl p-4 glass-panel-strong text-xs text-[#f4efe6]/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium border-b border-[rgba(232,195,122,0.1)] pb-2">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Garantía de No Directividad y Rigor</span>
                    </div>
                    <ul className="text-[11px] text-[#f4efe6]/60 space-y-1.5 pt-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Sin juicios ni prescripciones:</strong> No se imponen decisiones ni metas clínicas.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Diferenciación clara:</strong> Cada práctica se trata con su propia identidad técnica.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Soberanía de la persona:</strong> La decisión final sobre tu cuerpo permanece 100% en ti.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl will-msg-will max-w-[75%]">
            <div className="will-presence-sm w-5 h-5 shrink-0">
              <OfficialBlason size={20} className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#f4efe6]/55">
              <span>Will está preparando la respuesta...</span>
              <RefreshCw className="w-3 h-3 animate-spin text-[#e8c37a]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {liveContext && liveContext.type !== 'general' && (
        <div className="mb-1.5 px-3 py-1.5 rounded-xl glass-panel flex items-center justify-between text-xs text-[#f4efe6]/80 shrink-0">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8c37a]" />
            <span className="text-[11px] text-[#f4efe6]/45">Tema identificado:</span>
            <span className="font-semibold text-[#f4efe6]/90 text-[11px] truncate">
              {liveContext.label}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 shrink-0">
            Sin juzgar
          </span>
        </div>
      )}

      <div className="will-composer rounded-2xl p-2 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            id="chat-user-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe lo que quieras contar, preguntar o explorar..."
            rows={1}
            className="w-full bg-transparent text-[#f4efe6] placeholder-[#f4efe6]/35 text-sm resize-none focus:outline-none px-3 py-2 max-h-32 min-h-[40px]"
          />

          <button
            id="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="will-send p-2.5 rounded-full font-bold transition-all shrink-0 min-h-11 min-w-11 flex items-center justify-center disabled:cursor-not-allowed"
            title="Enviar mensaje"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
