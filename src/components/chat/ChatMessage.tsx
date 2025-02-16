import { cn } from "@/lib/utils";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import { useState, useCallback } from 'react';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { AiOutlineFieldTime } from 'react-icons/ai';
import { TbTextSize } from 'react-icons/tb';
import { Button } from "@/components/ui/button";
import { StopCircle, Copy, Check } from "lucide-react";

// 注册需要的语言
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);

interface ChatMessageProps {
  content: string;
  isAI: boolean;
  isStreaming?: boolean;
  timestamp?: number;
  startTime?: number;
  onStop?: () => void;
}

export const ChatMessage = ({ content, isAI, isStreaming, timestamp, startTime, onStop }: ChatMessageProps) => {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 计算字数
  const wordCount = content.trim().length;
  
  // 计算耗时（使用开始时间和结束时间）
  const duration = (timestamp && startTime) 
    ? `${((timestamp - startTime) / 1000).toFixed(1)}秒` 
    : '未知';

  // 添加复制功能
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后重置状态
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [content]);

  return (
    <div
      className={cn(
        "py-6 px-4 rounded-lg mb-4 fade-in glass relative",
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
          {isAI ? (
            <>
              {/* 添加一个包装器div，用于控制内容和复制按钮的布局 */}
              <div className="relative">
                {/* 复制按钮移到这里，调整位置 */}
                {!isStreaming && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -right-2 -top-2 h-8 w-8 p-0 opacity-50 hover:opacity-100"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                {/* 为内容添加右侧padding，避免与复制按钮重叠 */}
                <div className="pr-8">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm dark:prose-invert max-w-none"
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-muted px-1.5 py-0.5 rounded-md" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content}
                  </Markdown>
                </div>
              </div>
              
              {/* AI回复的统计信息和操作按钮 */}
              <div className="mt-2 flex justify-between items-center">
                {/* 左侧统计信息 */}
                {!isStreaming && (
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <AiOutlineFieldTime className="w-4 h-4" />
                      <span>耗时：{duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TbTextSize className="w-4 h-4" />
                      <span>字数：{wordCount}</span>
                    </div>
                    <button 
                      onClick={() => setLiked(!liked)} 
                      className="flex items-center gap-1 hover:text-blue-500"
                    >
                      {liked ? <BiSolidLike className="w-4 w-4 text-blue-500" /> : <BiLike className="w-4 w-4" />}
                      <span>{liked ? '已点赞' : '点赞'}</span>
                    </button>
                  </div>
                )}
                
                {/* 右侧停止按钮 */}
                {isStreaming && onStop && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onStop}
                    className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <StopCircle className="h-4 w-4 mr-1" />
                    停止生成
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute -right-2 -top-2 h-8 w-8 p-0 opacity-50 hover:opacity-100"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              
              <div className="pr-8">
                <p className="text-sm leading-relaxed">{content}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
