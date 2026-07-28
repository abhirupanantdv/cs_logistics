// src/config/constants.js

// Use relative URL so requests go through Vite proxy
export const API_BASE_URL = '/api';

export const API_TOKEN =
  '2d7955eaec274cc:36aaab30681d990';

// Files are served from ERPNext, also proxied through Vite
export const getFileUrl = (fileName) =>
  `/files/${encodeURIComponent(fileName)}`;

export const STORAGE_KEYS = {
  TOKEN: 'cs_token',
  USER: 'cs_user',
};