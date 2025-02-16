import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
  onAuth: () => void;
}

export const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = () => {
    if (!phone) {
      toast({
        title: "请输入手机号",
        variant: "destructive",
      });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast({
        title: "请输入正确的手机号",
        variant: "destructive",
      });
      return;
    }
    // 直接发送验证码
    toast({
      title: "验证码已发送",
      description: "测试环境验证码：123456", // 开发环境显示测试验证码
    });
    startCountdown();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !code) {
      toast({
        title: "请填写完整信息",
        variant: "destructive",
      });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast({
        title: "请输入正确的手机号",
        variant: "destructive",
      });
      return;
    }
    // 在开发环境下使用固定的测试验证码
    if (code !== "123456") {
      toast({
        title: "验证码错误",
        description: "测试环境请使用：123456",
        variant: "destructive",
      });
      return;
    }
    onAuth();
    toast({
      title: mode === "login" ? "登录成功" : "注册成功",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "login" ? "登录" : "注册"}</CardTitle>
        <CardDescription>
          {mode === "login" ? "欢迎回来" : "创建新账号"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="whitespace-nowrap"
                disabled={countdown > 0}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <Button type="submit" className="w-full">
              {mode === "login" ? "登录" : "注册"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" 
                ? "没有账号？立即注册" 
                : "已有账号？立即登录"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
