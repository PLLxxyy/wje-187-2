import { lifts } from '../data/lifts';

export function LiftPanel() {
  return (
    <div className="lift-panel">
      <h3>索道列表</h3>
      {lifts.map(lift => (
        <div className="lift-item" key={lift.id}>
          <div>
            <div className="lift-name">{lift.name}</div>
            <div className="lift-queue" style={{ fontSize: 11, marginTop: 2 }}>
              {lift.type} · {lift.bottomAlt}m → {lift.topAlt}m
            </div>
          </div>
          <div className="lift-status">
            <span className="lift-queue">
              {lift.status === 'running' ? `${lift.queue}人排队` : '---'}
            </span>
            <span className={`lift-badge ${lift.status}`}>
              {lift.statusText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
