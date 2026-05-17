import axios from 'axios';

// Create independent Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),

    // Profile
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    uploadImage: (formData) => api.post('/auth/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Resume Endpoints
    createResume: (data) => api.post('/resumes', data),

    // Email Resume (PDF)
    sendResume: (formData) => api.post('/email/send-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    getUserResumes: () => api.get('/resumes'),
    getResumeById: (id) => api.get(`/resumes/${id}`),
    updateResume: (id, data) => api.put(`/resumes/${id}`, data),
    deleteResume: (id) => api.delete(`/resumes/${id}`),
    uploadResumeImages: (id, formData) => api.put(`/resumes/${id}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Templates
    getAllTemplates: () => api.get('/templates'),
    getTemplateById: (id) => api.get(`/templates/${id}`),

    // Payments
    createOrder: (amount, currency) => api.post('/payments/create-order', { amount, currency }),
    verifyPayment: (paymentData) => api.post('/payments/verify-payment', paymentData),
    getPaymentHistory: () => api.get('/payments/history'),
};

export default api;
