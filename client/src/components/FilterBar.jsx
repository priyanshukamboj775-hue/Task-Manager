const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function FilterBar({ filter, onFilterChange, search, onSearchChange, meta }) {
  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-tab${filter === f.value ? ' filter-tab--active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="search-wrap">
        <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className="task-counts">
        <span className="count-badge count-badge--active">{meta.activeCount} active</span>
        <span className="count-badge count-badge--done">{meta.completedCount} done</span>
      </div>
    </div>
  );
}
