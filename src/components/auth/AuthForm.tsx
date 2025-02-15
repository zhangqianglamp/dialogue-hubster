
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
        title: "Terms Agreement Required",
        description: "Please accept the terms of service to continue.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual authentication
    toast({
      title: mode === "login" ? "Welcome back!" : "Account created",
      description: "You have been successfully authenticated.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto glass">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Enter your credentials to continue" 
            : "Fill in your details to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
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
                I agree to the{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    toast({
                      title: "Terms of Service",
                      description: "Terms content would be displayed here.",
                    });
                  }}
                >
                  terms of service
                </button>
              </label>
            </div>
          )}

          <div className="space-y-4">
            <Button type="submit" className="w-full">
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" 
                ? "Need an account? Register" 
                : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
