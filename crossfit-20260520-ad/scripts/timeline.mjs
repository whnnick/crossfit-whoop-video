export const WIDTH = 2160;
export const HEIGHT = 3840;
export const FPS = 30;
export const OUTPUT_DURATION = 50;

export const clips = [
  { id: "01-c2-mount", source: "flow-502.mov", start: 17.5, duration: 3.0, zoom: 1.14, panX: -20, panY: -10, panXEnd: 5, panYEnd: -30 },
  { id: "02-c2-cycle-wide", source: "flow-502.mov", start: 27.8, duration: 4.2, speed: 0.9, zoom: 1.18, panX: -45, panY: -12, panXEnd: 10, panYEnd: -35 },
  { id: "03-airbike-power", source: "flow-508.mov", start: 20.0, duration: 3.0, speed: 0.92, zoom: 1.16, panX: -18, panY: -8, panXEnd: 14, panYEnd: -28 },
  { id: "03-c2-drive-tail", source: "flow-502.mov", start: 51.5, duration: 1.2, speed: 0.9, zoom: 1.36, panX: -36, panY: -48, panXEnd: -8, panYEnd: -62 },
  { id: "04-c2-sprint", source: "flow-502.mov", start: 56.0, duration: 3.6, speed: 0.88, zoom: 1.42, panX: -70, panY: -40, panXEnd: 0, panYEnd: -72 },
  { id: "05-wallball-full-a", source: "flow-504.mov", start: 352.2, duration: 4.4, speed: 0.88, zoom: 1.06, panX: 0, panY: -40, panYEnd: -190 },
  { id: "06-wallball-full-b", source: "flow-504.mov", start: 389.0, duration: 4.4, speed: 0.88, zoom: 1.06, panX: 0, panY: -42, panYEnd: -195 },
  { id: "07-pullup-full-a", source: "flow-502.mov", start: 110.8, duration: 4.4, speed: 0.8, zoom: 1.48, panX: -4, panY: -228, panXEnd: 24, panYEnd: -310 },
  { id: "08-pullup-full-b", source: "flow-502.mov", start: 113.8, duration: 3.8, speed: 0.78, zoom: 1.66, panX: 8, panY: -292, panXEnd: 38, panYEnd: -365 },
  { id: "09-wallball-full-c", source: "flow-504.mov", start: 417.0, duration: 4.6, speed: 0.88, zoom: 1.06, panX: 0, panY: -45, panYEnd: -200 },
  { id: "10-fall-comedy", source: "flow-508.mov", start: 368.8, duration: 4.8, zoom: 1.06, panX: 0, panY: -18, panYEnd: -78 },
  { id: "11-wallball-full-d", source: "flow-504.mov", start: 424.8, duration: 4.6, speed: 0.86, zoom: 1.06, panX: 0, panY: -45, panYEnd: -205 },
  { id: "12-c2-return", source: "flow-502.mov", start: 59.0, duration: 3.5, speed: 0.92, zoom: 1.38, panX: -60, panY: -26, panXEnd: 4, panYEnd: -58 },
  { id: "13-wallball-full-e", source: "flow-504.mov", start: 449.5, duration: 5.0, speed: 0.86, zoom: 1.06, panX: 0, panY: -48, panYEnd: -210 },
  { id: "14-wallball-finish", source: "flow-504.mov", start: 456.0, duration: 5.4, speed: 0.86, zoom: 1.06, panX: 0, panY: -52, panYEnd: -215 }
];

export function timelineClips() {
  let start = 0;
  return clips.map((clip) => {
    const item = { ...clip, timelineStart: Number(start.toFixed(3)), speed: clip.speed || 1 };
    start += clip.duration;
    return item;
  });
}

export function totalDuration() {
  return Number(timelineClips().reduce((sum, clip) => sum + clip.duration, 0).toFixed(3));
}

export const transitionTimes = timelineClips()
  .slice(1)
  .map((clip) => Number(clip.timelineStart.toFixed(3)));

export const hudWindows = {
  startup: [
    [0.7, 2.6],
    [2.6, 4.4],
    [4.4, 6.2]
  ],
  heartRate: [
    [17.0, 18.3],
    [18.3, 19.6],
    [23.2, 24.6],
    [28.4, 29.8]
  ],
  fatigue: [],
  summary: [
    [42.6, 44.2],
    [44.2, 45.8],
    [45.8, 47.4],
    [47.4, 49.8]
  ]
};
