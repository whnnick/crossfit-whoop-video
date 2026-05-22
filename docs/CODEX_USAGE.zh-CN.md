# Codex、OpenClaw 和本地使用指南

这份文档回答一个核心问题：用户 clone 这个开源项目以后，到底怎么用。

## 先选使用方式

- 本地模板：想自己改配置、自己运行脚本，用 `crossfit-whoop-ad/`。
- Codex Skill：想让 Codex 根据提示词帮你规划和剪视频，安装 `skills/crossfit-whoop-video/`。
- Codex/OpenClaw Plugin：如果你的环境支持 plugin bundle，安装 `plugins/crossfit-whoop-video/`。

对大多数用户来说，普通 Codex skill 是最稳的 agent 使用方式。

## 本地模板用法

适合不需要 Codex 自动做剪辑判断，只想自己改配置并渲染的人。

```bash
git clone https://github.com/whnnick/crossfit-whoop-video.git
cd crossfit-whoop-video/crossfit-whoop-ad
npm run dry-run
cp .env.example .env
```

在 `.env` 里填写自己的 WHOOP Developer 凭据，然后授权并拉取数据：

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

## 在 Codex 里用 Skill

安装 skill：

```bash
mkdir -p ~/.codex/skills
cp -R skills/crossfit-whoop-video ~/.codex/skills/
```

如果 Codex 没有立刻识别，重启 Codex 或新开一个对话。

在 Codex Desktop 里给视频有两种方式：

- 直接在聊天里上传/附加视频文件。
- 粘贴视频的绝对路径，例如 `/path/to/workout.mov`。

然后在提示词里点名 skill：

```text
使用 $crossfit-whoop-video，把我上传的训练素材剪成 50 秒竖屏 4K 运动广告，WHOOP 风格 HUD 只在关键节点出现。
```

Codex 应该会检查素材、制定剪辑方案、生成或更新项目文件、尽可能渲染或 dry-run，并用 `ffprobe` 验证输出。

## 在 Codex 里用 Plugin

如果你的 Codex 版本支持本地 plugin bundle：

```bash
mkdir -p ~/plugins
cp -R plugins/crossfit-whoop-video ~/plugins/
```

然后在 Codex 插件界面启用它。这个 plugin 主要打包了同一个 skill；如果不确定当前 Codex 是否支持 plugin，优先使用上面的 skill 安装方式。

## 在 OpenClaw 里用

为了最大兼容性，把普通 skill 复制到你的 OpenClaw skills 目录：

```bash
cp -R skills/crossfit-whoop-video <openclaw-skills-directory>/
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

## 提示词范例

最简版：

```text
使用 $crossfit-whoop-video，把这些训练素材剪成 50 秒竖屏 4K CrossFit 广告。风格要电影感、高燃。WHOOP 风格数据只在开头、高强度段落和结尾总结出现。
```

带必选镜头：

```text
使用 $crossfit-whoop-video。用这些素材做一支 55 秒竖屏运动广告。必须包含墙球越过目标线的完整动作、拉近的引体向上发力镜头，以及后段一个疲劳搞笑瞬间。至少 80% 动作镜头要是完整动作。
```

带音乐：

```text
使用 $crossfit-whoop-video。把这个 MP4 里的声音作为背景音乐，保留训练视频里的部分环境声，根据鼓点剪辑。WHOOP HUD 只出现 3-4 次。
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

让 Codex 继续检查：

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
