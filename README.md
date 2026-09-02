# Serenity

Serenity 是一套个人投资研究工具，帮助你把外部听来的股票观点，变成自己有依据、可推翻、能持续复查的判断。

仓库目前完成了**第一阶段**：以 NVDA 为例，演示“说清问题 → 看正反依据 → 写下当前判断 → 处理新变化 → 记录为什么改变”。在“处理变化”页，系统可以把一条来源事实与原判断逐项对照，整理可能受影响的前提、证据缺口和分析限制；人的 KEEP / WATCH / GATHER / INVALIDATE 选择仍由确定性产品逻辑和用户操作完成，模型不会替用户自动改结论。

页面输入仍来自固定的历史演示数据，不是实时行情。变化页把“真实模型整理”和“离线预置示例”分成两个明确入口；离线示例不会冒充模型调用成功。用户作出的选择、理由及本次分析引用只保存在当前浏览器，用于验证交互闭环；项目不提供买卖建议，也不包含交易功能。

## 本地开发

本地运行使用 Node 24 或更高版本。

```bash
npm install
npm run dev
```

真实模型能力使用服务端环境变量。复制 `.env.example` 为 `.env.local`，只在本机填写自己的 Key：

```bash
# 只存在服务端，不能使用 NEXT_PUBLIC_ 前缀
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-luna
npm run dev
```

未配置 Key 时，`POST /api/ai/impact` 会明确返回 `503 MODEL_NOT_CONFIGURED`，页面仍可手动加载已标注的离线预置示例。代码默认使用 OpenAI Responses API、Zod Structured Outputs、`store: false`、25 秒超时和零自动重试；模型输出会再次经过 schema 和前提 ID 交叉校验。

提交前检查：

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

默认测试全部使用 fake provider，不访问网络。只有同时设置 `RUN_MODEL_SMOKE=1` 和 `OPENAI_API_KEY` 时，下面的显式命令才会发起一次真实调用；缺少任一条件时，命令会以非零状态退出，不能被误记为验证通过：

```powershell
$env:RUN_MODEL_SMOKE='1'
npm run test:model:live
```

本仓库不保存真实 Key；本地和生产 smoke 应分别执行并记录结果。
命令会从被 Git 忽略的 `.env.local` 读取 Key；进程环境中已经存在的值仍然优先。
命令成功后会生成与当前干净 Git revision、prompt 版本和 schema 哈希绑定的 `work/verification/live-model-smoke.json`；后续 Demo 打包会自动校验并带入这份报告。缺少 Key、工作区不干净、调用失败或报告缺失时都不会生成 VERIFIED 结论。

如果本机已经设置 `HTTPS_PROXY` 或 `HTTP_PROXY`，`dev`、`start` 的 Node 启动进程和真实 smoke 会自动启用 Node 24 的内置环境代理。代理地址不会写入报告、日志或 Demo 包；Cloudflare Worker 路由和浏览器代码不引入 Node 代理实现，端到端路由仍需单独实测。

当前 API 路由没有账户身份、每用户费用配额或持久化限流，因此不能仅凭同源请求检查就把带 Key 的端点公开到公网。公开启用真实模型前，至少需要用 Cloudflare Access 或产品账户保护站点，并配置服务端速率/费用门槛；在此之前，生产环境应保持不配置 Key，真实 smoke 只在受控本地环境执行。

## 离线 Demo ZIP

离线 Demo 复用真实 fixture、模型输出合同、`DecisionReview` 和确定性判断状态机，单独构建为不含 API 调用的单文件 HTML。最终打包必须来自干净 Git 提交，并使用同一次质量门禁生成的报告：

```powershell
npm run verify:quality
npm run package:demo
npm run verify:demo -- outputs\Serenity_Personal_Demo_YYYYMMDD_<commit>.zip
```

ZIP 中只有 7 个白名单文件：入口 HTML、启动说明、3 分钟话术、项目关系说明、数据/模型边界、机器生成的验证报告和逐文件 SHA-256。真实模型没有完成 smoke 时，报告必须保持 `liveModelSmoke.status = NOT_RUN`；离线预置分析不能替代这项证明。

## 目录说明

- `app/` — 今天、我的判断、判断依据、处理变化和处理记录等页面
- `src/components/` — 可复用的研究界面和交互组件
- `src/domain/` — 领域类型、结构化数据校验和确定性计算
- `src/data/` — 标注清楚、带时间边界的 NVDA 演示数据
- `src/ai/` — 模型 provider 抽象、Responses API 适配、结构化校验和 HTTP 边界
- `src/db/` — 为后续持久化准备的 Drizzle 类型化数据结构
- `demo/`、`interview_demo/` — 复用真实模块的离线入口、白名单打包和独立校验

当前已完成来源受约束的模型影响整理纵切。数据供应商适配、自动来源采集、账户级持久化、定时跟踪和任意股票研究仍属于后续能力；不要把固定 NVDA 历史材料理解为实时研究。

## 使用边界

Serenity 用来帮助人形成并复查自己的判断，不是投资顾问或交易系统，也不构成任何投资建议。每条依据都会注明来源，以及它会让判断更有信心、更谨慎或暂不受影响；原始来源和研究解读分开保存，未知项不会被悄悄补全。只有用户确认后才会新增处理记录；“先补证据”保持为未完成任务，不冒充判断修改。
