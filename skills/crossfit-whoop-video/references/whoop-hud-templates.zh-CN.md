# WHOOP HUD 模板

机器可读目录见 `assets/whoop-hud-templates.json`。

## 推荐组合

电影感运动广告优先使用这三种：

- `broadcast_bright`：开头背景，最接近较暗的 5 月 19 日参考风格，但更明亮。
- `glass_side_hud`：中段强度数据，右侧半透明面板，大心率数字。
- `summary_card`：结尾总结，底部大型多指标卡片。

## 其他样式

- `compact_telemetry`：需要保持动作干净无遮挡时使用的小角标卡。
- `redline_peak`：最大强度 1-2 秒警报。
- `minimal_ticker`：只需要轻量数据时使用的底部窄条。

## 动效模式

使用克制动效：

- 数字滚动/递增
- 进度条增长
- 扫描线扫过
- 面板滑入/滑出
- 短节拍闪光
- 总结卡最终发光

不要让覆盖层在整支视频里持续不断地动画。
