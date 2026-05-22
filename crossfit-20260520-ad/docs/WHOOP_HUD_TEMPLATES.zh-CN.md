# WHOOP HUD 模板指南

模板目录位于 `templates/whoop-hud-templates.json`。现在里面包含之前剪辑中沉淀出来的预制样式，也包含未来通过 prompt 自定义样式的规则。

## 现有预制模板

- `style_01_broadcast_bright`（`01`）：5 月 19 日风格的开头 HUD，比原参考更明亮。
- `style_02_glass_side_hud`（`02`）：右侧大型玻璃面板，动态心率数据。
- `style_03_compact_telemetry`（`03`）：小角标遥测卡，适合不遮挡动作的场景。
- `style_04_summary_card`（`04`）：结尾多指标总结卡。
- `style_05_redline_peak`（`05`）：红/绿峰值强度短警报。
- `style_06_minimal_ticker`（`06`）：低遮挡底部数据条。

## 新增未来感样式

- `style_07_holographic_matrix`：围绕运动员的悬浮全息面板。
- `style_08_speed_tunnel_hr`：带径向速度线的动态 BPM 爆发。
- `style_09_recovery_orbit`：恢复/睡眠环形动画。
- `style_10_data_stomp_title`：带微型数据芯片的电影感冲击标题。

## 推荐组合

- 开头：`01`
- 中段：`02` 或 `03`
- 峰值/转场：`05` 或 `08`
- 恢复/背景：`09`
- 结尾：`04`

## Prompt 自定义

用户可以直接用自然语言要求自定义 HUD。处理时先从最接近的预制模板开始，再调整：

- 亮度和对比度
- 强调色
- 数据密度
- 位置和安全区域
- 动效强度
- 指标和出现窗口

示例：

```text
WHOOP 效果以 01 + 02 + 04 为基础，但开头更亮，增加全息扫描线，只在峰值墙球段加入一个大号动态 BPM 爆发。
```

更新 `scripts/generate-overlays.mjs` 时，以 JSON 目录作为样式来源。不要把私密数据或一次性用户素材路径硬编码进模板文档。
