import API from './api';

export const orderService = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/myorders'),
  getById: (id) => API.get(`/orders/${id}`),
  pay: (id, data) => API.put(`/orders/${id}/pay`, data),
  getAll: () => API.get('/orders'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, status),
  getPaypalConfig: () => API.get('/config/paypal'),
};
