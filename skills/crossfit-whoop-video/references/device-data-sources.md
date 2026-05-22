# Device Data Sources

Use this guide when the user wants metrics from devices other than WHOOP.

## Support Levels

`direct_api`

- Use when the device exposes a supported web API and the user authorizes it.
- Example: WHOOP OAuth API.

`export_file`

- Use when the user provides a local export file.
- This is the preferred path for Apple Watch data in an open-source agent workflow.

`manual_entry`

- Use when the user provides a screenshot or typed metrics.
- Keep it transparent and label the data source.

## Apple Watch

Apple Watch workout metrics usually come from Apple Health. In this project, support Apple Watch through user-provided files:

- Apple Health export XML
- FIT exported by apps such as HealthFit
- TCX exported by third-party apps
- CSV exported by analytics or health export apps

Expected useful fields:

- workout start/end
- duration
- active calories
- average heart rate
- max heart rate
- heart-rate samples over time when available
- workout type

Do not promise direct Apple Watch cloud access from a Node/ffmpeg project. Direct HealthKit access requires an iOS app or an export bridge.

## Metric Normalization

Normalize all data sources into:

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

If a source lacks WHOOP-specific metrics such as Strain or Recovery, omit those values or replace them with source-appropriate labels.
