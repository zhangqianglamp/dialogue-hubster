import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "免费版",
      description: "适合个人尝试和学习使用",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "每日 10 次免费对话",
        "基础模型支持",
        "最大 2000 字符输入",
        "标准响应速度",
        "基础客服支持",
      ],
      limitations: [
        "不支持高级模型",
        "无 API 访问权限",
        "无优先响应",
      ]
    },
    {
      name: "专业版",
      description: "适合个人创作者和小型团队",
      price: {
        monthly: 99,
        yearly: 79,
      },
      features: [
        "每月 1000 次对话",
        "所有模型支持",
        "最大 4000 字符输入",
        "优先响应速度",
        "高级客服支持",
        "API 访问权限",
        "团队共享功能",
      ],
      popular: true,
    },
    {
      name: "企业版",
      description: "适合大型企业和组织",
      price: {
        monthly: 399,
        yearly: 319,
      },
      features: [
        "无限对话次数",
        "专属模型定制",
        "无字符数限制",
        "最高响应速度",
        "24/7 专属客服",
        "完整 API 集成",
        "高级数据分析",
        "专属技术支持",
        "SLA 保障",
      ],
    },
  ];

  const featureExplanations = {
    "基础模型支持": "使用 GPT-3.5 等基础大语言模型",
    "所有模型支持": "可使用包括 GPT-4 在内的所有模型",
    "专属模型定制": "根据企业需求定制专属语言模型",
    "API 访问权限": "通过 API 集成到自己的应用中",
    "团队共享功能": "与团队成员共享对话额度和历史记录",
    "高级数据分析": "详细的使用数据分析和洞察",
    "SLA 保障": "99.9% 可用性保障和专业技术支持",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="light" />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">选择适合您的方案</h1>
          <p className="text-gray-600 mb-8">
            灵活的定价方案，满足不同规模团队的需求
          </p>

          {/* 计费周期选择 */}
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <RadioGroup
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
              className="flex"
            >
              <div className="flex items-center space-x-2 px-4 py-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <label htmlFor="monthly">月付</label>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <label htmlFor="yearly">年付</label>
                <span className="text-xs text-green-600 font-medium ml-1">
                  省20%
                </span>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* 定价卡片 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl border bg-background p-8",
                plan.popular && "border-primary shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    最受欢迎
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ¥{plan.price[billingCycle]}
                  </span>
                  <span className="text-gray-600">/ 月</span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-sm text-green-600 mt-1">
                    包年付费，每月更优惠
                  </div>
                )}
              </div>

              <Button
                className="w-full mb-8"
                variant={plan.popular ? "default" : "outline"}
              >
                开始使用
              </Button>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="flex items-center gap-1">
                      <span>{feature}</span>
                      {feature in featureExplanations && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{featureExplanations[feature as keyof typeof featureExplanations]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
                {plan.limitations?.map((limitation) => (
                  <div key={limitation} className="flex items-start gap-2 text-gray-500">
                    <Check className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                    <span>{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ 部分 */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">如何选择合适的方案？</h3>
              <p className="text-gray-600">
                建议您从免费版开始体验，了解产品功能后再根据实际需求选择升级方案。专业版适合个人创作者和小型团队，企业版则为大型组织提供更强大的功能和支持。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">是否支持随时更改计划？</h3>
              <p className="text-gray-600">
                是的，您可以随时升级或降级您的订阅计划。升级后立即生效，降级则在当前计费周期结束后生效。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">如何计算对话次数？</h3>
              <p className="text-gray-600">
                每次向AI发送消息并获得回复计为一次对话。未使用的对话次数不会累积到下个月。企业版无需关心对话次数限制。
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing; 