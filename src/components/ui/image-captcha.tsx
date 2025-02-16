import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface ImageCaptchaProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const ImageCaptcha = ({ onSuccess, onClose }: ImageCaptchaProps) => {
  const [captchaCode, setCaptchaCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  // 生成随机验证码
  const generateCaptcha = () => {
    const code = Math.random().toString().slice(-4);
    setCaptchaCode(code);
    setUserInput("");
    setError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput === captchaCode) {
      onSuccess();
    } else {
      setError(true);
      generateCaptcha();
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>请输入验证码</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {/* 验证码显示区域 */}
            <div className="relative">
              <div 
                className="bg-primary/10 p-4 rounded-lg text-2xl font-bold tracking-[0.5em] text-center"
                style={{
                  fontFamily: 'monospace',
                  userSelect: 'none',
                  textDecoration: 'line-through',
                  backgroundImage: 'repeating-linear-gradient(45deg, #0001 0px, #0001 2px, transparent 2px, transparent 4px)',
                }}
              >
                {captchaCode}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -right-12 top-1/2 -translate-y-1/2"
                onClick={generateCaptcha}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="请输入图片中的验证码"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              maxLength={4}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500">验证码错误，请重新输入</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">
              确认
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 