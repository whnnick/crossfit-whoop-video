# 设备数据源

当用户想使用 WHOOP 以外设备的数据时，参考这份说明。

## 支持级别

`direct_api`

- 当设备提供可用 Web API，且用户完成授权时使用。
- 示例：WHOOP OAuth API。

`export_file`

- 当用户提供本地导出文件时使用。
- 对开源 agent 工作流来说，这是 Apple Watch 数据的优先路径。

`manual_entry`

- 当用户提供截图或手动输入指标时使用。
- 必须保持透明，并标注数据来源。

## Apple Watch

Apple Watch 训练指标通常来自 Apple Health。本项目通过用户提供的文件支持 Apple Watch：

- Apple Health 导出 XML
- HealthFit 等 App 导出的 FIT
- 第三方 App 导出的 TCX
- 分析或健康导出 App 导出的 CSV

常用字段：

- 训练开始/结束时间
- 时长
- 活动卡路里
- 平均心率
- 最大心率
- 可用时的心率时间序列
- 训练类型

不要承诺 Node/ffmpeg 项目可以直接访问 Apple Watch 云端数据。直接 HealthKit 访问需要 iOS App 或导出桥接。

## 指标标准化

把所有数据源标准化为：

```json
{
  "source": "whoop|apple_health|healthfit|garmin|strava|manual",
  "workout": {
    "start": "ISO-8601",
    "end": "ISO-8601",
    "duration_seconds": 0,
    "calories": 0,
    "average_heart_rate": 0,
    "max_heart_rate": 0,
    "strain": null,
    "recovery": null,
    "sleep_score": null
  },
  "series": {
    "heart_rate": [
      { "t": 0, "value": 120 }
    ]
  }
}
```

如果某个数据源没有 WHOOP 专属指标，例如 Strain 或 Recovery，就省略这些值，或换成该数据源对应的标签。
