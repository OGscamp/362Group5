import React from 'react';

const dummyListings = [
  { id: 1, title: 'Cozy Apartment', price: 70},
  { id: 2, title: 'Beach House', price: 120},
  { id: 3, title: 'Mountain Cabin', price: 90},
];

export default function ListingsPage() {
  return (
    <div className="grid grid-3">
      {dummyListings.map(l => (
        <div key={l.id} className="card">
          <div className="card-body">
            <h3>{l.title}</h3>
            <p>${l.price}/night</p>
            <button className="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
}