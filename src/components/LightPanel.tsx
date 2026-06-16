import { trails, difficultyColor } from '../data/trails';

interface LightPanelProps {
  activeZones: Record<string, boolean>;
  onToggle: (trailId: string) => void;
  onToggleAll: (on: boolean) => void;
}

export function LightPanel({ activeZones, onToggle, onToggleAll }: LightPanelProps) {
  const allOn = trails.every(t => activeZones[t.id]);
  const allOff = trails.every(t => !activeZones[t.id]);

  return (
    <div className="light-panel">
      <div className="light-panel-header">
        <div className="light-panel-title">
          <span className="light-icon">💡</span>
          <h3>夜场灯光控制</h3>
        </div>
        <div className="light-panel-buttons">
          <button
            className="light-all-btn"
            onClick={() => onToggleAll(true)}
            disabled={allOn}
          >
            全部开启
          </button>
          <button
            className="light-all-btn"
            onClick={() => onToggleAll(false)}
            disabled={allOff}
          >
            全部关闭
          </button>
        </div>
      </div>

      <div className="light-zone-list">
        {trails.map(trail => {
          const isOn = activeZones[trail.id] ?? false;
          return (
            <div
              key={trail.id}
              className={`light-zone-item ${isOn ? 'active' : ''}`}
              onClick={() => onToggle(trail.id)}
            >
              <div className="zone-info">
                <div
                  className="zone-dot"
                  style={{ background: difficultyColor[trail.difficulty] }}
                />
                <div className="zone-details">
                  <span className="zone-name">{trail.name}</span>
                  <span className="zone-status">
                    {isOn ? '照明中' : '已关闭'}
                  </span>
                </div>
              </div>
              <div className={`light-switch ${isOn ? 'on' : ''}`}>
                <div className="light-switch-knob" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="light-panel-footer">
        <span className="light-count">
          已开启 {trails.filter(t => activeZones[t.id]).length} / {trails.length} 区域
        </span>
      </div>
    </div>
  );
}
