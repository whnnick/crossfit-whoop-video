# 基础环境要求

这份文档主要面向 OpenClaw 用户、本地模板用户、二次开发者，以及没有内置视频渲染能力的 Codex 环境。

如果你是在 Codex 里使用，并且已经启用了 HyperFrames 插件或等价的视频生成能力，通常可以先上传素材或粘贴路径并输入提示词，不需要在开始前手动安装本页列出的所有工具。

对 OpenClaw、本地渲染和开发场景来说，这个项目是本地视频生成工作流，不是云端渲染服务。真正渲染真实素材的机器需要准备好本地视频处理环境。

## 必需工具

| 工具 | 作用 | 检查命令 |
| --- | --- | --- |
| Git | 克隆仓库、管理源码版本 | `git --version` |
| Node.js | 运行项目脚本和 HyperFrames 命令 | `node --version` |
| npm / npx | 运行 package scripts，拉取 HyperFrames CLI | `npm --version` |
| ffmpeg | 切片、抽音频、混音、合成最终视频 | `ffmpeg -version` |
| ffprobe | 检查成片时长、分辨率、fps、音视频流 | `ffprobe -version` |
| Chrome / Chromium | HyperFrames 使用类似浏览器的渲染环境处理 HTML 视频 composition | 打开 Chrome，或使用运行环境自带浏览器 |

## 推荐版本

- Node.js：20 或更新。
- npm：使用 Node.js 自带的稳定版本即可。
- ffmpeg / ffprobe：使用 Homebrew、apt 或官方构建的较新版本。
- HyperFrames：通过 `npx` 运行；通用模板里需要固定版本时使用 `hyperframes@0.6.22`。

## macOS 安装

如果使用 Homebrew：

```bash
brew install git node ffmpeg
```

然后验证：

```bash
git --version
node --version
npm --version
ffmpeg -version
ffprobe -version
```

## Linux 安装

Debian/Ubuntu 系统：

```bash
sudo apt update
sudo apt install -y git nodejs npm ffmpeg
```

有些发行版自带 Node.js 较旧。如果 `node --version` 低于 20，请用你熟悉的 Node 版本管理工具安装新版本。

## 项目环境检查

在仓库根目录运行：

```bash
bash skills/crossfit-whoop-video/scripts/check-video-env.sh
```

期望输出类似：

```text
ffmpeg   /path/to/ffmpeg
ffprobe  /path/to/ffprobe
node     /path/to/node
npm      /path/to/npm
Video environment looks ready.
```

## 干净 checkout 验证

添加私人素材前，先运行：

```bash
cd crossfit-whoop-ad
npm run dry-run
```

`dry-run` 使用仓库内提交的合成占位媒体，可以在没有私人视频、真实 WHOOP 数据、`.env` 和 token 的情况下验证模板可用性。

## WHOOP API 要求

WHOOP 集成是可选功能。如果要使用真实 WHOOP 数据，需要：

- WHOOP Developer 账号
- 你自己的 `WHOOP_CLIENT_ID`
- 你自己的 `WHOOP_CLIENT_SECRET`
- redirect URL 设置为 `http://localhost:8977/callback`

本地私有文件：

```text
crossfit-whoop-ad/.env
crossfit-whoop-ad/.whoop-token.json
crossfit-whoop-ad/assets/whoop-data.json
crossfit-whoop-ad/assets/whoop-data.js
```

这些文件已经被 Git 忽略，不能提交。

## 常见问题

`ffmpeg: command not found`

安装 ffmpeg，并确认它在当前 shell 的 `PATH` 里。

`npx hyperframes ...` 出现网络错误

检查网络、npm registry 访问和代理设置。HyperFrames 未缓存时会通过 npm 拉取。

`npm run dry-run` 能过，但真实渲染失败

检查 `template.config.json` 是否指向真实存在的本地媒体路径。

WHOOP 授权失败

确认 WHOOP Developer Dashboard 里的 redirect URL 和 `http://localhost:8977/callback` 完全一致。
