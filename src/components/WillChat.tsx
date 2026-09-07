import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
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
  SlidersHorizontal,
} from 'lucide-react';
import { ChatMessage, ContextCategory, DetectedContextInfo, PresenteCode } from '../types';
import { PRESENTE_DIMENSIONS } from '../data/presenteData';
import { detectContext, getAllContextCategories } from '../utils/contextDetector';
import { HUMAN_ENTRANCE_DOORS } from '../data/canonicalArchitectureData';

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
  const welcomeParagraphs = (messages[0]?.content || WELCOME_TEXT).split('\n\n');

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
          messages: newMessages
            .filter((m) => m.id !== 'welcome-msg' && !m.content.startsWith('Hola. Soy Will'))
            .map((m) => ({ role: m.role, content: m.content })),
          contextDimension: currentDimension !== 'all' ? currentDimension : undefined,
          detectedContext: contextInfo
            ? {
                type: contextInfo.type,
                label: contextInfo.label,
                badgeLabel: contextInfo.badgeLabel,
              }
            : undefined,
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

  const getContextVisuals = (contextType?: ContextCategory) => {
    switch (contextType) {
      case 'slam':
        return { icon: Syringe, title: 'SLAM (Uso Intravenoso)' };
      case 'chemsex':
        return { icon: Flame, title: 'Chemsex (Sexo y Sustancias)' };
      case 'consumo-psicotropicas':
        return { icon: Activity, title: 'Sustancias (Farmacología)' };
      case 'placer-sexual':
        return { icon: Heart, title: 'Placer Sexual & Acuerdos' };
      case 'salud-sexual':
        return { icon: Stethoscope, title: 'Salud Sexual & PrEP' };
      case 'prevencion':
        return { icon: Shield, title: 'Prevención' };
      case 'acompanamiento':
      default:
        return { icon: Compass, title: 'Acompañamiento Libre' };
    }
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0 w-full">
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        {isEntrance && (
          <div className="max-w-6xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-5 lg:py-8">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6 will-read">
                <div className="space-y-4 max-w-xl">
                  {welcomeParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? 'font-serif text-3xl sm:text-[2.6rem] tracking-tight will-copy leading-[1.12] font-semibold'
                          : 'text-[15px] sm:text-[17px] will-copy-muted leading-relaxed'
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <nav aria-label="Puertas de entrada">
                  {HUMAN_ENTRANCE_DOORS.map((door) => {
                    const num = door.number ? String(door.number).padStart(2, '0') : '';
                    return (
                      <button
                        key={door.id}
                        id={`door-btn-${door.id}`}
                        type="button"
                        onClick={() => handleSend(door.quickPrompt)}
                        className="will-door group w-full text-left py-2.5 px-3 min-h-11"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-[11px] tracking-[0.18em] text-[#e8c37a] w-7 shrink-0">
                            {num}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-serif text-[17px] will-copy">
                              {door.doorTitle}
                            </span>
                            <span className="block text-[13px] will-copy-muted mt-0.5 leading-relaxed">
                              {door.humanSubtitle}
                            </span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="hidden lg:block lg:col-span-7 min-h-[52vh]" aria-hidden="true" />
            </div>
          </div>
        )}

        {!isEntrance && (
          <div className="max-w-2xl mx-auto w-full px-5 sm:px-8 py-8 space-y-8">
            {messages
              .filter((m) => m.id !== 'welcome-msg' && !m.id.startsWith('welcome-'))
              .map((msg) => {
                const isUser = msg.role === 'user';
                const isInspectOpen = expandedInspectId === msg.id;
                getContextVisuals(msg.detectedContext?.type);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-2 text-[11px] text-[#ead6b4]/45">
                        <span className="font-serif text-[14px] text-[#e8c37a]">Will</span>
                        {msg.detectedContext && msg.detectedContext.type !== 'general' && (
                          <span className="font-mono text-[10px] text-[#e8c37a]/70">
                            {msg.detectedContext.badgeLabel}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[94%] text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'will-msg-user rounded-sm px-4 py-3 text-[#ead6b4]'
                          : 'will-msg-will text-[#ead6b4]/90'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-1 text-[#ead6b4]/35">
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.content)}
                          className={`p-1.5 min-h-11 min-w-11 flex items-center justify-center ${
                            speakingId === msg.id ? 'text-[#e8c37a]' : ''
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
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center"
                          title="Copiar texto"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedInspectId(isInspectOpen ? null : msg.id)}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 hover:text-[#e8c37a]"
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
                    )}

                    {!isUser && isInspectOpen && (
                      <div className="w-full p-4 arch-glass text-xs text-[#ead6b4]/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium pb-2">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Garantía de No Directividad y Rigor</span>
                        </div>
                        <ul className="text-[11px] text-[#ead6b4]/60 space-y-1.5">
                          <li>
                            <strong>Sin juicios ni prescripciones:</strong> No se imponen
                            decisiones ni metas clínicas.
                          </li>
                          <li>
                            <strong>Diferenciación clara:</strong> Cada práctica se trata con su
                            propia identidad técnica.
                          </li>
                          <li>
                            <strong>Soberanía de la persona:</strong> La decisión final sobre tu
                            cuerpo permanece 100% en ti.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-[#ead6b4]/50">
                <span className="font-serif text-[#e8c37a]">Will</span>
                <span>está preparando la respuesta...</span>
                <RefreshCw className="w-3 h-3 animate-spin text-[#e8c37a]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {showDimensionBar && (
        <div className="relative z-10 mx-4 mb-2 p-2.5 arch-glass shrink-0 space-y-1.5">
          <span className="text-[10px] uppercase font-mono text-[#ead6b4]/50 block">
            Lentes opcionales de acompañamiento (no obligatorios):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setCurrentDimension('all')}
              className={`px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
                currentDimension === 'all' ? 'will-nav-item-active' : 'text-[#ead6b4]/60'
              }`}
            >
              Libre / Sin lente
            </button>
            {PRESENTE_DIMENSIONS.map((dim) => {
              const isActive = currentDimension === dim.name;
              return (
                <button
                  key={dim.code}
                  type="button"
                  onClick={() => setCurrentDimension(dim.name)}
                  className={`px-2.5 py-1 text-[11px] font-medium whitespace-nowrap flex items-center gap-1 ${
                    isActive ? 'will-nav-item-active' : 'text-[#ead6b4]/60'
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

      {liveContext && liveContext.type !== 'general' && !isEntrance && (
        <div className="relative z-10 mx-auto w-full max-w-2xl px-5 mb-1.5 flex items-center gap-2 text-[11px] text-[#ead6b4]/45 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8c37a]" />
          <span>Tema identificado:</span>
          <span className="text-[#ead6b4]/80 truncate">{liveContext.label}</span>
          <span className="ml-auto font-mono text-[#e8c37a]/70">Sin juzgar</span>
        </div>
      )}

      <div className="relative z-10 shrink-0 px-4 sm:px-8 pb-4 pt-2">
        <div className="max-w-2xl mx-auto lg:ml-12 lg:mr-auto">
          <div className="will-composer px-2 py-1 flex items-end gap-1">
            <textarea
              ref={textareaRef}
              id="chat-user-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe lo que quieras contar, preguntar o explorar..."
              rows={1}
              className="w-full bg-transparent text-[#ead6b4] placeholder-[#cbbba0]/45 text-sm resize-none focus:outline-none px-4 py-2.5 max-h-32 min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowDimensionBar(!showDimensionBar)}
              className="p-2.5 text-[#ead6b4]/35 hover:text-[#e8c37a] min-h-11 min-w-11 flex items-center justify-center"
              title="Ajustar lentes de conversación"
              aria-label="Lentes P.R.E.S.E.N.T.E."
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2.5 text-[#ead6b4]/35 hover:text-[#e8c37a] min-h-11 min-w-11 flex items-center justify-center"
              title="Reiniciar conversación"
              aria-label="Reiniciar conversación"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              id="chat-send-btn"
              type="button"
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
    </div>
  );
};
