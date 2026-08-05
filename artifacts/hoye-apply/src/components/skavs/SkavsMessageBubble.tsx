import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { type SkavsMessage, type SkavsAction } from "@/lib/skavs-brain";
import ReactMarkdown from "react-markdown";

type Props = {
  message: SkavsMessage;
  onAction: (value: string) => void;
};

export function SkavsMessageBubble({ message, onAction }: Props) {
  const isSkavs = message.role === "skavs";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isSkavs ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      {isSkavs && (
        <div className="w-7 h-7 rounded-full bg-[#002147] flex items-center justify-center shrink-0 mb-1">
          <Bot className="w-4 h-4 text-yellow-400" />
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[85%] ${isSkavs ? "" : "items-end"}`}>
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
            isSkavs
              ? "bg-white rounded-2xl rounded-bl-sm text-gray-800"
              : "rounded-2xl rounded-br-sm text-white"
          }`}
          style={!isSkavs ? { background: "#002147" } : {}}
        >
          {isSkavs ? (
            <div className="prose prose-sm max-w-none [&_strong]:text-[#002147] [&_p]:my-0.5 [&_ul]:my-1 [&_li]:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <span>{message.content}</span>
          )}
        </div>

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {message.actions.map((action: SkavsAction) => (
              <button
                key={action.value}
                onClick={() => onAction(action.value)}
                className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all hover:shadow-sm active:scale-95"
                style={{
                  borderColor: "#D4AF37",
                  color: "#002147",
                  background: "#FFFBEB",
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}
