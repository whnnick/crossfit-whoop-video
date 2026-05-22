# 项目工作链路

这份文档说明从输入素材到最终视频的完整链路。

## 总体流水线

```text
输入视频 / 音乐 / 运动数据
        |
        v
template.config.json
        |
        v
npm run template:apply
        |
        v
HyperFrames HTML composition
        |
        v
npm run check / npm run template:render
        |
        v
renders/*.mp4
```

如果使用 Codex 或 OpenClaw，agent 位于这条流水线之上：它读取需求、检查素材、选择镜头、更新项目文件、运行检查，并汇报结果。已经启用 HyperFrames 或等价视频能力的 Codex 用户，通常可以先走提示词流程，不必先配置完整本地工具链。

## 本地模板链路

适合用户自己编辑模板：

1. 克隆仓库。
2. 在 `crossfit-whoop-ad/` 运行 `npm run dry-run`。
3. 把私人视频放在本机某个位置。
4. 编辑 `template.config.json`。
5. 可选：授权 WHOOP 并拉取数据。
6. 运行 `npm run template:apply`。
7. 运行 `npm run check`。
8. 运行 `npm run template:render`。
9. 用 `ffprobe` 验证输出。
10. 不要把原始素材、渲染成片、`.env`、token 和健康数据导出提交到 Git。

## Codex 链路

适合让 Codex 帮你剪：

1. 在 Codex 里启用 HyperFrames 或等价视频能力。
2. 在 Codex 里上传视频，或提供绝对本地路径。
3. 用提示词描述目标；如果已安装 skill，可以使用 `$crossfit-whoop-video`。
4. Codex 在可用时读取 skill 或仓库说明。
5. Codex 检查素材；需求不清楚时先确认。
6. Codex 设计故事线、镜头顺序、HUD 出现窗口、音频策略和输出目标。
7. Codex 更新项目，或创建新项目目录。
8. Codex 在当前环境可行时运行 dry-run/check/render。
9. Codex 验证时长、分辨率、fps、音频、必选镜头和 Git 安全状态。

## OpenClaw 链路

适合在 OpenClaw 环境中使用：

1. 把普通 skill 安装到 OpenClaw 的 skills 目录；如果当前 OpenClaw 支持兼容 plugin bundle，也可以安装 plugin。
2. 按 OpenClaw 环境要求提供本地媒体路径或附件。
3. 要求 OpenClaw 使用 CrossFit WHOOP video skill。
4. 继续遵守媒体安全规则：不要把原始视频、渲染视频、`.env`、token 或健康数据导出提交到 Git。
5. 真实渲染仍依赖本地 ffmpeg、Node 和 HyperFrames 工具链。

## 数据链路

WHOOP 数据路径：

```text
WHOOP OAuth
  -> .whoop-token.json
  -> npm run whoop:fetch
  -> assets/whoop-data.json
  -> assets/whoop-data.js
  -> HTML HUD animation
```

Apple Watch / 其他设备：

```text
导出文件（Apple Health XML / FIT / TCX / CSV）
  -> 标准化指标
  -> 模板数据对象
  -> HUD 动画
```

如果某个数据源没有 WHOOP 专属指标，例如 Strain 或 Recovery，就使用该数据源自己的标签，不要伪装成 WHOOP 数据。

## 媒体安全链路

公开仓库可以包含：

- 源码
- 模板
- 文档
- 合成占位素材
- 合成预览素材

只应保留在本地的文件：

- 真实训练视频
- 渲染 MP4
- `.env`
- `.whoop-token.json`
- 真实 WHOOP API 数据
- Apple Health 导出
- 临时切片、音频和渲染资产

## 验证链路

声称视频完成前，应检查：

```bash
ffprobe -v error -show_streams -show_format renders/output.mp4
git status --short --ignored
```

确认：

- 输出文件存在
- 时长符合要求
- 分辨率和画幅符合目标
- fps 正确
- 音频存在且平衡
- 必选镜头出现
- WHOOP/数据覆盖层只在计划窗口出现
- 私人文件仍然被 Git 忽略

## 期望用户体验

好的用户路径应该是：

1. 用户打开 README。
2. 用户立刻能找到中文或英文入口。
3. Codex 用户优先看到最快的提示词使用方式。
4. OpenClaw 和本地用户能看到什么时候需要配置环境。
5. 用户套用提示词、skill/plugin 流程或模板配置。
6. 用户得到渲染结果或明确的 dry-run 结果。
7. 用户不会误把私人视频或健康数据发布到开源仓库。
