// src/App.jsx
import React, { useState } from 'react';
import AvatarMenu from './components/AvatarMenu';
import ArExperience from './components/ArExperience';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'ar', 'gallery'

  // Configuración de los 7 avatares del Museo
  const avatars = [
    {
      id: 'chagra',
      name: 'Chagra',
      model: '/Chagra.glb',
      thumbnail: '/Chagra.png',
      description: 'Personaje tradicional de la sierra ecuatoriana'
    },
    {
      id: 'choclito',
      name: 'Choclito',
      model: '/Choclito.glb',
      thumbnail: '/Choclito.png',
      description: 'Representando la agricultura y el maíz'
    },
    {
      id: 'juanzangolqui',
      name: 'Juan Zangolqui',
      model: '/JuanZangolqui.glb',
      thumbnail: '/JuanZangolqui.png',
      description: 'Personaje histórico ecuatoriano'
    },
    {
      id: 'pingullero',
      name: 'Pingullero',
      model: '/Pingullero.glb',
      thumbnail: '/Pingullero.png',
      description: 'Músico tradicional ecuatoriano'
    },
    {
      id: 'rosamontufar',
      name: 'Rosa Montufar',
      model: '/RosaMontufar.glb',
      thumbnail: '/RosaMontufar.png',
      description: 'Personaje histórico ecuatoriano'
    },
    {
      id: 'ruco',
      name: 'Ruco',
      model: '/Ruco.glb',
      thumbnail: '/Ruco.png',
      description: 'Sabio ancestral ecuatoriano'
    },
    {
      id: 'simonbolivar',
      name: 'Simón Bolívar',
      model: '/SimonBolivar.glb',
      thumbnail: '/SimonBolivar.png',
      description: 'El Libertador de América'
    }
  ];

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setCurrentView('ar');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedAvatar(null);
  };

  const handleViewGallery = () => {
    setCurrentView('gallery');
  };

  return (
    <div className="App">
      {currentView === 'menu' && (
        <AvatarMenu 
          avatars={avatars}
          onAvatarSelect={handleAvatarSelect}
          onViewGallery={handleViewGallery}
        />
      )}

      {currentView === 'ar' && selectedAvatar && (
        <ArExperience 
          avatar={selectedAvatar}
          onBack={handleBackToMenu}
          onViewGallery={handleViewGallery}
        />
      )}

      {currentView === 'gallery' && (
        <Gallery onBack={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;