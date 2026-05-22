# OpenClaw 兼容说明

这个仓库提供两种扩展形式：

- `skills/crossfit-whoop-video/`：普通 `SKILL.md` skill 目录。
- `plugins/crossfit-whoop-video/`：Codex plugin bundle，包含 `.codex-plugin/plugin.json` 和内置 skill。

## 兼容结论

基于 OpenClaw 文档和当前项目结构：

- 普通 skill 目录与 OpenClaw 的 skills 模型兼容，因为它是标准 `SKILL.md` 目录，并带有 references/assets。
- plugin bundle 采用 OpenClaw 可识别的 Codex bundle 结构：`.codex-plugin/plugin.json` 加 `skills/`。
- 这个插件只使用较安全的兼容子集：`.codex-plugin/plugin.json` 和 `skills/`。

## 建议的 OpenClaw 使用方式

为了最大兼容性，优先把普通 skill 目录复制到你 OpenClaw 使用的 workspace/global skills 目录：

```bash
cp -R skills/crossfit-whoop-video <openclaw-skills-directory>/
```

如果你的 OpenClaw 版本支持安装兼容 bundle，可以安装插件目录：

```bash
openclaw plugins install ./plugins/crossfit-whoop-video
openclaw plugins list
openclaw plugins inspect crossfit-whoop-video
openclaw gateway restart
```

真正有用的内容是 plugin 内部的：

```text
skills/crossfit-whoop-video/
```

## 注意事项

- `agents/openai.yaml` 里的 Codex UI 元数据可能不会被 OpenClaw 使用。
- Codex plugin 的 UI 字段可能会被 OpenClaw 忽略。
- 视频生成仍依赖本地工具，例如 `ffmpeg`、`ffprobe`、Node.js 和项目脚本。
- Apple Watch 数据通过导出文件支持，不是直接访问 Apple 云端数据。
