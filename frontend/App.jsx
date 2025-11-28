import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo ao Estúdio de Produção de Mídia com IA</h1>
      <nav className="space-x-4">
        <Link to="/audio-studio" className="text-blue-500 hover:underline">Estúdio de Áudio</Link>
        <Link to="/image-studio" className="text-blue-500 hover:underline">Estúdio de Imagem</Link>
        <Link to="/video-studio" className="text-blue-500 hover:underline">Estúdio de Vídeo</Link>
        <Link to="/projects" className="text-blue-500 hover:underline">Meus Projetos</Link>
      </nav>
    </div>
  );
}

function AudioStudio() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-4">Estúdio de Áudio</h2>
      <p>Funcionalidades de clonagem e geração de voz.</p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">Voltar para Home</Link>
    </div>
  );
}

function ImageStudio() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-4">Estúdio de Imagem</h2>
      <p>Funcionalidades de geração, edição e upscale de imagens.</p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">Voltar para Home</Link>
    </div>
  );
}

function VideoStudio() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-4">Estúdio de Vídeo</h2>
      <p>Funcionalidades de criação de avatares e animação de vídeos.</p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">Voltar para Home</Link>
    </div>
  );
}

function Projects() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-4">Meus Projetos</h2>
      <p>Histórico de gerações e gerenciamento de projetos.</p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">Voltar para Home</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audio-studio" element={<AudioStudio />} />
        <Route path="/image-studio" element={<ImageStudio />} />
        <Route path="/video-studio" element={<VideoStudio />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;


