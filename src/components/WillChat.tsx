import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
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
import { invitationFor, isConversationDoor, isExplorationDomain } from '../protocol/willEntry';
import { PagerArrows } from './PagerArrows';
import {
  MessageVoiceControls,
  VoiceStateLine,
  WillFinishTalkButton,
  WillMicButton,
  WillMuteButton,
  useWillSpeak,
} from './WillVoice';
import { VoiceUiState } from '../voice/willVoice';

interface WillChatProps {
  onSelectDimension?: (code: PresenteCode) => void;
  currentDimension: string;
  setCurrentDimension: (dim: string) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onGoNextScene?: () => void;
  onOpenExploration?: (domainId: string) => void;
}

const WELCOME_TEXT =
  'Hola. Soy Will.\n\nEste es un espacio confidencial para hablar, preguntar o informarte con rigor y sin que nadie te juzgue ni te diga lo que tienes que hacer.\n\nTú marcas el ritmo y el contenido. Puedes elegir uno de los temas de abajo o simplemente escribir lo que te pasa.';

// Voice/STT can occasionally misclassify a later turn as another language.
// The conversation language must remain stable unless the person explicitly changes it.
const CONVERSATION_LANGUAGE_GUARD =
  '[Continuidad de idioma: la conversación actual está en castellano. Mantén el castellano aunque una transcripción aislada parezca pertenecer a otro idioma. Solo cambia de idioma si la persona lo solicita explícitamente o empieza a comunicarse de forma inequívoca y sostenida en otro idioma.]';

function WillSpoken({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) {
          return (
            <strong key={i} className="font-semibold">
              {bold[1]}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export const WillChat: React.FC<WillChatProps> = ({
  currentDimension,
  setCurrentDimension,
  initialPrompt,
  onClearInitialPrompt,
  onGoNextScene,
  onOpenExploration,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceUiState>('idle');
  const speak = useWillSpeak();
  const autoPlayed = useRef<Set<string>>(new Set(['welcome-msg']));
  const speakRef = useRef(speak);
  speakRef.current = speak;
  const [showDimensionBar, setShowDimensionBar] = useState(false);
  const [expandedInspectId, setExpandedInspectId] = useState<string | null>(null);
  const [selectedContextOverride, setSelectedContextOverride] = useState<ContextCategory | 'auto'>('auto');
  const [activeDoorId, setActiveDoorId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, speak.reveal, speak.loadingId]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    if (last.id === 'welcome-msg' || last.id.startsWith('welcome-')) return;
    if (autoPlayed.current.has(last.id)) return;
    autoPlayed.current.add(last.id);
    speakRef.current.unlock();
    void speakRef.current.play(last.id, last.content);
  }, [messages]);

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
  const doors = HUMAN_ENTRANCE_DOORS.filter((d) => d.quickPrompt);
  const activeDoor = doors.find((d) => d.id === activeDoorId);
  const activeDoorIndex = doors.findIndex((d) => d.id === activeDoorId);

  const welcomeMessage = (): ChatMessage => ({
    id: 'welcome-msg',
    role: 'assistant',
    content: WELCOME_TEXT,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const handleSend = async (textToSend?: string, history?: ChatMessage[]) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const base = history ?? messages;

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
        base.map((m) => ({ role: m.role, content: m.content }))
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

    const newMessages = [...base, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    speak.unlock();

    try {
      const conversationMessages = [
        { role: 'assistant', content: CONVERSATION_LANGUAGE_GUARD },
        ...newMessages
          .filter((m) => m.id !== 'welcome-msg' && !m.content.startsWith('Hola. Soy Will'))
          .map((m) => ({ role: m.role, content: m.content })),
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationMessages,
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

  const fitComposer = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const handleTranscript = (text: string) => {
    setInput(text);
    requestAnimationFrame(fitComposer);
  };

  const handleMicStart = () => {
    speak.stop();
    setVoiceState('listening');
  };

  const handleMicState = (next: VoiceUiState) => {
    setVoiceState(next);
  };

  const sendCurrentInput = () => {
    const value = input.trim();
    if (!value || isLoading) return;
    handleSend(value);
  };

  const clearConversation = () => {
    speak.clear();
    setMessages([welcomeMessage()]);
    setInput('');
    setVoiceState('idle');
    setExpandedInspectId(null);
    setActiveDoorId(null);
  };

  const chooseDoor = (id: string) => {
    setActiveDoorId(id);
  };

  const submitDoor = () => {
    const door = activeDoor;
    if (!door?.quickPrompt) return;
    setActiveDoorId(null);
    handleSend(door.quickPrompt);
  };

  const contextLabel = liveContext?.badgeLabel || '';

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-4 sm:px-6">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          {isEntrance && (
            <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="space-y-3 text-[15px] leading-7 text-white/85">
                {welcomeParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {doors.map((door) => (
                  <button
                    key={door.id}
                    type="button"
                    onClick={() => chooseDoor(door.id)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition hover:bg-white/[0.08]"
                  >
                    {door.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user';
            const visible = isUser ? message.content : speak.visibleText(message.id, message.content);
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[92%] rounded-3xl px-4 py-3 text-[15px] leading-7 sm:max-w-[78%] ${
                    isUser
                      ? 'bg-white text-black shadow-sm'
                      : 'border border-white/10 bg-white/[0.045] text-white/90'
                  }`}
                >
                  <WillSpoken text={visible} />
                  {!isUser && message.id !== 'welcome-msg' && (
                    <MessageVoiceControls
                      messageId={message.id}
                      text={message.content}
                      speak={speak}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/55">
                Will está pensando…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {activeDoor && (
        <div className="absolute inset-x-4 bottom-28 z-20 mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-white">{activeDoor.label}</div>
            <button
              type="button"
              onClick={() => setActiveDoorId(null)}
              className="rounded-full px-2 py-1 text-xs text-white/55 hover:text-white"
            >
              Cerrar
            </button>
          </div>
          <div className="text-sm leading-6 text-white/70">{invitationFor(activeDoor)}</div>
          <button
            type="button"
            onClick={submitDoor}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Empezar
          </button>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl items-end gap-2">
          <div className="relative min-w-0 flex-1">
            {contextLabel && (
              <div className="absolute -top-7 left-2 text-xs text-white/45">{contextLabel}</div>
            )}
            <textarea
              id="chat-user-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                fitComposer();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Escribe o habla con Will…"
              rows={1}
              className="max-h-[180px] min-h-[48px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] leading-6 text-white outline-none placeholder:text-white/35 focus:border-white/20"
            />
          </div>

          <WillMicButton
            currentText={input}
            onStartListening={handleMicStart}
            onTranscript={handleTranscript}
            state={voiceState}
            setState={handleMicState}
          />

          <button
            type="button"
            onClick={sendCurrentInput}
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Enviar mensaje"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="mx-auto mt-2 flex max-w-4xl items-center justify-between px-1 text-[11px] text-white/35">
          <div className="flex items-center gap-2">
            <VoiceStateLine state={voiceState} />
            <WillMuteButton speak={speak} />
          </div>
          <button type="button" onClick={clearConversation} className="hover:text-white/65">
            Limpiar conversación
          </button>
        </div>
      </div>
    </div>
  );
};
