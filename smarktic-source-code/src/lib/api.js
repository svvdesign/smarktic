const OFFLINE_MESSAGE = 'Online submissions are not available on this version of the site yet. Please try again later.'

export async function postJSON(path, data) {
  let res
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    throw new Error(OFFLINE_MESSAGE)
  }
  let body = null
  try {
    body = await res.json()
  } catch {
    // Non-JSON response (e.g. the Python server is not running).
  }
  if (!res.ok || !body?.ok) {
    const error = new Error(body?.error || OFFLINE_MESSAGE)
    error.fields = body?.fields || {}
    throw error
  }
  return body
}
