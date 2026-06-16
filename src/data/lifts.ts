export interface Lift {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'maintenance' | 'stopped';
  statusText: string;
  queue: number;    // 排队人数
  capacity: number; // 每小时运力
  topAlt: number;
  bottomAlt: number;
}

export const lifts: Lift[] = [
  {
    id: 'lift-1',
    name: '金顶索道',
    type: '高速缆车',
    status: 'running',
    statusText: '运行中',
    queue: 23,
    capacity: 2400,
    topAlt: 3200,
    bottomAlt: 1800,
  },
  {
    id: 'lift-2',
    name: '银松索道',
    type: '四人缆车',
    status: 'running',
    statusText: '运行中',
    queue: 15,
    capacity: 1800,
    topAlt: 2800,
    bottomAlt: 1800,
  },
  {
    id: 'lift-3',
    name: '云海索道',
    type: '高速缆车',
    status: 'running',
    statusText: '运行中',
    queue: 31,
    capacity: 2400,
    topAlt: 3200,
    bottomAlt: 2000,
  },
  {
    id: 'lift-4',
    name: '黑钻索道',
    type: '六人缆车',
    status: 'maintenance',
    statusText: '维护中',
    queue: 0,
    capacity: 3000,
    topAlt: 3400,
    bottomAlt: 2200,
  },
  {
    id: 'lift-5',
    name: '雪兔魔毯',
    type: '魔毯',
    status: 'running',
    statusText: '运行中',
    queue: 8,
    capacity: 1200,
    topAlt: 2000,
    bottomAlt: 1800,
  },
  {
    id: 'lift-6',
    name: '风谷索道',
    type: '八人缆车',
    status: 'stopped',
    statusText: '大风停运',
    queue: 0,
    capacity: 3600,
    topAlt: 3400,
    bottomAlt: 1900,
  },
];
