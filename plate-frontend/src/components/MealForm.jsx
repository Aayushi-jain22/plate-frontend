import { useState } from 'react'
import { ALLOWED_TAGS, createMeal, ApiError } from '../api'
import { localInputToIso } from '../utils'

const emptyForm = {
  name: '',
  calories: '',
  protein_g: '',
  carbs_g: '',
  fat_g: '',
  tags: [],
  eaten_at: '',
}

function validate(form) {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or fewer.'
  }

  const calories = Number(form.calories)
  if (form.calories === '' || Number.isNaN(calories)) {
    errors.calories = 'Calories is required.'
  } else if (calories < 1 || calories > 5000) {
    errors.calories = 'Calories must be between 1 and 5000.'
  }

  ;['protein_g', 'carbs_g', 'fat_g'].forEach((field) => {
    const val = form[field]
    if (val !== '' && Number(val) < 0) {
      errors[field] = 'Must be zero or greater.'
    }
  })

  if (form.tags.length === 0) {
    errors.tags = 'Select at least one tag.'
  } else if (form.tags.some((t) => !ALLOWED_TAGS.includes(t))) {
    errors.tags = 'Only the predefined tags are allowed.'
  }

  if (!form.eaten_at) {
    errors.eaten_at = 'Date and time eaten is required.'
  } else {
    const chosen = new Date(form.eaten_at)
    if (chosen.getTime() > Date.now()) {
      errors.eaten_at = 'Cannot log a meal in the future.'
    }
  }

  return errors
}

export default function MealForm({ onMealAdded }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'error' | 'success', text }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function toggleTag(tag) {
    setForm((f) => {
      const has = f.tags.includes(tag)
      return { ...f, tags: has ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }
    })
    setErrors((e) => ({ ...e, tags: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBanner(null)
    const clientErrors = validate(form)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        calories: Number(form.calories),
        protein_g: form.protein_g === '' ? 0 : Number(form.protein_g),
        carbs_g: form.carbs_g === '' ? 0 : Number(form.carbs_g),
        fat_g: form.fat_g === '' ? 0 : Number(form.fat_g),
        tags: form.tags,
        eaten_at: localInputToIso(form.eaten_at),
      }
      const created = await createMeal(payload)
      setForm(emptyForm)
      setBanner({ type: 'success', text: `Logged "${created.name}".` })
      onMealAdded()
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && err.fieldErrors) {
        const serverErrors = {}
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          serverErrors[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(serverErrors)
      } else if (err instanceof ApiError && err.status === 409) {
        setBanner({ type: 'error', text: err.message })
      } else {
        setBanner({ type: 'error', text: err.message || 'Could not save this meal.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card meal-form" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Log a meal</h2>

      {banner && <div className={`banner banner-${banner.type}`}>{banner.text}</div>}

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={form.name}
          maxLength={100}
          onChange={(e) => updateField('name', e.target.value)}
          disabled={submitting}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="calories">Calories</label>
          <input
            id="calories"
            type="number"
            min={1}
            max={5000}
            value={form.calories}
            onChange={(e) => updateField('calories', e.target.value)}
            disabled={submitting}
          />
          {errors.calories && <span className="field-error">{errors.calories}</span>}
        </div>

        <div className="field">
          <label htmlFor="protein">Protein (g)</label>
          <input
            id="protein"
            type="number"
            min={0}
            value={form.protein_g}
            onChange={(e) => updateField('protein_g', e.target.value)}
            disabled={submitting}
          />
          {errors.protein_g && <span className="field-error">{errors.protein_g}</span>}
        </div>
      </div>
      

      <div className="field-row">
        <div className="field">
          <label htmlFor="carbs">Carbs (g)</label>
          <input
            id="carbs"
            type="number"
            min={0}
            value={form.carbs_g}
            onChange={(e) => updateField('carbs_g', e.target.value)}
            disabled={submitting}
          />
          {errors.carbs_g && <span className="field-error">{errors.carbs_g}</span>}
        </div>
        <div className="field">
          <label htmlFor="fat">Fat (g)</label>
          <input
            id="fat"
            type="number"
            min={1}
            value={form.fat_g}
            onChange={(e) => updateField('fat_g', e.target.value)}
            disabled={submitting}
          />
          {errors.fat_g && <span className="field-error">{errors.fat_g}</span>}
        </div>
      </div>

      <div className="field">
        <label>Tags</label>
        <div className="tag-picker">
          {ALLOWED_TAGS.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`tag-toggle ${form.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
              disabled={submitting}
            >
              {tag}
            </button>
          ))}
        </div>
        {errors.tags && <span className="field-error">{errors.tags}</span>}
      </div>

      <div className="field">
        <label htmlFor="eaten_at">Eaten at</label>
        <input
          id="eaten_at"
          type="datetime-local"
          value={form.eaten_at}
          onChange={(e) => updateField('eaten_at', e.target.value)}
          disabled={submitting}
        />
        {errors.eaten_at && <span className="field-error">{errors.eaten_at}</span>}
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : 'Add meal'}
      </button>
    </form>
  )
}
