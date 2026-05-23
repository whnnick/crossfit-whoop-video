# CrossFit WHOOP Video Plugin

这是一个 Codex plugin bundle，用于创建竖屏 CrossFit、健身房、HYROX 和运动训练视频，包含电影感剪辑指导和选择性生物数据 HUD。

这个 bundle 是给 agent 使用的工作流/skill 包，不是独立的视频剪辑软件界面，也不内置 HyperFrames 渲染器。在 Codex 里，应配合 HyperFrames 等已启用的视频能力使用；在 OpenClaw 里，应配合具备本地视频工具链的运行机器使用。

HyperFrames 是负责 composition、动画、预览、检查和渲染的核心视频能力。这个 plugin 提供的是可复用剪辑方法、HUD 样式规则、提示词模式和安全检查。

## 内容

- `.codex-plugin/plugin.json`：Codex plugin manifest。
- `skills/crossfit-whoop-video/`：内置 Codex skill。
- `skills/crossfit-whoop-video/references/`：剪辑、WHOOP HUD 和设备数据说明。
- `skills/crossfit-whoop-video/assets/`：可复用 HUD 预设和设备数据源目录，包含 10 个 WHOOP HUD 预设和 prompt 自定义 HUD 样式规则。
- `skills/crossfit-whoop-video/scripts/check-video-env.sh`：本地视频工具检查脚本。

## 作为 Codex Plugin 安装

克隆仓库后：

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

如果你的 Codex 版本支持本地插件，可以在 Codex 插件界面里安装或启用它。

## 作为 OpenClaw 兼容 Bundle 安装

OpenClaw 可以安装包含 `.codex-plugin/plugin.json` 的兼容 Codex bundle。真实视频输出仍需要 OpenClaw 所在机器具备 `ffmpeg`、Node.js、npm/npx、HyperFrames 访问能力和可用于浏览器渲染的环境。

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

真正有用的内容是内置 skill：

```text
skills/crossfit-whoop-video/
```

## 作为普通 Codex Skill 安装

如果只需要 skill：

```bash
mkdir -p ~/.codex/skills
cp -R plugins/crossfit-whoop-video/skills/crossfit-whoop-video ~/.codex/skills/
```

提示词示例：

```text
Use $crossfit-whoop-video to cut this workout footage into a vertical 4K cinematic training video with biometric HUD overlays.
```

也可以中文说：

```text
使用 $crossfit-whoop-video，把这段训练素材剪成竖屏 4K 电影感运动短片，并加入选择性生物数据 HUD。
```

自定义 HUD 提示词：

```text
WHOOP 效果以 01 + 02 + 04 为基础，峰值段做得更未来感，加入短促速度 BPM 爆发。
```

## 设备数据

当前说明覆盖：

- WHOOP API 或导出数据
- Apple Watch，通过 Apple Health XML、FIT、TCX 或 CSV 导出
- Garmin/Strava 风格 FIT、TCX、GPX 或 CSV 导出
- 明确标注来源的手动指标

不要提交原始训练导出、视频、token、`.env` 或私有 API 响应。
