const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return 'https://plant-tracker-backend-production.up.railway.app';
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();