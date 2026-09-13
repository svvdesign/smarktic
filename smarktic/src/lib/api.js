export async function postJSON(path, data) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  let body = null
  try {
    body = await res.json()
  } catch {
    // Non-JSON response (e.g. the Python server is not running).
  }
  if (!res.ok || !body?.ok) {
    const error = new Error(body?.error || 'The server could not be reached. Is the Python backend running?')
    error.fields = body?.fields || {}
    throw error
  }
  return body
}
