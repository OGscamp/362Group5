import axios from 'axios';

const supportService = {
  async createTicket(ticketData) {
    const response = await axios.post('/api/support', ticketData);
    return response.data;
  },

  async getTickets() {
    const response = await axios.get('/api/support');
    return response.data;
  },

  async getTicketById(id) {
    const response = await axios.get(`/api/support/${id}`);
    return response.data;
  }
};

export default supportService; 