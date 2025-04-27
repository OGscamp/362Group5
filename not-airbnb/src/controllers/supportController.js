import SupportTicket from '../models/SupportTicket.js';

const supportController = {
  async createTicket(req, res) {
    try {
      const { subject, message } = req.body;
      const userId = req.user.id;

      const ticket = new SupportTicket({
        userId,
        subject,
        message,
        status: 'open'
      });

      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Error creating support ticket', error: error.message });
    }
  },

  async getTickets(req, res) {
    try {
      const userId = req.user.id;
      const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching support tickets', error: error.message });
    }
  },

  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const ticket = await SupportTicket.findOne({ _id: id, userId });
      if (!ticket) {
        return res.status(404).json({ message: 'Support ticket not found' });
      }

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching support ticket', error: error.message });
    }
  }
};

export default supportController; 