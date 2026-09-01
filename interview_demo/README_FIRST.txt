Serenity Personal · 离线面试 Demo
=================================

打开方式
--------
1. 解压整个 ZIP。
2. 双击 00_START_HERE.html，建议使用最新版 Edge 或 Chrome。
3. 不需要安装依赖、不需要登录、不需要 API Key，也不需要联网。

推荐演示顺序（约 3 分钟）
------------------------
1. 先读“变化发生前，我的判断”，说明系统没有从结果倒推原观点。
2. 核对 NVIDIA Form 8-K 的来源事实，再看离线预置分析如何把事实、推断和未知项分开。
3. 在页面下方选择 KEEP / WATCH / GATHER / INVALIDATE 之一，并填写自己的理由。
4. 点击“记下这次判断”，观察页面只记录人的选择；再用右上角“重置演示”回到初始状态。

演示边界
--------
- 这是从真实 Serenity Personal 仓库构建出的单文件离线演示，不是另做的替代展示页。
- 页面复用真实项目的 NVDA 历史 fixture、模型输出数据合同、DecisionReview 和确定性判断状态机。
- 为保证面试现场稳定，影响分析使用明确标注的离线预置回归样例；本 HTML 不调用实时模型，也不会访问网络。
- 在线仓库已实现 server-only OpenAI Responses API 与 Zod Structured Outputs；是否完成真实调用，以 05_VERIFICATION.json 的 liveModelSmoke 状态为准。
- 本项目不是实时市场数据产品，不构成投资建议，也不会执行交易。

如果需要重新开始，请点击页面右上角“重置演示”。
