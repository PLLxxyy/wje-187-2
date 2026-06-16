export interface TrailPoint {
  x: number;
  y: number;
  z: number;
}

export interface Trail {
  id: string;
  name: string;
  difficulty: 'green' | 'blue' | 'black';
  length: number;       // 米
  avgSlope: number;     // 百分比
  maxSlope: number;     // 百分比
  status: 'open' | 'partial' | 'closed';
  statusText: string;
  points: TrailPoint[];
}

export const trails: Trail[] = [
  {
    id: 'trail-1',
    name: '银松道',
    difficulty: 'green',
    length: 2800,
    avgSlope: 15,
    maxSlope: 22,
    status: 'open',
    statusText: '全线开放',
    points: [
      { x: 8, y: 14, z: -8 },
      { x: 6, y: 11, z: -6 },
      { x: 5, y: 8, z: -4 },
      { x: 4, y: 5.5, z: -2 },
      { x: 3, y: 3, z: 0 },
      { x: 2, y: 1, z: 2 },
      { x: 1, y: 0.3, z: 4 },
    ],
  },
  {
    id: 'trail-2',
    name: '雪兔道',
    difficulty: 'green',
    length: 2200,
    avgSlope: 12,
    maxSlope: 18,
    status: 'open',
    statusText: '全线开放',
    points: [
      { x: 2, y: 13, z: -10 },
      { x: 1, y: 10, z: -8 },
      { x: 0, y: 7.5, z: -6 },
      { x: -1, y: 5, z: -4 },
      { x: -2, y: 3, z: -2 },
      { x: -3, y: 1.2, z: 0 },
      { x: -4, y: 0.3, z: 2 },
    ],
  },
  {
    id: 'trail-3',
    name: '云海道',
    difficulty: 'blue',
    length: 3200,
    avgSlope: 25,
    maxSlope: 35,
    status: 'open',
    statusText: '全线开放',
    points: [
      { x: 10, y: 16, z: -12 },
      { x: 8, y: 13, z: -10 },
      { x: 6, y: 10, z: -8 },
      { x: 4, y: 7, z: -5 },
      { x: 3, y: 4.5, z: -3 },
      { x: 1, y: 2, z: 0 },
      { x: 0, y: 0.4, z: 3 },
    ],
  },
  {
    id: 'trail-4',
    name: '风之谷',
    difficulty: 'blue',
    length: 3600,
    avgSlope: 28,
    maxSlope: 38,
    status: 'partial',
    statusText: '部分开放',
    points: [
      { x: 14, y: 18, z: -14 },
      { x: 12, y: 15, z: -12 },
      { x: 10, y: 12, z: -9 },
      { x: 8, y: 9, z: -6 },
      { x: 6, y: 6, z: -3 },
      { x: 5, y: 3, z: 0 },
      { x: 4, y: 0.5, z: 3 },
    ],
  },
  {
    id: 'trail-5',
    name: '黑钻陡坡',
    difficulty: 'black',
    length: 1800,
    avgSlope: 42,
    maxSlope: 55,
    status: 'open',
    statusText: '全线开放',
    points: [
      { x: -6, y: 17, z: -15 },
      { x: -5, y: 14, z: -13 },
      { x: -4, y: 11, z: -10 },
      { x: -3, y: 8, z: -7 },
      { x: -2, y: 5, z: -4 },
      { x: -1, y: 2.5, z: -1 },
      { x: 0, y: 0.5, z: 2 },
    ],
  },
  {
    id: 'trail-6',
    name: '悬崖飞瀑',
    difficulty: 'black',
    length: 1500,
    avgSlope: 48,
    maxSlope: 62,
    status: 'closed',
    statusText: '因积雪不足关闭',
    points: [
      { x: -2, y: 19, z: -16 },
      { x: -3, y: 16, z: -14 },
      { x: -4, y: 13, z: -11 },
      { x: -5, y: 10, z: -8 },
      { x: -5, y: 7, z: -5 },
      { x: -5, y: 4, z: -2 },
      { x: -5, y: 1.5, z: 1 },
    ],
  },
];

export const difficultyColor: Record<string, string> = {
  green: '#2ecc71',
  blue: '#3498db',
  black: '#1a1a2e',
};

export const difficultyLabel: Record<string, string> = {
  green: '初级',
  blue: '中级',
  black: '高级',
};
