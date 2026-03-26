const BASE_URL = "http://localhost:3000"

export const apiRequest = async (endpoint, method, body, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : undefined
  })

  return res.json()
}