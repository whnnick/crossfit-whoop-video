# WHOOP HUD 模板

机器可读目录见 `assets/whoop-hud-templates.json`。这个目录包含 10 个可复用预制模板，也包含通过 prompt 自定义样式的规则。

## 内置预制模板

默认电影感运动短片优先使用这些：

- `style_01_broadcast_bright`（`01`、`broadcast_bright`）：开头背景，最接近 5 月 19 日参考风格，但更明亮。
- `style_02_glass_side_hud`（`02`、`glass_side_hud`）：中段强度数据，右侧半透明面板，大心率数字。
- `style_03_compact_telemetry`（`03`、`compact_telemetry`）：需要保持动作干净无遮挡时使用的小角标卡。
- `style_04_summary_card`（`04`、`summary_card`）：结尾总结，底部大型多指标卡片。
- `style_05_redline_peak`（`05`、`redline_peak`）：最大强度 1-2 秒警报。
- `style_06_minimal_ticker`（`06`、`minimal_ticker`）：只需要轻量数据时使用的底部窄条。

如果用户要求更酷、更科技感、更未来感，优先考虑：

- `style_07_holographic_matrix`：围绕主体的悬浮全息网格面板。
- `style_08_speed_tunnel_hr`：径向速度线加超大 BPM，适合转场或爆发点。
- `style_09_recovery_orbit`：恢复/睡眠环形动画和卫星式指标。
- `style_10_data_stomp_title`：带微型数据芯片的冲击标题。

## 推荐组合

- 开头：`01` 或 `style_01_broadcast_bright`
- 中段高强度：`02`、`03`、`07` 或 `08`
- 峰值时刻：`05` 或 `08`
- 恢复/背景信息：`09`
- 结尾：`04`

## Prompt 自定义

用户可以直接在提示词里要求自定义样式。处理时先选择最接近的预制模板，再调整：

- 氛围：电影感、明亮、强冲击、极简、未来感、转播感
- 位置：左上、右侧、下三分之一、底部 ticker、全屏 burst
- 数据密度：minimal、balanced、rich
- 动效强度：subtle、medium、high-impact
- 颜色和强调色
- 展示哪些指标
- HUD 出现在哪些时间点或动作附近

示例：

```text
峰值墙球段用 08 样式，但画面更亮，红色少一点，BPM 更大，只做 1.5 秒爆发。
```

## 动效模式

使用短促、有目的的动效：

- 数字滚动/递增
- 进度条增长
- 扫描线扫过
- 面板滑入/滑出
- 径向速度线爆发
- 全息网格生成
- 环形恢复数据绘制
- 标题冲击/故障擦除
- 短节拍闪光
- 总结卡最终发光

不要让覆盖层在整支视频里持续不断地动画。
