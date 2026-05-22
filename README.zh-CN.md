# CrossFit WHOOP Video 中文文档

这是一个可复用的竖屏运动短片项目，目标是把 CrossFit 或其他训练素材剪成 9:16、4K、运动广告风格的视频，并叠加 WHOOP 风格的数据 HUD。项目同时提供普通 HyperFrames 模板、Codex Skill 和 Codex Plugin 三种使用方式。

## 项目里有什么

- `crossfit-whoop-ad/`：通用 HyperFrames 视频模板，适合直接换素材、换数据、重新渲染。
- `crossfit-20260520-ad/`：一次完整 CrossFit 短片项目的可复用源码、WHOOP HUD 模板和剪辑方法论。
- `skills/crossfit-whoop-video/`：Codex Skill，让 Codex 以后按这套方法帮你剪运动视频。
- `plugins/crossfit-whoop-video/`：Codex Plugin bundle，把 skill 打包成插件形式。
- `docs/TUTORIAL.md`：英文教程。
- `docs/OPENCLAW_COMPATIBILITY.md`：OpenClaw 兼容说明。

仓库不会包含你的私人视频、渲染成片、`.env`、WHOOP token 或真实 WHOOP 数据。

## 中文文档索引

- [使用教程](docs/TUTORIAL.zh-CN.md)
- [OpenClaw 兼容说明](docs/OPENCLAW_COMPATIBILITY.zh-CN.md)
- [通用模板说明](crossfit-whoop-ad/README-TEMPLATE.zh-CN.md)
- [通用模板视觉设计](crossfit-whoop-ad/DESIGN.zh-CN.md)
- [2026-05-20 项目说明](crossfit-20260520-ad/README.zh-CN.md)
- [2026-05-20 视觉设计](crossfit-20260520-ad/DESIGN.zh-CN.md)
- [剪辑方法论](crossfit-20260520-ad/docs/VIDEO_EDITING_METHODOLOGY.zh-CN.md)
- [WHOOP HUD 模板指南](crossfit-20260520-ad/docs/WHOOP_HUD_TEMPLATES.zh-CN.md)
- [Flow 60s 视觉设计](flow-whoop-60s/DESIGN.zh-CN.md)
- [Plugin 中文说明](plugins/crossfit-whoop-video/README.zh-CN.md)
- [Skill 设备数据源说明](skills/crossfit-whoop-video/references/device-data-sources.zh-CN.md)
- [Skill 剪辑方法论](skills/crossfit-whoop-video/references/editing-methodology.zh-CN.md)
- [Skill WHOOP HUD 模板说明](skills/crossfit-whoop-video/references/whoop-hud-templates.zh-CN.md)

## 最常用方式：作为普通视频模板

适合你或其他用户克隆仓库后自己放素材、填配置、渲染视频。

```bash
git clone https://github.com/whnnick/crossfit-whoop-video.git
cd crossfit-whoop-video/crossfit-whoop-ad
cp .env.example .env
```

在 `.env` 里填自己的 WHOOP Developer 信息：

```text
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REDIRECT_URI=http://localhost:8977/callback
```

在 WHOOP Developer Dashboard 里把 redirect URL 设置成：

```text
http://localhost:8977/callback
```

授权并拉取 WHOOP 数据：

```bash
npm run whoop:auth
npm run whoop:fetch
```

然后编辑：

```text
crossfit-whoop-ad/template.config.json
```

把视频路径换成自己的素材。示例：

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "/absolute/path/to/your/video.mov",
      "mediaStart": 12
    }
  }
}
```

应用模板、检查并渲染：

```bash
npm run template:apply
npm run check
npm run template:render
```

默认输出在 `crossfit-whoop-ad/renders/`，渲染结果默认不会提交到 Git。

## 作为 Codex Skill 使用

适合你以后直接把新素材给 Codex，然后让 Codex 按这套剪辑逻辑处理。

安装到本机 Codex skills 目录：

```bash
mkdir -p ~/.codex/skills
cp -R skills/crossfit-whoop-video ~/.codex/skills/
```

之后可以这样对 Codex 说：

```text
使用 $crossfit-whoop-video，把这几段 CrossFit 素材剪成 50 秒竖屏 4K 运动广告，WHOOP 数据只在关键节点动态显示。
```

Skill 本身不是剪辑软件，它是给 Codex 的工作方法说明。Codex 会根据 skill 里的方法，调用 HyperFrames、ffmpeg、脚本和本地素材完成剪辑。

## 作为 Codex Plugin 使用

如果你的 Codex 环境支持本地插件，可以复制插件目录：

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

这个插件目前主要打包了同一个 `crossfit-whoop-video` skill。不同 Codex 或兼容客户端的插件安装路径可能不同，具体以客户端文档为准。

## OpenClaw 兼容性

OpenClaw 大概率可以使用 skill 方式兼容，因为 skill 本质上是 Markdown 工作流说明加脚本/模板引用。插件方式是否兼容，取决于 OpenClaw 当前版本是否支持 Codex plugin bundle 格式。

详细说明见：

```text
docs/OPENCLAW_COMPATIBILITY.md
```

## WHOOP 和其他设备数据

支持思路如下：

- WHOOP：通过 OAuth/API 拉取 workout、recovery、sleep、cycle 等处理后的数据。
- Apple Watch：通过 Apple Health 导出 XML，或通过 HealthFit 等 App 导出 FIT/TCX/CSV。
- Garmin、Strava 等：可以接入 FIT、TCX、GPX、CSV，或用户自己实现授权 API。
- 手动数据：可以使用，但需要明确标注为 manual input，避免伪装成真实 API 数据。

注意：WHOOP API 提供的是处理后的训练、恢复、睡眠和周期数据，不是完整连续的实时心率原始流。视频里的动态数字通常是基于真实摘要数据做动画表达。

## 开源安全规则

不要提交这些文件：

- 原始训练视频，例如 `.mov`、`.mp4`
- 渲染结果，例如 `renders/*.mp4`
- `.env`
- `.whoop-token.json`
- `assets/whoop-data.json`
- `assets/whoop-data.js`
- 任何包含真实 token、Client Secret、个人路径或健康数据的文件

推送前可以检查：

```bash
git status --short --ignored
git ls-files
```

本仓库的 `.gitignore` 已经默认排除了常见视频、音频、渲染产物和私密数据。

## 之后怎么用来剪新视频

最简单的协作方式是：

1. 把新视频素材放在本机某个文件夹。
2. 告诉 Codex 素材路径、目标时长、风格、必须保留的镜头。
3. 让 Codex 使用 `$crossfit-whoop-video`。
4. Codex 根据素材分析、分镜、转场、WHOOP HUD、音乐和输出规格生成项目或成片。

示例：

```text
使用 $crossfit-whoop-video，把 /path/to/video1.mov 和 /path/to/video2.mov 剪成 60 秒竖屏 4K CrossFit 运动广告。节奏要电影感，WHOOP 数据只在开头、中段高强度和结尾总结出现。
```

如果只想使用模板，不想用 Codex，也可以直接改 `template.config.json` 后运行 npm 脚本。

## 许可证和声明

本项目使用 `LICENSE` 中的开源许可证。

WHOOP 是 WHOOP, Inc. 的商标。本项目不是 WHOOP 官方项目，也没有得到 WHOOP 官方背书。HUD 风格用于运动数据可视化模板，不应冒充官方 WHOOP 应用界面。
