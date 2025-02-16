import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // 在登录成功时保存认证状态
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col tech-background">
      <Header onLoginClick={() => setShowAuthDialog(true)} isAuthenticated={isAuthenticated} />
      <main className="flex-1">
        <div className="container max-w-[1200px] mx-auto px-4 py-24 min-h-[80vh] flex items-center">
          <div className="text-center w-full">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              智能对话，<br className="md:hidden" />
              开启智慧新时代
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              基于先进的大语言模型，为您提供智能、准确、自然的对话体验。
              无论是学习、工作还是生活，都能帮您事半功倍。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg"
                onClick={() => setShowAuthDialog(true)}
              >
                立即开始
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-12 py-6 text-lg"
                onClick={() => window.location.href = '#features'}
              >
                了解更多
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-32 bg-gray-950/50">
          <div className="container max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              为什么选择我们
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-gray-900/50 backdrop-blur p-12 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  智能理解
                </h3>
                <p className="text-gray-400">
                  采用最新的大语言模型技术，能够准确理解用户意图，提供精准的回答和建议。
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur p-12 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  知识丰富
                </h3>
                <p className="text-gray-400">
                  拥有海量的知识储备，涵盖科技、文化、教育等多个领域，满足您的各类需求。
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur p-12 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  安全可靠
                </h3>
                <p className="text-gray-400">
                  采用先进的加密技术，确保您的数据安全。严格的隐私保护措施让您可以放心使用。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-32">
          <div className="container max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              应用场景
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  title: "学习助手",
                  desc: "解答学习疑问，提供知识讲解，帮助您更好地理解和掌握知识点"
                },
                {
                  title: "工作效率",
                  desc: "协助文案创作，提供专业建议，让您的工作更加高效顺畅"
                },
                {
                  title: "技术支持",
                  desc: "解决技术问题，提供编程建议，助您快速突破开发瓶颈"
                },
                {
                  title: "生活顾问",
                  desc: "提供生活建议，解答日常困惑，让生活更加便捷美好"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-900/30 backdrop-blur p-8 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-b from-gray-950/50 to-gray-900/50">
          <div className="container max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              准备好开始了吗？
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              立即加入我们，体验智能对话的魅力，开启效率提升之旅
            </p>
            <Button 
              size="lg" 
              className="px-12 py-6 text-lg"
              onClick={() => setShowAuthDialog(true)}
            >
              免费开始使用
            </Button>
          </div>
        </section>

        {/* Auth Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>用户登录</DialogTitle>
              <DialogDescription>
                请使用手机号登录或注册账号
              </DialogDescription>
            </DialogHeader>
            <AuthForm 
              onAuth={() => {
                setIsAuthenticated(true);
                setShowAuthDialog(false);
              }} 
            />
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
