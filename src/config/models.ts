export interface ModelConfig {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    name: "DeepSeek-7B",
    description: "7B参数量的高性能模型"
  },
  {
    id: "Qwen/Qwen2.5-7B-Instruct",
    name: "Qwen2.5-7B-Instruct",
    description: "阿里云最新大语言模型"
  },
  {
    id: "internlm/internlm2_5-7b-chat",
    name: "internlm2_5-7b-chat",
    description: "基于 InternLM2 架构开发"
  }
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0]; 