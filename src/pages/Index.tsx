import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen tech-background p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8 pt-6">
        大模型问答系统
      </h1>
      {isAuthenticated ? (
        <ChatInterface />
      ) : (
        <div className="container max-w-lg mx-auto pt-10">
          <AuthForm onAuth={() => setIsAuthenticated(true)} />
        </div>
      )}
    </div>
  );
};

export default Index;
