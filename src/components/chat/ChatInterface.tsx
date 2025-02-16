import { useState, useEffect, useRef } from "react";
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
import { apiClient } from "@/lib/api-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/config/models";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  role: 'user' | 'assistant';
  timestamp?: number;
  startTime?: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  model: string;
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

  // 在文件顶部的 imports 下面添加一个新的 ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 在文件顶部添加 useState 导入
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // 获取当前对话 - 将这个声明移到 useEffect 之前
  const currentChat = chats.find(chat => chat.id === currentChatId);

  // 添加一个滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // 监听 currentChatId 和 currentChat?.messages 的变化
  useEffect(() => {
    if (currentChat?.messages?.length) {
      scrollToBottom();
    }
  }, [currentChatId, currentChat?.messages]);

  // 创建新对话
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "新对话",
      messages: [],
      createdAt: new Date(),
      model: DEFAULT_MODEL.id,
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  // 如果没有对话，自动创建一个新对话 - 移到 useEffect 中
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length]);

  // 添加模型选择处理函数
  const handleModelChange = (modelId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          model: modelId
        };
      }
      return chat;
    }));
  };

  // 添加停止对话的函数
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  // 修改 handleSendMessage 函数，在发送请求前创建新的 AbortController
  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    // 创建新的 AbortController
    const controller = new AbortController();
    setAbortController(controller);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
      role: 'user',
    };

    // 更新当前对话的消息，并更新标题
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, userMessage];
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

    // 创建空的AI消息，记录开始时间
    setIsStreaming(true);
    const startTime = Date.now();
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isAI: true,
      role: 'assistant',
      startTime, // 添加开始时间
    };

    // 添加空的AI消息到对话中
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, aiMessage],
        };
      }
      return chat;
    }));

    try {
      const stream = await apiClient.createChatCompletion(
        [{ role: 'user', content }],
        currentChat?.model,
        controller.signal // 传入 signal
      );

      let currentResponse = "";
      
      // 处理流式响应
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        currentResponse += content;
        
        // 更新AI消息内容
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

      // 在流式响应完成后，更新结束时间
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === aiMessage.id 
                ? { 
                    ...msg, 
                    timestamp: Date.now(), // 结束时间
                    startTime: startTime   // 确保保留开始时间
                  }
                : msg
            ),
          };
        }
        return chat;
      }));

    } catch (error) {
      // 判断是否是用户主动取消
      if (error.name === 'AbortError') {
        toast({
          description: "已停止生成",
        });
        return;
      }

      console.error('API调用错误:', error);
      toast({
        title: "发生错误",
        description: "与AI对话时出现问题，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
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

  return (
    <div className="flex h-[calc(100vh-64px)] max-w-6xl mx-auto">
      {/* 左侧边栏 - 添加 overflow-hidden */}
      <div className="w-64 bg-gray-50 p-4 border-r glass flex flex-col overflow-hidden">
        {/* 新建对话按钮 - 保持不变 */}
        <Button
          onClick={createNewChat}
          className="w-full mb-4 shrink-0"
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          新建对话
        </Button>
        
        {/* 对话列表 - 优化滚动区域 */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-2">
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

        {/* 清空所有对话按钮 - 添加 shrink-0 防止压缩 */}
        <Button
          onClick={() => setShowClearAllDialog(true)}
          className="w-full mt-4 shrink-0"
          variant="ghost"
          disabled={chats.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          清空所有对话
        </Button>
      </div>

      {/* 右侧聊天区域 - 优化布局 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 聊天消息区域 - 优化滚动 */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
          {currentChat?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isAI={message.isAI}
              isStreaming={isStreaming && message.isAI && 
                currentChat.messages[currentChat.messages.length - 1].id === message.id}
              timestamp={message.timestamp}
              startTime={message.startTime}
              onStop={message.isAI && isStreaming ? handleStopGeneration : undefined}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* 添加模型选择器 */}
        <div className="px-4 py-3 border-t bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">请选择你需要的模型</span>
            <Select
              value={currentChat?.model}
              onValueChange={handleModelChange}
              disabled={isStreaming}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span>{model.name}</span>
                      <span className="text-xs text-gray-500">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 输入区域 - 添加 shrink-0 防止压缩 */}
        <div className="p-4 border-t bg-background">
          <ChatInput 
            onSend={handleSendMessage} 
            disabled={!currentChatId}
          />
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
    </div>
  );
};
