// src/components/ArExperience.jsx
import React, { useState, useRef, useEffect } from 'react';
import { storage, db } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ArExperience.css';

function ArExperience({ avatar, onBack, onViewGallery }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelViewerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      modelViewer.addEventListener('load', () => {
        console.log('Modelo cargado exitosamente');
        setModelLoaded(true);
      });
      
      modelViewer.addEventListener('error', (error) => {
        console.error('Error al cargar el modelo:', error);
        setMessage('Error al cargar el modelo 3D');
      });
    }
  }, []);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('Procesando imagen...');

      console.log('Archivo seleccionado:', file.name, 'Tamaño:', file.size);

      // Convertir el archivo a blob
      const blob = new Blob([file], { type: file.type });

      // Generar nombre único para la imagen
      const timestamp = Date.now();
      const fileName = `museo_${avatar.id}_${timestamp}.jpg`;

      // Subir a Firebase Storage
      setMessage('Subiendo foto a la nube...');
      const storageRef = ref(storage, `photos/${fileName}`);
      await uploadBytes(storageRef, blob);
      
      console.log('Imagen subida a Storage');
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('URL obtenida:', downloadURL);

      // Guardar en Firestore
      setMessage('Guardando en galería...');
      await addDoc(collection(db, 'photos'), {
        avatarId: avatar.id,
        avatarName: avatar.name,
        imageUrl: downloadURL,
        fileName: fileName,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      console.log('Foto guardada exitosamente');

      setMessage('¡Foto guardada exitosamente!');
      setShowSuccessModal(true);
      setIsLoading(false);

      // Limpiar el input
      event.target.value = '';

    } catch (error) {
      console.error('Error al procesar archivo:', error);
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setMessage('');
  };

  return (
    <div className="ar-experience-container">
      <div className="ar-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          ← Volver
        </button>
        <h2>{avatar.name}</h2>
        <button className="btn btn-secondary gallery-btn-header" onClick={onViewGallery}>
          📸 Galería
        </button>
      </div>

      <div className="ar-viewer">
        <model-viewer
          ref={modelViewerRef}
          src={avatar.model}
          alt={avatar.name}
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          touch-action="pan-y"
          autoplay
          shadow-intensity="1"
          environment-image="neutral"
          exposure="1"
          style={{ width: '100%', height: '100%' }}
        >
          <button 
            slot="ar-button" 
            className="ar-button"
          >
            📱 Ver en AR
          </button>
        </model-viewer>
      </div>

      <div className="ar-controls">
        <p className="ar-instructions">
          {modelLoaded 
            ? '✅ 1. Toca "Ver en AR" para ver el avatar en tu espacio\n2. Toma una foto con tu cámara\n3. Sube la foto con el botón de abajo' 
            : '⏳ Cargando modelo 3D...'}
        </p>

        <button 
          className="btn btn-primary upload-btn"
          onClick={triggerFileInput}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Subiendo...' : '📤 Subir Foto con Avatar'}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {message && !showSuccessModal && (
          <p className={`status-message ${message.includes('Error') ? 'error' : ''}`}>
            {message}
          </p>
        )}
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">✅</div>
            <h3>¡Foto Guardada!</h3>
            <p>Tu foto se ha guardado exitosamente en la galería</p>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={onViewGallery}>
                Ver Galería
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArExperience;