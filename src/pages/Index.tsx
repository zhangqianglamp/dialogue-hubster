
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {isAuthenticated ? (
        <ChatInterface />
      ) : (
        <div className="container max-w-lg mx-auto pt-20">
          <AuthForm onAuth={() => setIsAuthenticated(true)} />
        </div>
      )}
    </div>
  );
};

export default Index;
