const API_URL = 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('fcms_token');
}

function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function apiRequest(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { ...authHeaders(), ...(options.headers || {}) }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// Auth
export const authApi = {
    login: (email) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
    verifyOtp: (email, otp) => apiRequest('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
};

// Projects
export const projectsApi = {
    list: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/projects${qs ? '?' + qs : ''}`);
    },
    get: (id) => apiRequest(`/projects/${id}`),
    create: (data) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Budget
export const budgetApi = {
    overview: () => apiRequest('/budget/overview'),
    project: (id) => apiRequest(`/budget/project/${id}`),
};

// Billing
export const billingApi = {
    list: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/billing${qs ? '?' + qs : ''}`);
    },
};

// Measurement Books
export const mbApi = {
    list: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/mb${qs ? '?' + qs : ''}`);
    },
    get: (id) => apiRequest(`/mb/${id}`),
    create: (data) => apiRequest('/mb', { method: 'POST', body: JSON.stringify(data) }),
};

// Measurements
export const measurementsApi = {
    create: (data) => apiRequest('/measurements', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/measurements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Milestones
export const milestonesApi = {
    list: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiRequest(`/milestones${qs ? '?' + qs : ''}`);
    },
    get: (id) => apiRequest(`/milestones/${id}`),
    create: (data) => apiRequest('/milestones', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/milestones/${id}`, { method: 'DELETE' }),
};

// Users
export const usersApi = {
    me: () => apiRequest('/users/me'),
    list: () => apiRequest('/users'),
};
