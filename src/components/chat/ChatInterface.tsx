import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  // 从 localStorage 初始化聊天数据
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    const savedCurrentChatId = localStorage.getItem('currentChatId');
    return savedCurrentChatId || null;
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  // 监听 chats 变化，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // 监听 currentChatId 变化，保存到 localStorage
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }, [currentChatId]);

  // 创建新对话
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "新对话", // 初始标题
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

    // 更新当前对话的消息，并更新标题
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, userMessage];
        // 如果这是第一条用户消息，将其作为标题
        const shouldUpdateTitle = chat.messages.length === 0;
        const newTitle = shouldUpdateTitle 
          ? content.length > 20 
            ? content.slice(0, 20) + '...' 
            : content
          : chat.title;

        return {
          ...chat,
          title: newTitle,
          messages: updatedMessages,
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

  // 删除单个对话
  const handleDeleteChat = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 防止触发对话选择
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
    toast({
      description: "对话已删除",
    });
  };

  // 清空所有对话
  const handleClearAllChats = () => {
    setChats([]);
    setCurrentChatId(null);
    setShowClearAllDialog(false);
    toast({
      description: "所有对话已清空",
    });
  };

  // 如果没有对话，自动创建一个新对话
  if (chats.length === 0) {
    createNewChat();
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] max-w-6xl mx-auto">
      {/* 左侧边栏 */}
      <div className="w-64 bg-gray-50 p-4 border-r glass">
        <div className="flex flex-col space-y-4">
          <Button
            onClick={createNewChat}
            className="w-full"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            新建对话
          </Button>
          
          <Button
            onClick={() => setShowClearAllDialog(true)}
            className="w-full"
            variant="ghost"
            disabled={chats.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            清空所有对话
          </Button>
        </div>
        
        <div className="space-y-2 mt-4">
          {chats.map(chat => (
            <div key={chat.id} className="group relative">
              <Button
                onClick={() => setCurrentChatId(chat.id)}
                variant={currentChatId === chat.id ? "secondary" : "ghost"}
                className="w-full justify-start pr-8"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <span className="truncate">{chat.title}</span>
              </Button>
              <Button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 清空所有对话的确认对话框 */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清空所有对话？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除所有对话历史记录，且不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllChats}>
              确认清空
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
