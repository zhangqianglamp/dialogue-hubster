
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isAI: boolean;
  isStreaming?: boolean;
}

export const ChatMessage = ({ content, isAI, isStreaming }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "py-6 px-4 rounded-lg mb-4 fade-in glass",
        isAI ? "mr-12" : "ml-12",
        isStreaming && "pulse"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "rounded-full w-8 h-8 flex items-center justify-center",
            isAI ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {isAI ? "AI" : "我"}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};
