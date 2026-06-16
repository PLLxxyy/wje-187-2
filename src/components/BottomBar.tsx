import { trails } from '../data/trails';

interface BottomBarProps {
  fpvActive: boolean;
  fpvTrailId: string | null;
  onStartFPV: (trailId: string) => void;
  onStopFPV: () => void;
}

export function BottomBar({ fpvActive, fpvTrailId, onStartFPV, onStopFPV }: BottomBarProps) {
  return (
    <div className="bottom-bar">
      <span className="view-label">
        {fpvActive ? '第一人称视角' : '自由视角'}
      </span>
      <select
        className="trail-select"
        value={fpvTrailId || ''}
        onChange={(e) => {
          if (e.target.value) {
            onStartFPV(e.target.value);
          }
        }}
        disabled={fpvActive}
      >
        <option value="">选择雪道...</option>
        {trails.filter(t => t.status !== 'closed').map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      {!fpvActive ? (
        <button
          className="fp-btn"
          onClick={() => {
            const openTrail = trails.find(t => t.status !== 'closed');
            if (openTrail) onStartFPV(openTrail.id);
          }}
        >
          开始滑行
        </button>
      ) : (
        <button onClick={onStopFPV}>
          退出滑行
        </button>
      )}
    </div>
  );
}
