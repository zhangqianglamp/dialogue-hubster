import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Docs = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const endpoints = {
    chat: [
      {
        method: "POST",
        path: "/api/chat/completions",
        title: "创建对话完成",
        description: "创建一个新的对话完成，支持流式响应",
        request: {
          body: {
            messages: [
              {
                role: "user",
                content: "你好，请介绍一下你自己"
              }
            ],
            stream: true,
            temperature: 0.7,
            model: "gpt-3.5-turbo"
          }
        },
        response: {
          success: {
            id: "chatcmpl-123",
            object: "chat.completion.chunk",
            created: 1694268190,
            model: "gpt-3.5-turbo-0613",
            choices: [
              {
                delta: {
                  content: "你好！我是一个AI助手..."
                },
                index: 0,
                finish_reason: null
              }
            ]
          },
          error: {
            error: {
              message: "Invalid request",
              type: "invalid_request_error"
            }
          }
        }
      },
      {
        method: "POST", 
        path: "/api/chat/messages",
        title: "获取历史消息",
        description: "获取指定对话的历史消息记录",
        request: {
          body: {
            chat_id: "chat_123456"
          }
        },
        response: {
          success: {
            messages: [
              {
                id: "msg_1",
                role: "user",
                content: "你好",
                created_at: "2024-03-20T10:00:00Z"
              },
              {
                id: "msg_2", 
                role: "assistant",
                content: "你好！有什么我可以帮你的吗？",
                created_at: "2024-03-20T10:00:01Z"
              }
            ]
          }
        }
      }
    ],
    auth: [
      {
        method: "POST",
        path: "/api/auth/login",
        title: "用户登录",
        description: "使用手机号和验证码登录",
        request: {
          body: {
            phone: "13800138000",
            code: "123456"
          }
        },
        response: {
          success: {
            token: "eyJhbGciOiJIUzI1NiIs...",
            user: {
              id: "user_123",
              phone: "13800138000"
            }
          }
        }
      },
      {
        method: "POST",
        path: "/api/auth/send-code",
        title: "发送验证码",
        description: "向指定手机号发送登录验证码",
        request: {
          body: {
            phone: "13800138000"
          }
        },
        response: {
          success: {
            message: "验证码已发送"
          }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="light" isAuthenticated={false} />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-sm max-w-none">
          <h1 className="text-4xl font-bold mb-8">API 文档</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">介绍</h2>
            <p className="text-gray-600 mb-4">
              欢迎使用我们的 API！本文档将帮助你了解如何集成和使用我们的大语言模型服务。
              所有的 API 请求都需要在 Header 中包含你的 API Token：
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <code className="text-sm text-gray-900 font-medium">
                Authorization: Bearer your_api_token
              </code>
            </div>
          </div>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">对话接口</TabsTrigger>
              <TabsTrigger value="auth">认证接口</TabsTrigger>
            </TabsList>

            {Object.entries(endpoints).map(([category, apis]) => (
              <TabsContent key={category} value={category}>
                <Accordion type="single" collapsible className="w-full">
                  {apis.map((api, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4">
                          <Badge variant={api.method === "GET" ? "secondary" : "default"}>
                            {api.method}
                          </Badge>
                          <span className="font-mono text-sm">{api.path}</span>
                          <span className="text-gray-600 text-sm">{api.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4">
                          <p className="text-gray-600">{api.description}</p>
                          
                          <div>
                            <h4 className="font-semibold mb-2">请求参数</h4>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code className="text-sm text-gray-900 font-medium whitespace-pre-wrap">
                                {JSON.stringify(api.request, null, 2)}
                              </code>
                            </pre>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">响应示例</h4>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code className="text-sm text-gray-900 font-medium whitespace-pre-wrap">
                                {JSON.stringify(api.response, null, 2)}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Docs; 