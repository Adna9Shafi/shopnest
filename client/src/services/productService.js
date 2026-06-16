import API from './api';

export const productService = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  search: (q) => API.get('/products/search', { params: { q } }),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  getReviews: (id) => API.get(`/products/${id}/reviews`),
  createReview: (id, data) => API.post(`/products/${id}/reviews`, data),
};
