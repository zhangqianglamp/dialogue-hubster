import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="light" isAuthenticated={false} />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">功能特点</h1>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="features">模型特点</TabsTrigger>
              <TabsTrigger value="parameters">模型参数</TabsTrigger>
              <TabsTrigger value="comparison">性能对比</TabsTrigger>
            </TabsList>

            {/* 模型特点 */}
            <TabsContent value="features">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      🧠
                    </span>
                    深度理解能力
                  </h3>
                  <p className="text-gray-600 mb-4">
                    基于先进的深度学习技术，能够准确理解用户意图和上下文语境，提供连贯且相关的回应。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge>语义理解</Badge>
                      <span className="text-sm text-gray-600">准确把握文本含义</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge>上下文感知</Badge>
                      <span className="text-sm text-gray-600">保持对话连贯性</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      📚
                    </span>
                    知识广度
                  </h3>
                  <p className="text-gray-600 mb-4">
                    拥有海量的知识储备，涵盖多个领域，能够回答各类问题并提供专业见解。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge>多领域</Badge>
                      <span className="text-sm text-gray-600">科技、文化、教育等</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge>实时性</Badge>
                      <span className="text-sm text-gray-600">定期更新知识库</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      ⚡
                    </span>
                    高性能
                  </h3>
                  <p className="text-gray-600 mb-4">
                    采用优化的推理引擎，确保快速响应和稳定的服务质量。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge>快速响应</Badge>
                      <span className="text-sm text-gray-600">毫秒级延迟</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge>高并发</Badge>
                      <span className="text-sm text-gray-600">支持多用户同时访问</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      🛡️
                    </span>
                    安全可控
                  </h3>
                  <p className="text-gray-600 mb-4">
                    内置多重安全机制，保护用户隐私，防止有害内容。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge>隐私保护</Badge>
                      <span className="text-sm text-gray-600">数据加密存储</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge>内容审核</Badge>
                      <span className="text-sm text-gray-600">自动过滤敏感内容</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* 模型参数 */}
            <TabsContent value="parameters">
              <div className="bg-gray-50 rounded-lg p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>参数名称</TableHead>
                      <TableHead>取值范围</TableHead>
                      <TableHead>默认值</TableHead>
                      <TableHead>说明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>temperature</TableCell>
                      <TableCell>0.0 - 2.0</TableCell>
                      <TableCell>0.7</TableCell>
                      <TableCell>控制输出的随机性，值越大回答越具有创造性</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>top_p</TableCell>
                      <TableCell>0.0 - 1.0</TableCell>
                      <TableCell>0.9</TableCell>
                      <TableCell>控制输出的多样性，值越小越保守</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>max_tokens</TableCell>
                      <TableCell>1 - 4096</TableCell>
                      <TableCell>2048</TableCell>
                      <TableCell>单次回复的最大长度</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>presence_penalty</TableCell>
                      <TableCell>-2.0 - 2.0</TableCell>
                      <TableCell>0.0</TableCell>
                      <TableCell>降低模型重复已出现过的内容的概率</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>frequency_penalty</TableCell>
                      <TableCell>-2.0 - 2.0</TableCell>
                      <TableCell>0.0</TableCell>
                      <TableCell>降低模型重复使用相同词汇的概率</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 性能对比 */}
            <TabsContent value="comparison">
              <div className="bg-gray-50 rounded-lg p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>指标</TableHead>
                      <TableHead>本模型</TableHead>
                      <TableHead>GPT-3.5</TableHead>
                      <TableHead>GPT-4</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>参数量</TableCell>
                      <TableCell>7B</TableCell>
                      <TableCell>175B</TableCell>
                      <TableCell>1.76T</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>推理速度</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">快</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>中等</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">慢</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>中文理解</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">优秀</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>良好</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">优秀</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>价格</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">低</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">中</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">高</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features; 