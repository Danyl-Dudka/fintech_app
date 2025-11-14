export async function api(url: string, options: RequestInit = {}): Promise<Response> {
  let accessToken = sessionStorage.getItem('token');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
    credentials: 'include',
  })

  if (response.status === 401) {
    const refreshResponse = await fetch('http://localhost:3000/refresh', {
      method: 'POST',
      credentials: 'include'
    })

    if (!refreshResponse.ok) {
      sessionStorage.removeItem('token');
      window.location.href = ('/login');
      return response
    }

    const refreshToken = await refreshResponse.json();
    sessionStorage.setItem('token', refreshToken.accessToken);

    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken.accessToken}`
      },
      credentials: 'include'
    })
  }
  return response
}
