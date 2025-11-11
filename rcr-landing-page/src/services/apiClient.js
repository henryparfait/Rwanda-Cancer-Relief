const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  try {
    return localStorage.getItem('rcr_token');
  } catch (error) {
    return null;
  }
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

const parseJSON = async (response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }
};

const request = async (path, {
  method = 'GET',
  body,
  headers = {},
  params,
  withAuth = true,
  baseUrl = DEFAULT_BASE_URL
} = {}) => {
  const token = withAuth ? getAuthToken() : null;
  const queryString = buildQueryString(params);
  const url = `${baseUrl}${path}${queryString}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await parseJSON(response);

  if (!response.ok || data?.success === false) {
    const errorMessage = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data?.data ?? data;
};

const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  request
};

export default apiClient;

