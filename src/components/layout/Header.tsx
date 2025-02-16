import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  onLoginClick?: () => void;
  isAuthenticated: boolean;
  variant?: 'dark' | 'light';
}

export const Header = ({ onLoginClick = () => {}, isAuthenticated, variant = 'dark' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = variant === 'dark';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur",
      isDark 
        ? "border-gray-800/50 bg-gray-950/90 supports-[backdrop-filter]:bg-gray-950/80" 
        : "border-gray-200/20 bg-white/50 supports-[backdrop-filter]:bg-white/50"
    )}>
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-8">
          <a href="/" className="flex items-center space-x-2">
            <Logo />
            <span className={cn(
              "hidden font-bold sm:inline-block",
              isDark ? "text-white" : "text-gray-900"
            )}>
              AI Chat
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          <a
            href="/features"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            功能特点
          </a>
          <a
            href="/pricing"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            定价方案
          </a>
          <a
            href="/docs"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            开发文档
          </a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              退出登录
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white"
                onClick={onLoginClick}
              >
                登录
              </Button>
              <Button onClick={onLoginClick}>
                免费使用
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-400" />
          ) : (
            <Menu className="h-6 w-6 text-gray-400" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            "absolute top-full left-0 right-0 bg-gray-950/90 border-b md:hidden",
            "transition-all duration-300 ease-in-out",
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <nav className="container py-4">
            <div className="flex flex-col space-y-4">
              <a
                href="/features"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                功能特点
              </a>
              <a
                href="/pricing"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                定价方案
              </a>
              <a
                href="/docs"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                开发文档
              </a>
              <hr className="border-gray-800" />
              {isAuthenticated ? (
                <Button variant="ghost" className="justify-start text-gray-400 hover:text-white">
                  退出登录
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-400 hover:text-white"
                    onClick={onLoginClick}
                  >
                    登录
                  </Button>
                  <Button 
                    className="justify-start"
                    onClick={onLoginClick}
                  >
                    免费使用
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}; 