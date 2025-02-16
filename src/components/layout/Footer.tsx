import { Github } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-3 border-t border-gray-800/50 bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80">
      <div className="container flex flex-col items-center justify-between gap-2 md:flex-row md:py-0">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">
            © {currentYear} AI Chat
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-xs text-gray-500">
            由 AI 提供技术支持
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
          <nav className="flex items-center gap-4">
            <a
              href="/terms"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              服务条款
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              隐私政策
            </a>
            <a
              href="/about"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              关于我们
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}; 