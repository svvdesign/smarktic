import { assessmentAreas } from '../data/content.js'
import { postJSON } from './api.js'

// Mirrors score_assessment() in server/app.py so the self-check still
// works when the site is served without the Python backend.
const AREA_TO_SERVICE = {
  governance: 'audit',
  risk: 'audit',
  maturity: 'audit',
  alignment: 'roadmap',
  readiness: 'leadership',
}

export function scoreLocally(answers) {
  const ids = assessmentAreas.map((a) => a.id)
  const values = ids.map((id) => answers[id])
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length
  const score = Math.round(((avg - 1) / 4) * 100)
  const level = score < 25 ? 'Exploratory' : score < 50 ? 'Emerging' : score < 75 ? 'Structured' : 'Leading'
  const lowest = Math.min(...values)
  const focus = ids.filter((id) => answers[id] === lowest)
  const recommendation = score < 50 ? 'audit' : AREA_TO_SERVICE[focus[0]]
  return { score, level, focus, recommendation }
}

export async function scoreAssessment(answers) {
  try {
    const { result } = await postJSON('/api/assessment', { answers })
    return result
  } catch {
    return scoreLocally(answers)
  }
}
