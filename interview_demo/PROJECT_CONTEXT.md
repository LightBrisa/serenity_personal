# Serenity Personal 项目与 Demo 的关系

这份 Demo 从真实 `serenity_personal` 仓库构建，核心演示链路是：

`H20 来源事实 → 结构化影响分析 → 人选择处理方式 → 本地处理记录`

Demo 直接复用的真实模块包括：

- `src/data/nvda-fixtures.ts`：带时间边界的 NVDA 历史来源、论点和前提。
- `src/data/nvda-model-fixtures.ts`：明确标为离线回归样例的结构化影响分析。
- `src/components/decision-experience.tsx`：人的四种选择、理由保存和重置交互。
- `src/domain/decision.ts`：从人的选择到任务/论点状态的确定性映射。
- `src/ai/impact-analysis.ts`：在线版与离线样例共同遵守的结构化输出和引用校验合同。

正常产品构建仍使用 Vinext、Cloudflare Workers 和 `POST /api/ai/impact`。Demo 只增加独立的 `demo/` 入口和 `vite.demo.config.ts`，把真实模块打成一个可双击的静态 HTML；它没有复制一套后端，也没有把 API Key、模型响应或生产状态塞进离线文件。

确切 Git revision、构建时间、文件哈希和真实模型 smoke 状态由同包 `05_VERIFICATION.json` 自动生成。
