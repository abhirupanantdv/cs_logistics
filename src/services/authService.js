// src/services/authService.js

export const login = async (usr, pwd) => {
  const name = usr
    .split('@')[0]
    .replace(/\./g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

  return {
    // token: '2d7955eaec274cc:83f3cf2ecdfd819',
    token: '2d7955eaec274cc:36aaab30681d990',
    user: {
      email: usr,
      full_name: name,
    },
  }
}

export const logout = async () => {}