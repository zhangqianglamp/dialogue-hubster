import { ChatInterface } from "@/components/chat/ChatInterface";
import { withAuth } from "@/components/auth/withAuth";
import { Header } from "@/components/layout/Header";

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-blue-50/80">
      <Header isAuthenticated={true} variant="light" />
      <div className="container py-6">
        <ChatInterface />
      </div>
    </div>
  );
};

export default withAuth(ChatPage); 