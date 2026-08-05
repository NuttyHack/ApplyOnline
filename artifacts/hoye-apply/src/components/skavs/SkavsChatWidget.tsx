import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Send,
  Paperclip,
  Bot,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
} from "lucide-react";
import {
  getGreeting,
  getResponse,
  getDocConfirmMessage,
  type SkavsMessage,
  type SkavsState,
  type Language,
} from "@/lib/skavs-brain";
import {
  extractDataFromDocument,
  countExtracted,
  type ExtractedData,
} from "@/lib/document-parser";
import { SkavsMessageBubble } from "./SkavsMessageBubble";
import { ExtractedFieldsReview } from "./ExtractedFieldsReview";

type Props = {
  onApplyExtracted?: (data: ExtractedData) => void;
  onNavigate?: (target: string) => void;
};

export function SkavsChatWidget({ onApplyExtracted, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SkavsMessage[]>([]);
  const [state, setState] = useState<SkavsState>({
    stage: "greeting",
    language: "en",
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null,
  );
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Init greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) { 
      const greeting = getGreeting(state.language);
      setMessages([greeting]);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, extractedData]);

  // Unread badge when closed
  useEffect(() => {
    if (!open && messages.length > 0) {
      setUnreadCount((c) => c + 1);
    }
  }, [messages.length]);

  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
  };

  const simulateTyping = useCallback(
    async (respond: () => { message: SkavsMessage; nextState: SkavsState }) => {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));
      setIsTyping(false);
      const { message, nextState } = respond();
      setMessages((prev) => [...prev, message]);
      setState(nextState);
    },
    [],
  );

  const handleUserMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Navigation actions handled client-side
      if (text === "yearbook") {
        onNavigate?.("yearbook");
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${Date.now()}`,
            role: "user",
            content: "Open Yearbook",
            timestamp: new Date(),
          },
          {
            id: `skavs-${Date.now()}`,
            role: "skavs",
            content:
              state.language === "en"
                ? "📚 Opening the Yearbook for you! You can browse all subjects for Grades 8–12 there."
                : "📚 Ngikuvulela iYearbook! Ungabhrowuza zonke izifundo zamaBanga 8–12 lapho.",
            timestamp: new Date(),
          },
        ]);
        return;
      }
      if (text === "goto_track") {
        onNavigate?.("track");
        return;
      }
      if (text.startsWith("goto_step_")) {
        const step = parseInt(text.replace("goto_step_", ""));
        onNavigate?.(`apply_step_${step}`);
        return;
      }
      if (text === "apply_data" && extractedData) {
        onApplyExtracted?.(extractedData);
        setExtractedData(null);
        setMessages((prev) => [
          ...prev,
          {
            id: `skavs-${Date.now()}`,
            role: "skavs",
            content:
              state.language === "en"
                ? "✅ Done! I've filled in the form with your details. Please review each field and make any corrections before submitting.\n\nWould you like help with anything else?"
                : "✅ Kulungile! Ngigcwalisile ifomu ngemininingwane yakho. Sicela ubuyekeze insimu ngayinye bese ulungisa noma yiziphi izinto ngaphambi kokuthumela.\n\nIngabe ufuna usizo olunye?",
            timestamp: new Date(),
            actions:
              state.language === "en"
                ? [
                    { label: "🏠 Back to menu", value: "menu" },
                    { label: "🎓 Subject help", value: "subjects" },
                  ]
                : [
                    { label: "🏠 Buya kemenyu", value: "menu" },
                    { label: "🎓 Usizo lwezifundo", value: "subjects" },
                  ],
          },
        ]);
        return;
      }

      const userMsg: SkavsMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      await simulateTyping(() => getResponse(text, state));
    },
    [state, extractedData, onApplyExtracted, onNavigate, simulateTyping],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: `📎 Uploaded: **${file.name}**`,
        timestamp: new Date(),
      },
    ]);

    setIsParsingDoc(true);
    try {
      const data = await extractDataFromDocument(file);
      const count = countExtracted(data);
      setExtractedData(data);
      const msg = getDocConfirmMessage(count, state.language);
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `skavs-${Date.now()}`,
          role: "skavs",
          content:
            state.language === "en"
              ? "❌ I had trouble reading that document. Please make sure it's a clear PDF or image, then try again."
              : "❌ Ngibe nenkinga yokufunda idokhumenti leyo. Sicela uqiniseke ukuthi yi-PDF noma isithombe esinokucacisa, bese uzama futhi.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsParsingDoc(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage(input);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={handleOpen}
          className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group"
          style={{
            background: "linear-gradient(135deg, #002147 0%, #003a7a 100%)",
          }}
          aria-label="Open SKAVS assistant"
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? (
              <ChevronDown className="w-7 h-7 text-white" />
            ) : (
              <Bot className="w-7 h-7 text-white" />
            )}
          </motion.div>
          {/* Gold ring pulse */}
          <span className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-50 animate-ping" />
          {/* Unread badge */}
          {!open && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
          {/* SKAVS label */}
          <span
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded"
            style={{ background: "#002147", color: "#D4AF37" }}
          >
            SKAVS
          </span>
        </button>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="skavs-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ height: "560px", border: "1.5px solid #D4AF3730" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{
                background: "linear-gradient(135deg, #002147 0%, #003a7a 100%)",
              }}
            >
              <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-[#002147]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-none">
                  SKAVS
                </p>
                <p className="text-blue-200 text-[11px] mt-0.5">
                  {state.language === "en"
                    ? "Admissions Assistant • Always online"
                    : "Umsizi Wokubhaliswa • Njalo ukufika"}
                </p>
              </div>
              {/* Language toggle */}
              <button
                onClick={() =>
                  handleUserMessage(
                    state.language === "en" ? "switch_zu" : "switch_en",
                  )
                }
                className="text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10 transition-colors"
              >
                {state.language === "en" ? "🇿🇦 ZU" : "🇬🇧 EN"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-blue-200 hover:text-white transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 bg-gray-50">
              <div className="p-3 space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <SkavsMessageBubble
                      key={msg.id}
                      message={msg}
                      onAction={handleUserMessage}
                    />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#002147] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Document parsing loader */}
                {isParsingDoc && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 pl-9">
                    <Loader2 className="w-4 h-4 animate-spin text-[#002147]" />
                    <span>
                      {state.language === "en"
                        ? "Reading your document…"
                        : "Ngifunda idokhumenti lakho…"}
                    </span>
                  </div>
                )}

                {/* Extracted fields review */}
                {extractedData && !isParsingDoc && (
                  <ExtractedFieldsReview
                    data={extractedData}
                    language={state.language}
                    onConfirm={() => handleUserMessage("apply_data")}
                    onCancel={() => {
                      setExtractedData(null);
                      handleUserMessage("upload_doc");
                    }}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div
              className="shrink-0 border-t bg-white px-3 py-2"
              style={{ borderColor: "#D4AF3720" }}
            >
              <div className="flex items-end gap-2">
                {/* File upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#002147] hover:bg-blue-50 transition-colors mb-0.5"
                  title={
                    state.language === "en"
                      ? "Upload document"
                      : "Layisha idokhumenti"
                  }
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    state.language === "en"
                      ? "Type a message… or pick an option above"
                      : "Bhala umlayezo… noma ukhethe indlela ngenhla"
                  }
                  className="flex-1 min-h-[36px] max-h-[100px] resize-none text-sm py-2 border-gray-200 focus:border-[#002147] rounded-xl"
                  rows={1}
                />

                <Button
                  onClick={() => handleUserMessage(input)}
                  disabled={!input.trim()}
                  size="sm"
                  className="shrink-0 w-8 h-8 p-0 rounded-full mb-0.5"
                  style={{ background: "#002147" }}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1">
                SKAVS · Hoye Secondary School
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
