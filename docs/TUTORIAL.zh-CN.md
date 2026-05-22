# 教程：用自己的素材生成电影感训练短片

这份教程说明如何用自己的训练视频和自己的 WHOOP 账号使用模板。

## 这是不是 Codex Skill？

不是。这里讲的是普通 HyperFrames 项目/模板，不是 Codex skill。

你需要克隆仓库、编辑 `template.config.json`、添加自己的视频文件，然后运行 npm 脚本。Codex 可以帮你修改这些文件，但这个流程本身不需要安装 skill。

## 1. 克隆并进入项目

```bash
git clone https://github.com/whnnick/crossfit-whoop-video.git
cd crossfit-whoop-video/crossfit-whoop-ad
```

项目通过 `npx hyperframes` 运行，所以仓库里不会提交 `node_modules/`。

## 2. 添加自己的 WHOOP App 凭据

创建本地 `.env`：

```bash
cp .env.example .env
```

填写：

```text
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REDIRECT_URI=http://localhost:8977/callback
```

在 WHOOP Developer Dashboard 里，把 app redirect URL 设为：

```text
http://localhost:8977/callback
```

不要提交 `.env`。

## 3. 授权 WHOOP

```bash
npm run whoop:auth
```

脚本会启动本地 callback server，并打开 WHOOP 授权页。你同意授权后，项目会在本地保存 `.whoop-token.json`。

不要提交 `.whoop-token.json`。

## 4. 拉取 WHOOP 数据

```bash
npm run whoop:fetch
```

这会生成：

```text
assets/whoop-data.json
assets/whoop-data.js
```

这些文件包含个人健康/训练数据，已经被 Git 忽略。

注意：WHOOP API 提供的是处理后的 workout、recovery、sleep、cycle 数据，不是连续的实时心率原始流。模板里的动态数字是基于真实摘要指标做动画表达。

## 5. 添加新视频素材

你可以把素材直接放进 `assets/`，也可以在配置里指向电脑上的其他路径。

素材已经放在 `assets/` 时：

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "",
      "mediaStart": 4
    },
    "videoB": {
      "src": "assets/training-b.mov",
      "source": "",
      "mediaStart": 22
    }
  }
}
```

素材在其他本地路径时：

```json
{
  "media": {
    "videoA": {
      "src": "assets/training-a.mov",
      "source": "/absolute/path/to/your/video.mov",
      "mediaStart": 4
    }
  }
}
```

当 `source` 有值时，`npm run template:apply` 会在 `src` 指定的位置创建符号链接。

## 6. 调整模板

编辑：

```text
template.config.json
```

最常用字段：

```json
{
  "layout": {
    "subjectArea": "center",
    "hudPosition": "right",
    "dataDensity": "balanced"
  },
  "copy": {
    "heroHeadline": "Every rep has a signal",
    "scene2Headline": "Find the redline",
    "finalHeadline": "Train where the data says go"
  }
}
```

使用建议：

- `subjectArea: "left"`：人物主要在左侧，数据会尽量避开。
- `subjectArea: "right"`：人物主要在右侧。
- `subjectArea: "center"`：人物比较居中。
- `dataDensity: "minimal"`：只保留很少的数据面板。
- `dataDensity: "balanced"`：使用当前电影感运动短片风格。

## 7. 应用、检查和渲染

```bash
npm run template:apply
npm run check
npm run template:render
```

默认输出由 `template.config.json` 控制：

```text
renders/crossfit-whoop-video-template.mp4
```

渲染视频会被 Git 忽略。

## 8. 开源安全检查

推送到 GitHub 前检查：

```bash
git status --short --ignored
git ls-files --others --exclude-standard
```

不要提交：

- `.env`
- `.whoop-token.json`
- `assets/whoop-data.json`
- `assets/whoop-data.js`
- 训练视频素材
- 渲染成片

## 9. 常见修改

修改片段起点：

```json
"mediaStart": 12
```

把数据移到远离人物的位置：

```json
"subjectArea": "right",
"hudPosition": "left"
```

用同一个源视频做两个段落：

```json
"videoA": { "src": "assets/session.mov", "mediaStart": 0 },
"videoB": { "src": "assets/session.mov", "mediaStart": 20 }
```

关闭 WHOOP 录屏叠加：

```json
"whoopCapture": {
  "src": "assets/whoop-source.mp4",
  "enabled": false
}
```
