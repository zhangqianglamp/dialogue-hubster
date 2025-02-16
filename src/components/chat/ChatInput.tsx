import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  // 添加键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果按下 Enter 键且没有按住 Shift 键
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认的换行行为
      if (message.trim() && !disabled) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 glass rounded-lg">
      <div className="flex gap-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入您的消息..."
          className="flex-1 min-h-[80px] glass"
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !message.trim()}
          className="self-end"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
