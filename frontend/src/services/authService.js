// src/services/authService.js

export const login = async (usr, pwd) => {
  const name = usr
    .split('@')[0]
    .replace(/\./g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

  return {
    // token: '2d7955eaec274cc:83f3cf2ecdfd819',
    token: '0fd34065cdad91e:2ac839c93c099f0',
    user: {
      email: usr,
      full_name: name,
    },
  }
}

export const logout = async () => {
  try {
    // End ERPNext/Frappe session
    await fetch('/api/method/logout', {
      method: 'GET',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    // Always clear frontend session
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }
}