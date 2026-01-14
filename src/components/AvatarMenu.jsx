// src/components/AvatarMenu.jsx
import React from 'react';
import './AvatarMenu.css';

function AvatarMenu({ avatars, onAvatarSelect, onViewGallery }) {
  return (
    <div className="avatar-menu-container">
      <div className="avatar-menu-header">
        <h1>Museo y Centro Cultural Rumiñahui</h1>
        <p>Experiencia AR Interactiva</p>
      </div>

      <div className="avatar-menu-content">
        <h2>Selecciona tu Avatar</h2>
        <div className="avatars-grid">
          {avatars.map((avatar) => (
            <div 
              key={avatar.id} 
              className="avatar-card"
              onClick={() => onAvatarSelect(avatar)}
            >
              <div className="avatar-image-container">
                <img 
                  src={avatar.thumbnail} 
                  alt={avatar.name}
                  className="avatar-image"
                />
              </div>
              <div className="avatar-info">
                <h3>{avatar.name}</h3>
                <p>{avatar.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="btn btn-secondary gallery-btn"
          onClick={onViewGallery}
        >
          📸 Ver Galería de Fotos
        </button>
      </div>

      <div className="avatar-menu-footer">
        <p>© 2026 Museo Cultural Rumiñahui</p>
      </div>
    </div>
  );
}

export default AvatarMenu;