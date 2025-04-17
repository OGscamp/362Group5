import React, { useState } from 'react';

export default function PaymentsPage() {
  const [card, setCard] = useState('');
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = e => {
    e.preventDefault();
    console.log('pay', { name, card, exp, cvc });
  };

  return (
    <div className="form-container">
      <h2>Payment Details</h2>
      <form onSubmit={handlePay}>
        <input type="text" required placeholder="Name on Card" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" required placeholder="Card Number" value={card} onChange={e => setCard(e.target.value)} />
        <input type="text" required placeholder="MM/YY" value={exp} onChange={e => setExp(e.target.value)} />
        <input type="text" required placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value)} />
        <button type="submit" className="btn btn-primary">Pay Now</button>
      </form>
    </div>
  );
}