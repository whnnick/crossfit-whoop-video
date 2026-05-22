# CrossFit WHOOP 视频模板

这个项目用于渲染一支竖屏 4K CrossFit 短片，包含电影感调色、按节奏剪辑的训练素材、选择性出现的 WHOOP HUD、音乐、健身房环境声和转场音效。

## 源文件和生成文件

需要保留的源码：

- `scripts/`：渲染流水线和时间线逻辑。
- `scripts/timeline.mjs`：镜头顺序、素材时间码、缩放/平移、WHOOP 出现窗口、输出时长。
- `scripts/generate-overlays.mjs`：WHOOP HUD 生成。
- `docs/`：可复用的剪辑方法和模板说明。
- `templates/`：可复用 WHOOP HUD 样式规格。

可重新生成的文件：

- `assets/clips/`
- `assets/overlays/`
- `assets/base-cut.mp4`
- `assets/ambient.wav`
- `assets/music-bed.wav`
- `assets/sfx.wav`
- `renders/`

## 常用命令

干净开源 checkout 只检查源码：

```bash
npm run check:source
```

添加所需私人源素材到 `assets/source/` 后，运行完整渲染流水线：

```bash
npm run clean
npm run all
```

只改 WHOOP 样式后，可以更快重渲染：

```bash
npm run overlays
npm run render
```

只改镜头时间或裁切后，可以更快重渲染：

```bash
npm run clips
npm run render
```

## 当前输出目标

- 比例：9:16
- 分辨率：2160 x 3840
- FPS：30
- 时长：由 `scripts/timeline.mjs` 里的 `OUTPUT_DURATION` 控制
- 当前最终文件名：`crossfit-20260520-video-vertical-4k-whoop-v2-airbike-50s.mp4`
