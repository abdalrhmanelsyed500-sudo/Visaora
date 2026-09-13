export default function Loading() {
  return <div className="container loading-page" aria-label="Loading"><div className="loading-line loading-line-short" /><div className="loading-line loading-line-title" /><div className="loading-line" /><div className="loading-grid">{Array.from({ length: 8 }).map((_, index) => <div className="loading-card" key={index} />)}</div></div>;
}
