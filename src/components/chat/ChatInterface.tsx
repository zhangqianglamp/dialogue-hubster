
import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export const ChatInterface = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  // 创建新对话
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `新对话 ${chats.length + 1}`,
      messages: [],
      createdAt: new Date(),
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  // 获取当前对话
  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
    };

    // 更新当前对话的消息
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
        };
      }
      return chat;
    }));

    // 模拟 AI 响应
    setIsStreaming(true);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isAI: true,
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, aiMessage],
        };
      }
      return chat;
    }));

    // 模拟流式响应
    const response = "这是一个模拟的 AI 回复。在实际实现中，这里将会是来自 AI 模型 API 的流式响应。";
    let currentResponse = "";
    
    for (const char of response) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      currentResponse += char;
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, content: currentResponse }
                : msg
            ),
          };
        }
        return chat;
      }));
    }

    setIsStreaming(false);
  };

  // 如果没有对话，自动创建一个新对话
  if (chats.length === 0) {
    createNewChat();
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] max-w-6xl mx-auto">
      {/* 左侧边栏 */}
      <div className="w-64 bg-gray-50 p-4 border-r glass">
        <Button
          onClick={createNewChat}
          className="w-full mb-4"
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          新建对话
        </Button>
        
        <div className="space-y-2">
          {chats.map(chat => (
            <Button
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              variant={currentChatId === chat.id ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isAI={message.isAI}
              isStreaming={isStreaming && message.isAI && 
                currentChat.messages[currentChat.messages.length - 1].id === message.id}
            />
          ))}
        </div>
        <div className="p-4">
          <ChatInput onSend={handleSendMessage} disabled={isStreaming || !currentChatId} />
        </div>
      </div>
    </div>
  );
};
