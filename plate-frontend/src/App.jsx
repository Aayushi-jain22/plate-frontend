import { useCallback, useEffect, useState } from 'react'
import MealForm from './components/MealForm.jsx'
import Filters from './components/Filters.jsx'
import MealList from './components/MealList.jsx'
import SummaryBar from './components/SummaryBar.jsx'
import TrendsChart from './components/TrendsChart.jsx'
import { fetchMeals, fetchSummary, fetchTrends, deleteMeal } from './api'
import { todayDateString } from './utils'

const initialFilters = { date: '', tag: '', search: '', page: 1 }

export default function App() {
  const [filters, setFilters] = useState(initialFilters)

  const [meals, setMeals] = useState([])
  const [mealCount, setMealCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(null)

  const [trends, setTrends] = useState(null)
  const [trendsLoading, setTrendsLoading] = useState(true)
  const [trendsError, setTrendsError] = useState(null)
  const [selectedTrendDate, setSelectedTrendDate] = useState(null)

  const summaryDate = filters.date || todayDateString()

  const loadMeals = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const data = await fetchMeals(filters)
      setMeals(data.results)
      setMealCount(data.count)
      setHasNext(Boolean(data.next))
      setHasPrevious(Boolean(data.previous))
    } catch (err) {
      setListError(err.message || 'Could not load meals.')
    } finally {
      setListLoading(false)
    }
  }, [filters])

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true)
    setSummaryError(null)
    try {
      const data = await fetchSummary(summaryDate)
      setSummary(data)
    } catch (err) {
      setSummaryError(err.message || 'Could not load summary.')
    } finally {
      setSummaryLoading(false)
    }
  }, [summaryDate])

  const loadTrends = useCallback(async () => {
    setTrendsLoading(true)
    setTrendsError(null)
    try {
      const data = await fetchTrends(7)
      setTrends(data)
    } catch (err) {
      setTrendsError(err.message || 'Could not load trends.')
    } finally {
      setTrendsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMeals()
  }, [loadMeals])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  useEffect(() => {
    loadTrends()
  }, [loadTrends])

  function handleMealAdded() {
    // Live update: refresh list, summary, and trends without a page reload
    loadMeals()
    loadSummary()
    loadTrends()
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteMeal(id)
      await loadMeals()
      await loadSummary()
      await loadTrends()
    } catch (err) {
      setListError(err.message || 'Could not delete this meal.')
    } finally {
      setDeletingId(null)
    }
  }

  function handleTrendDateSelect(date) {
    setSelectedTrendDate(date)
    setFilters((f) => ({ ...f, date: date || '', page: 1 }))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-eyebrow">Fitshield Dietfood</span>
        <h1>Plate</h1>
        <p className="app-subtitle">Track what you eat against your daily goal.</p>
      </header>

      <main className="app-grid">
        <div className="app-col app-col-left">
          <MealForm onMealAdded={handleMealAdded} />
        </div>

        <div className="app-col app-col-right">
          <SummaryBar
            summary={summary}
            loading={summaryLoading}
            error={summaryError}
            date={summaryDate}
          />
          <TrendsChart
            trends={trends}
            loading={trendsLoading}
            error={trendsError}
            selectedDate={selectedTrendDate}
            onSelectDate={handleTrendDateSelect}
            goalKcal={summary ? summary.goal_kcal : null}
          />
        </div>

        <div className="app-col app-col-full">
          <Filters filters={filters} onChange={setFilters} />
          <MealList
            meals={meals}
            count={mealCount}
            page={filters.page}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            loading={listLoading}
            error={listError}
            deletingId={deletingId}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  )
}
