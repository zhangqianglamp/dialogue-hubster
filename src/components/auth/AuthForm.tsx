
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

type AuthMode = "login" | "register";

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "register" && !agreed) {
      toast({
        title: "需要同意服务条款",
        description: "请阅读并同意服务条款以继续。",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: mode === "login" ? "欢迎回来！" : "账号创建成功",
      description: "您已成功登录。",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto glass">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "欢迎回来" : "创建账号"}
        </CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "请输入您的登录信息" 
            : "请填写以下信息以开始使用"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="电子邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass"
            />
          </div>
          
          {mode === "register" && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                我同意{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    toast({
                      title: "服务条款",
                      description: "这里将显示服务条款内容。",
                    });
                  }}
                >
                  服务条款
                </button>
              </label>
            </div>
          )}

          <div className="space-y-4">
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
