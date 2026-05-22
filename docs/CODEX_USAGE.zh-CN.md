# Codex、OpenClaw 和本地使用指南

这份文档说明这个项目的几种实际用法。最快路径是 Codex 优先：启用视频插件/能力，提供素材，然后用提示词让 Codex 完成剪辑。

如果要做本地渲染或 OpenClaw 部署，再阅读：

- 基础环境要求：[ENVIRONMENT.zh-CN.md](ENVIRONMENT.zh-CN.md)
- 项目完整工作链路：[WORKFLOW.zh-CN.md](WORKFLOW.zh-CN.md)

## 先选使用方式

| 用户类型 | 推荐方式 |
| --- | --- |
| Codex 用户 | 使用 Codex 快速方式。启用 HyperFrames 或等价视频能力，上传素材或粘贴本地路径，然后输入提示词。 |
| OpenClaw 用户 | 在 OpenClaw 里安装 skill/plugin，并确认本地机器有 `ffmpeg`、Node.js 等工具链。配置凭据后，可以通过同一套本地 `whoop:auth` / `whoop:fetch` 脚本读取 WHOOP API 数据。 |
| 本地开发者 | 使用 `crossfit-whoop-ad/`，编辑 `template.config.json`，按需配置 WHOOP，然后运行 npm 脚本。 |

## Codex 最快方式

对 Codex 用户来说，这个仓库首先是一套可复用的剪辑方法。如果 Codex 已经启用了 HyperFrames 插件或其他视频渲染能力，通常不需要在开始前手动安装 `ffmpeg`、Node.js、Chrome 或本地模板。

使用流程：

1. 在 Codex 里启用 HyperFrames 插件或等价的视频能力。
2. 在聊天里上传训练视频，或粘贴绝对本地路径，例如 `/path/to/workout.mov`。
3. 告诉 Codex 成片时长、画幅、风格、必选镜头、音乐和数据 HUD 展示方式。
4. 要求 Codex 检查素材、设计剪辑、可行时渲染或 dry-run，并验证输出。

提示词示例：

```text
使用 crossfit-whoop-video 的工作流，把我上传的训练素材剪成 50 秒竖屏 4K 运动广告。风格要电影感、高燃。WHOOP 风格 HUD 只在开头、高强度段落和结尾总结出现。保留部分训练环境声，并用 ffprobe 验证最终输出。
```

skill/plugin 里的说明会帮助 Codex 做剪辑判断：完整动作镜头、训练故事线、HUD 出现窗口、音乐和环境声平衡、安全检查和输出验证。它也包含 10 个内置 HUD 预设，包括 `01`、`02`、`04` 等，以及通过 prompt 自定义样式的规则。它不是剪映式 GUI，也不包含私人素材或真实 WHOOP 凭据。

## Codex Skill 方式

如果你的 Codex 环境支持本地 skill，并希望以后通过名字调用这套流程，可以安装 skill：

```bash
mkdir -p ~/.codex/skills
cp -R skills/crossfit-whoop-video ~/.codex/skills/
```

如果 Codex 没有立刻识别，重启 Codex 或新开一个对话。

然后在提示词里点名 skill：

```text
使用 $crossfit-whoop-video，把这些训练素材剪成 50 秒竖屏 4K CrossFit 广告。风格要电影感、高燃。WHOOP 风格数据只在开头、高强度段落和结尾总结出现。
```

## Codex Plugin 方式

仅当你的 Codex 版本支持本地 plugin bundle 时使用：

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

然后在 Codex 插件界面启用它。这个 plugin 打包的是同一套 skill 和工作流说明。如果不确定当前 Codex 是否支持本地 plugin，优先使用 Codex 快速方式或普通 skill 方式。

## OpenClaw 使用方式

OpenClaw 更接近本地 agent 部署环境。它可以使用同一套 skill 方法，但真实渲染依赖运行 OpenClaw 的机器具备本地视频工具链，例如 `ffmpeg`、`ffprobe`、Node.js、npm/npx 和可用于浏览器渲染的环境。

推荐安装普通 skill：

```bash
openclaw skills install ./skills/crossfit-whoop-video --as crossfit-whoop-video
```

如果你的 OpenClaw 版本支持 Codex 兼容 plugin bundle：

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

真正有用的内容是 plugin 内置的 skill：

```text
plugins/crossfit-whoop-video/skills/crossfit-whoop-video/
```

OpenClaw 提示词示例：

```text
使用 crossfit-whoop-video，把这些本地视频剪成 50 秒竖屏 4K CrossFit 广告。使用电影感节奏、完整动作镜头和选择性生物数据 HUD，并确保私人素材不进入 Git。
```

### OpenClaw 读取 WHOOP 数据

skill 可以指导 OpenClaw 使用真实 WHOOP 数据，但 OpenClaw 本身不会凭空读取 WHOOP。它需要克隆后的仓库、本地环境变量，以及模板项目使用的同一套 OAuth 流程。

```bash
cd crossfit-whoop-ad
cp .env.example .env
npm run whoop:auth
npm run whoop:fetch
```

生成的 `.env`、`.whoop-token.json`、`assets/whoop-data.json` 和 `assets/whoop-data.js` 都是本地私有文件，不能提交到 Git。

## 本地模板方式

适合你不依赖 Codex 做剪辑判断，而是自己运行模板。

```bash
git clone https://github.com/whnnick/crossfit-whoop-video.git
cd crossfit-whoop-video/crossfit-whoop-ad
npm run dry-run
cp .env.example .env
```

只有在你想使用真实 WHOOP 数据时，才需要在 `.env` 里填写自己的 WHOOP Developer 凭据，然后授权并拉取数据：

```bash
npm run whoop:auth
npm run whoop:fetch
```

编辑：

```text
crossfit-whoop-ad/template.config.json
```

把素材路径改成自己的视频：

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "/absolute/path/to/your/video-1.mov",
      "mediaStart": 8
    },
    "videoB": {
      "src": "assets/training-b.mov",
      "source": "/absolute/path/to/your/video-2.mov",
      "mediaStart": 22
    },
    "audio": {
      "src": "assets/silence.wav",
      "source": "/absolute/path/to/your/music-or-video.mp4",
      "mediaStart": 0,
      "volume": 0.78
    }
  }
}
```

然后运行：

```bash
npm run template:apply
npm run check
npm run template:render
```

## 提示词范例

带必选镜头：

```text
使用 $crossfit-whoop-video。用这些素材做一支 55 秒竖屏运动广告。必须包含墙球越过目标线的完整动作、拉近的引体向上发力镜头，以及后段一个疲劳搞笑瞬间。至少 80% 动作镜头要是完整动作。
```

带音乐：

```text
使用 $crossfit-whoop-video。把这个 MP4 里的声音作为背景音乐，保留训练视频里的部分环境声，根据鼓点剪辑。WHOOP HUD 只出现 3-4 次。
```

自定义 HUD 样式：

```text
使用 $crossfit-whoop-video。WHOOP 效果以 01 + 02 + 04 为基础，但开头更亮，中段增加全息矩阵科技感，只在峰值发力点加入 1.5 秒速度 BPM 爆发。
```

使用真实 WHOOP 数据：

```text
使用 $crossfit-whoop-video。使用已经拉取到 crossfit-whoop-ad/assets/whoop-data.js 的真实 WHOOP 数据。如果某个指标缺失，不要编造，直接省略。
```

带本地路径：

```text
使用 $crossfit-whoop-video。

输入视频：
- /absolute/path/to/video-1.mov
- /absolute/path/to/video-2.mov

输出：
- 45-60 秒
- 9:16 竖屏
- 尽量 4K
- 电影感 CrossFit 运动广告

安全：
- 不要提交原始视频、渲染成片、.env、token 或个人健康数据导出
- 最终成片放在被忽略的 renders/ 目录
```

## 生成后怎么检查

让 Codex 或 OpenClaw 继续检查：

```text
用 ffprobe 检查输出视频。确认时长、分辨率、fps、音频、必选镜头，以及私人素材仍然被 Git 忽略。
```

常用检查命令：

```bash
git status --short --ignored
git ls-files
npm run dry-run
```

## 安全规则

不要提交：

- 原始训练视频
- 渲染 MP4
- `.env`
- `.whoop-token.json`
- 真实 WHOOP JSON 或 Apple Health 导出
- 文档里的私人本地路径

公开示例和预览应使用合成占位素材。
