export default function LoadingState() {
  return (
    <div className="state-panel">
      <div className="spinner" aria-hidden="true"></div>
      <p className="state-title">Fetching live weather…</p>
      <p className="state-subtitle">Talking to the weather satellite ☁️</p>
    </div>
  )
}
