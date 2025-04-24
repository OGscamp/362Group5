export interface Payment {
	userId: string;
	amount: number;
	method: string; // e.g. 'card', 'paypal'
	timestamp: string; // ISO string or Date
	status: string; // e.g. 'completed', 'pending'

	cardNumber: string;
	cardHolder: string;
	expiryDate: string;
	cvv: string;
  }
  