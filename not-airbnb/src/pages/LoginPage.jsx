import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log('login', email, pass);
  };

  return (
    <div className="form-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button className="btn btn-primary">Log In</button>
        <button className="btn register">Register</button>
      </form>
    </div>
  );
}