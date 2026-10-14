/**
 * PlantCare AI - Centralized API Service
 * Handles HTTP requests to the FastAPI backend with token injection,
 * error handling, and demo-mode fallbacks for offline exploration.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = (API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
  }

  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem('plantcare_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.isFormData);

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText || 'An unexpected error occurred' };
        }
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      // Handle PDF or blob downloads
      if (options.responseType === 'blob') {
        return await response.blob();
      }

      return await response.json();
    } catch (error) {
      console.warn(`API call to ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  // Health
  checkHealth() {
    return this.request('/api/health');
  }

  // Authentication
  login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return this.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
  }

  register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Plant Disease Diagnosis
  predictDisease(imageFile, crop = 'Tomato') {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('crop', crop);

    return this.request('/api/diagnosis/predict', {
      method: 'POST',
      isFormData: true,
      body: formData,
    });
  }

  getDiagnosisById(id) {
    return this.request(`/api/diagnosis/${id}`);
  }

  // History
  getHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/history${query ? `?${query}` : ''}`);
  }

  deleteHistoryItem(id) {
    return this.request(`/api/history/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard Statistics
  getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  // Disease Knowledge Library
  getDiseases(crop = '') {
    const query = crop ? `?crop=${encodeURIComponent(crop)}` : '';
    return this.request(`/api/diseases${query}`);
  }

  getDiseaseById(id) {
    return this.request(`/api/diseases/${id}`);
  }

  getSupportedCrops() {
    return this.request('/api/crops');
  }

  // Weather
  getWeather(location = 'Sacramento') {
    return this.request(`/api/weather?location=${encodeURIComponent(location)}`);
  }

  // Chatbot
  sendChatMessage(message, context = {}) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  // PDF Report
  downloadReport(diagnosisId) {
    return this.request(`/api/reports/${diagnosisId}/pdf`, {
      responseType: 'blob',
    });
  }
}

export const api = new ApiService();
export default api;
