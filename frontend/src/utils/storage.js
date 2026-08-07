//storage.js
import { STORAGE_KEYS } from '@/config/constants'

export const setAuth = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : null
}

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}