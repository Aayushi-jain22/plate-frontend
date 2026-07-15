import { useState } from 'react'
import { formatTime } from '../utils'
import ConfirmDialog from './ConfirmDialog.jsx'
import Spinner from './Spinner.jsx'

export default function MealList({
  meals,
  count,
  page,
  hasNext,
  hasPrevious,
  loading,
  error,
  deletingId,
  onPageChange,
  onDelete,
}) {
  const [pendingMeal, setPendingMeal] = useState(null)

  function handleDeleteClick(meal) {
    setPendingMeal(meal)
  }

  function handleConfirm() {
    if (!pendingMeal) return
    onDelete(pendingMeal.id)
    setPendingMeal(null)
  }

  function handleCancel() {
    setPendingMeal(null)
  }

  return (
    <div className="card meal-list">
      <div className="card-title-row">
        <h2 className="card-title">Meals</h2>
        {!loading && !error && <span className="meal-count-badge">{count} total</span>}
      </div>

     {loading && <Spinner label="Loading meals…" />}

      {!loading && error && <div className="state-message state-error">{error}</div>}

      {!loading && !error && meals.length === 0 && (
        <div className="state-message state-empty">
          No meals match these filters. Try widening your search or clearing filters.
        </div>
      )}

      {!loading && !error && meals.length > 0 && (
        <>
          <ul className="meal-items">
            {meals.map((meal) => (
              <li key={meal.id} className="meal-item">
                <div className="meal-item-main">
                  <span className="meal-item-name">{meal.name}</span>
                  <span className="meal-item-meta">
                    {formatTime(meal.eaten_at)} · {meal.calories} kcal
                  </span>
                  <div className="meal-item-tags">
                    {meal.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="meal-item-macros">
                  <span>P {meal.protein_g}g</span>
                  <span>C {meal.carbs_g}g</span>
                  <span>F {meal.fat_g}g</span>
                </div>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDeleteClick(meal)}
                  disabled={deletingId === meal.id}
                  aria-label={`Delete ${meal.name}`}
                >
                  {deletingId === meal.id ? '…' : '✕'}
                </button>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevious}
            >
              ← Prev
            </button>
            <span className="page-indicator">Page {page}</span>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext}
            >
              Next →
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={pendingMeal !== null}
        title="Delete meal"
        message={pendingMeal ? `Are you sure you want to delete "${pendingMeal.name}"?` : ''}
        confirmLabel="Yes, delete"
        busy={pendingMeal ? deletingId === pendingMeal.id : false}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}