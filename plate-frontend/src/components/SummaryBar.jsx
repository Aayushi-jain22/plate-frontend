
import Spinner from './Spinner.jsx'
export default function SummaryBar({ summary, loading, error, date }) {
  return (
    <div className="card nutrition-label">
      <div className="nl-header">
        <span className="nl-eyebrow">Daily Value</span>
        <h2 className="nl-title">Nutrition Summary</h2>
        <span className="nl-date">{date}</span>
      </div>


    {loading && <Spinner label="Calculating…" />}
      {!loading && error && <div className="state-message state-error">{error}</div>}

      {!loading && !error && summary && (
        <>
          <div className="nl-rule-thick" />

          <div className="nl-calories">
            <span className="nl-calories-value">{summary.total_calories}</span>
            <span className="nl-calories-unit">/ {summary.goal_kcal} kcal</span>
          </div>

          <div className="progress-track">
            <div
              className={`progress-fill ${
                summary.total_calories > summary.goal_kcal ? 'progress-over' : ''
              }`}
              style={{
                width: `${Math.min(100, (summary.total_calories / summary.goal_kcal) * 100)}%`,
              }}
            />
          </div>
          <div className="nl-remaining">
            {summary.remaining_kcal >= 0
              ? `${summary.remaining_kcal} kcal remaining`
              : `${Math.abs(summary.remaining_kcal)} kcal over goal`}
          </div>

          <div className="nl-rule-thin" />

          <dl className="nl-macros">
            <div className="nl-macro-row">
              <dt>Protein</dt>
              <dd>{summary.macros.protein_g} g</dd>
            </div>
            <div className="nl-macro-row">
              <dt>Carbohydrates</dt>
              <dd>{summary.macros.carbs_g} g</dd>
            </div>
            <div className="nl-macro-row">
              <dt>Fat</dt>
              <dd>{summary.macros.fat_g} g</dd>
            </div>
          </dl>

          <div className="nl-rule-thin" />

          <div className="nl-footer">
            <span>{summary.meal_count} meals logged</span>
            {summary.top_tags && summary.top_tags.length > 0 && (
              <span className="nl-tags">{summary.top_tags.join(' · ')}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
