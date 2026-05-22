# WHOOP HUD 模板指南

当前推荐方向是 5 月 19 日 WHOOP 风格的更明亮版本：电影感、高对比、WHOOP 绿、玻璃面板、大数字和短促动态数据 hit。

更新 `scripts/generate-overlays.mjs` 时，可参考 `templates/whoop-hud-templates.json` 中的模板。

## 推荐组合

- 开头：`broadcast_bright`
- 中段：`glass_side_hud` 或 `compact_telemetry`
- 峰值时刻：`redline_peak`
- 结尾：`summary_card`

## 模板说明

`broadcast_bright`

- 最接近 5 月 19 日参考风格。
- 大标题、底部数据条、WHOOP 绿进度条。
- 适合开头附近 3-6 秒。

`glass_side_hud`

- 右侧竖向玻璃面板。
- 大心率数字和进度条。
- 适合墙球、引体或自行车高强度段落。

`summary_card`

- 底部大型卡片，展示 4-6 个关键指标。
- 适合最后 4-8 秒。

`compact_telemetry`

- 小角标卡片。
- 适合动作需要保持干净、不被遮挡时。

`redline_peak`

- 高对比红/绿峰值警报。
- 只适合 1-2 秒短促使用。

`minimal_ticker`

- 只有底部窄条。
- 适合视频本身运动已经很强，不适合大面板时。
