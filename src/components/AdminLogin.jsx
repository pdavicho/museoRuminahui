// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLoginSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Contraseña del administrador (puedes cambiarla)
  const ADMIN_PASSWORD = 'museo2026';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
      onClose();
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-close-btn" onClick={onClose}>✕</button>
        
        <h3>🔐 Acceso Administrador</h3>
        <p>Ingresa la contraseña para acceder a funciones de administrador</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="admin-password-input"
            autoFocus
          />
          
          {error && <p className="admin-error">{error}</p>}
          
          <div className="admin-buttons">
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;