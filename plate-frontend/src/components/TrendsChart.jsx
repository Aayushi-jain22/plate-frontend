import { formatDateShort } from '../utils'
import Spinner from './Spinner.jsx'

const WIDTH = 560
const HEIGHT = 200
const PADDING_BOTTOM = 28
const PADDING_TOP = 12

export default function TrendsChart({ trends, loading, error, selectedDate, onSelectDate, goalKcal }) {
  return (
    <div className="card trends">
      <div className="card-title-row">
        <h2 className="card-title">Last {trends ? trends.days : 7} days</h2>
        {trends && <span className="meal-count-badge">avg {Math.round(trends.avg_daily_kcal)} kcal/day</span>}
      </div>


      {loading && <Spinner label="Loading trends…" />}
      {!loading && error && <div className="state-message state-error">{error}</div>}

      {!loading && !error && trends && (
        <>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="trends-svg"
            role="img"
            aria-label="Calories per day over the trend window"
          >
            {(() => {
              const series = trends.series
              const maxVal = Math.max(...series.map((d) => d.calories), goalKcal || 1, 1)
              const barGap = 8
              const barWidth = (WIDTH - barGap * (series.length - 1)) / series.length
              const chartHeight = HEIGHT - PADDING_BOTTOM - PADDING_TOP

              return series.map((day, i) => {
                const barHeight = (day.calories / maxVal) * chartHeight
                const x = i * (barWidth + barGap)
                const y = HEIGHT - PADDING_BOTTOM - barHeight
                const isSelected = day.date === selectedDate
                const isOver = goalKcal ? day.calories > goalKcal : false

                return (
                  <g
                    key={day.date}
                    className="trend-bar-group"
                    onClick={() => onSelectDate(isSelected ? null : day.date)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      rx={2}
                      className={`trend-bar ${isOver ? 'trend-bar-over' : ''} ${
                        isSelected ? 'trend-bar-selected' : ''
                      }`}
                    />
                    <text
                      x={x + barWidth / 2}
                      y={HEIGHT - 10}
                      textAnchor="middle"
                      className="trend-label"
                    >
                      {formatDateShort(day.date)}
                    </text>
                    <title>
                      {day.date}: {day.calories} kcal, {day.meal_count} meals
                    </title>
                  </g>
                )
              })
            })()}
          </svg>

          <div className="trends-legend">
            <span>
              <span className="legend-swatch" /> under goal
            </span>
            <span>
              <span className="legend-swatch legend-swatch-over" /> over goal
            </span>
            <span className="trends-hint">Click a bar to filter meals to that day</span>
          </div>

          <div className="trends-footer">
            <span>Best day: {trends.best_day.date} ({trends.best_day.calories} kcal)</span>
            <span>{trends.days_over_goal} day(s) over goal</span>
          </div>
        </>
      )}
    </div>
  )
}
