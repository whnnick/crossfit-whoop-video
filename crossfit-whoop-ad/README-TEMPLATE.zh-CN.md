# 可复用 CrossFit WHOOP 广告模板

这个项目现在是一个可复用的 HyperFrames 模板，用于生成 9:16 竖屏 4K CrossFit/WHOOP 风格训练广告。

## 常用流程

1. 把新的训练素材放在这台机器上的任意位置。
2. 更新 `template.config.json`：
   - 把 `media.videoA.source` 和 `media.videoB.source` 指向新素材路径。
   - 调整 `media.videoA.mediaStart` 和 `media.videoB.mediaStart`，选择更好的片段。
   - 设置 `layout.subjectArea` 为 `left`、`center` 或 `right`，让数据避开运动员。
   - 更新 `copy` 里的文案。
3. 运行：

```bash
npm run template:apply
npm run whoop:fetch
npm run check
npm run template:render
```

如果你不想使用外部 source 路径，并且已经把文件放进 `assets/`，就把 `source` 设为空字符串，把 `src` 指向对应 asset 文件。

## 最重要的配置字段

- `media.videoA` 和 `media.videoB`：两段主要训练素材。
- `media.whoopCapture`：可选 WHOOP App 录屏叠加。
- `layout.subjectArea`：运动员主要出现的位置，可用 `left`、`center` 或 `right`。
- `layout.hudPosition`：紧凑 WHOOP HUD 的位置，可用 `left` 或 `right`。
- `layout.dataDensity`：`balanced` 使用当前风格，`minimal` 隐藏额外数据面板。
- `copy`：标签、标题和短说明文案。

## 可复用内容

- 竖屏 4K 格式：`2160x3840`，30 秒。
- WHOOP API 数据流水线。
- 运动广告视觉：深色调色、扫描线、冲击闪白、脉冲环、速度线和能量转场。
- 避免遮挡运动员的紧凑数据展示。

## 关于 AGENTS.md

`AGENTS.md` 不是视频的一部分。它是 HyperFrames 生成的 AI 编码 agent 指令，说明 composition 规则、命令和验证流程。
