// src/components/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import AdminLogin from './AdminLogin';
import './Gallery.css';

function Gallery({ onBack }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const photosQuery = query(
        collection(db, 'photos'),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(photosQuery);
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(photosData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar fotos:', error);
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photo) => {
    if (!isAdmin) {
      alert('Necesitas permisos de administrador para eliminar fotos');
      setShowAdminLogin(true);
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar esta foto?')) {
      return;
    }

    try {
      setIsDeleting(true);

      // Eliminar de Storage
      const storageRef = ref(storage, `photos/${photo.fileName}`);
      await deleteObject(storageRef);

      // Eliminar de Firestore
      await deleteDoc(doc(db, 'photos', photo.id));

      // Actualizar estado local
      setPhotos(photos.filter(p => p.id !== photo.id));
      setSelectedPhoto(null);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error al eliminar foto:', error);
      alert('Error al eliminar la foto');
      setIsDeleting(false);
    }
  };

  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = photo.fileName || 'foto_museo.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    alert('✅ Sesión de administrador iniciada');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    alert('Sesión de administrador cerrada');
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Volver al Menú
        </button>
        <h2>Galería de Fotos</h2>
        <div className="gallery-header-actions">
          <button className="btn btn-secondary" onClick={loadPhotos}>
            🔄 Actualizar
          </button>
          {!isAdmin ? (
            <button 
              className="btn btn-secondary admin-btn" 
              onClick={() => setShowAdminLogin(true)}
            >
              🔐 Admin
            </button>
          ) : (
            <button 
              className="btn btn-danger admin-btn" 
              onClick={handleAdminLogout}
            >
              🚪 Salir
            </button>
          )}
        </div>
      </div>

      <div className="gallery-content">
        {isLoading ? (
          <div className="loading">
            <p>Cargando fotos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="empty-gallery">
            <p>📸</p>
            <h3>No hay fotos todavía</h3>
            <p>Captura tu primera foto con un avatar</p>
          </div>
        ) : (
          <div className="photos-grid">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="photo-card"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.imageUrl} alt={photo.avatarName} />
                <div className="photo-info">
                  <span className="avatar-name">{photo.avatarName}</span>
                  <span className="photo-date">
                    {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString('es-ES') : 'Fecha desconocida'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de foto seleccionada */}
      {selectedPhoto && (
        <div className="photo-modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setSelectedPhoto(null)}
            >
              ✕
            </button>
            
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.avatarName} />
            
            <div className="photo-modal-info">
              <h3>{selectedPhoto.avatarName}</h3>
              <p>{selectedPhoto.createdAt ? new Date(selectedPhoto.createdAt).toLocaleString('es-ES') : 'Fecha desconocida'}</p>
            </div>

            <div className="photo-modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleDownload(selectedPhoto)}
              >
                📥 Descargar
              </button>
              {isAdmin && (
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeletePhoto(selectedPhoto)}
                  disabled={isDeleting}
                >
                  {isDeleting ? '⏳ Eliminando...' : '🗑️ Eliminar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de login admin */}
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

export default Gallery;