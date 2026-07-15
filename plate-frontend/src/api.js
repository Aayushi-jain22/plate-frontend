const BASE_URL = import.meta.env.VITE_API_BASE_URL 

export const ALLOWED_TAGS = [
  'vegetarian',
  'non-vegetarian',
  'vegan',
  'high-protein',
  'low-carb',
  'snack',
]

class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors || null
  }
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (networkErr) {
    throw new ApiError('Could not reach the server. Is the backend running?', 0)
  }

  if (res.status === 204) return null

  let body = null
  try {
    body = await res.json()
  } catch {
    // no body
  }

  if (!res.ok) {
    if (res.status === 400 && body && typeof body === 'object') {
      throw new ApiError('Validation failed', 400, body)
    }
    if (res.status === 409) {
      throw new ApiError(
        (body && (body.detail || body.error)) || 'A similar meal already exists around this time.',
        409
      )
    }
    if (res.status === 404) {
      throw new ApiError('Not found', 404)
    }
    throw new ApiError((body && (body.detail || body.error)) || `Request failed (${res.status})`, res.status)
  }

  return body
}

function buildQuery(params) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.set(key, value)
    }
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchMeals({ date, tag, search, page } = {}) {
  const qs = buildQuery({ date, tag, search, page })
  return request(`/api/meals/${qs}`)
}

export async function createMeal(payload) {
  return request('/api/meals/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteMeal(id) {
  return request(`/api/meals/${id}/`, { method: 'DELETE' })
}

export async function fetchSummary(date) {
  const qs = buildQuery({ date })
  return request(`/api/meals/summary/${qs}`)
}

export async function fetchTrends(days = 7) {
  const qs = buildQuery({ days })
  return request(`/api/meals/trends/${qs}`)
}

export { ApiError, BASE_URL }
