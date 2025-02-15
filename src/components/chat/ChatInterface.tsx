
import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response streaming
    setIsStreaming(true);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isAI: true,
    };
    setMessages((prev) => [...prev, aiMessage]);

    // Simulate streaming response
    const response = "这是一个模拟的 AI 回复。在实际实现中，这里将会是来自 AI 模型 API 的流式响应。";
    let currentResponse = "";
    
    for (const char of response) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      currentResponse += char;
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessage.id 
            ? { ...msg, content: currentResponse }
            : msg
        )
      );
    }

    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isAI={message.isAI}
            isStreaming={isStreaming && message.isAI && messages[messages.length - 1].id === message.id}
          />
        ))}
      </div>
      <div className="p-4">
        <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
};
