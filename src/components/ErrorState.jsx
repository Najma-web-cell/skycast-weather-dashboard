export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel state-panel--error">
      <div className="error-icon">!</div>
      <p className="state-title">Couldn't load weather</p>
      <p className="state-subtitle">{message}</p>
      <button className="retry-btn" onClick={onRetry}>Try again</button>
    </div>
  )
}
