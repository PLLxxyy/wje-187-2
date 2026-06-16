import { Trail, difficultyLabel, difficultyColor } from '../data/trails';

interface TrailInfoCardProps {
  trail: Trail;
  onClose: () => void;
  onStartFPV: (trailId: string) => void;
}

export function TrailInfoCard({ trail, onClose, onStartFPV }: TrailInfoCardProps) {
  const statusClass = trail.status === 'open' ? 'open' : trail.status === 'partial' ? 'partial' : 'closed';
  const diffColor = difficultyColor[trail.difficulty];

  return (
    <div className="trail-info-card">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>
        <span
          className="difficulty-dot"
          style={{
            backgroundColor: trail.difficulty !== 'black' ? diffColor : '#1a1a2e',
            border: trail.difficulty === 'black' ? '1px solid #555' : 'none',
          }}
        />
        {trail.name}
      </h2>
      <div className="info-row">
        <span className="info-label">难度等级</span>
        <span className="info-value">{difficultyLabel[trail.difficulty]}</span>
      </div>
      <div className="info-row">
        <span className="info-label">雪道长度</span>
        <span className="info-value">{trail.length.toLocaleString()} 米</span>
      </div>
      <div className="info-row">
        <span className="info-label">平均坡度</span>
        <span className="info-value">{trail.avgSlope}%</span>
      </div>
      <div className="info-row">
        <span className="info-label">最大坡度</span>
        <span className="info-value">{trail.maxSlope}%</span>
      </div>
      <div className="info-row">
        <span className="info-label">当前状态</span>
        <span className={`status-badge ${statusClass}`}>{trail.statusText}</span>
      </div>
      {trail.status !== 'closed' && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            className="fp-btn"
            onClick={() => onStartFPV(trail.id)}
            style={{
              background: 'rgba(46, 204, 113, 0.2)',
              border: '1px solid rgba(46, 204, 113, 0.5)',
              color: '#2ecc71',
              padding: '10px 28px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            第一人称滑行
          </button>
        </div>
      )}
    </div>
  );
}
