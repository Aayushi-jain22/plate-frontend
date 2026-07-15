import { useEffect, useState } from 'react'
import { ALLOWED_TAGS } from '../api'

const SEARCH_DEBOUNCE_MS = 400

export default function Filters({ filters, onChange }) {
  // Local, immediate state for the search box so typing never gets
  // interrupted by the parent re-fetching on every keystroke.
  const [searchInput, setSearchInput] = useState(filters.search)

  // Keep local box in sync if filters.search changes from elsewhere
  // (e.g. "Clear" button, or clicking a trends bar resets other filters).
  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  // Debounce: only push the search value up (and trigger a fetch) after
  // the user pauses typing for SEARCH_DEBOUNCE_MS.
  useEffect(() => {
    if (searchInput === filters.search) return
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchInput, page: 1 })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  return (
    <div className="card filters">
      <h2 className="card-title">Filters</h2>
      <div className="filters-row">
        <div className="field">
          <label htmlFor="filter-date">Date</label>
          <input
            id="filter-date"
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ ...filters, date: e.target.value, page: 1 })}
          />
        </div>

        <div className="field">
          <label htmlFor="filter-tag">Tag</label>
          <select
            id="filter-tag"
            value={filters.tag}
            onChange={(e) => onChange({ ...filters, tag: e.target.value, page: 1 })}
          >
            <option value="">All tags</option>
            {ALLOWED_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="field field-grow">
          <label htmlFor="filter-search">Search</label>
          <input
            id="filter-search"
            type="text"
            placeholder="Search meal name…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {(filters.date || filters.tag || filters.search) && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setSearchInput('')
              onChange({ date: '', tag: '', search: '', page: 1 })
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}