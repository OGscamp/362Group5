import React, { useState } from 'react';

const dummyInCart = [
  { id: 1, title: 'Cozy Apartment', price: 70 },
  { id: 2, title: 'Beach House', price: 120 },
];

export default function CartPage() {
  const [items, setItems] = useState(dummyInCart);
  const remove = id => setItems(items.filter(i => i.id !== id));
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="container">
      <div className="form-container">
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {items.map(i => (
              <li key={i.id} className="cart-item">
                <span>{i.title}</span>
                <span>${i.price}</span>
                <button onClick={() => remove(i.id)} className="btn">Remove</button>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-item" style={{marginTop: '1rem'}}>
          <strong>Total:</strong>
          <strong>${total}</strong>
        </div>
        <a href="/payments" className="btn btn-primary" style={{marginTop: '1rem', display: 'inline-block'}}>Checkout</a>
      </div>
    </div>
  );
}
