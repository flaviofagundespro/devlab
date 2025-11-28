import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Mic, Image as ImageIcon, Video, FolderOpen, ArrowRight } from 'lucide-react';
import './index.css';

function Home() {
    return (
        <div className="app-container animate-fade-in">
            <h1>APIBR2 Studio</h1>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
                Sua central de produção de mídia impulsionada por Inteligência Artificial.
                Crie, edite e transforme conteúdo em segundos.
            </p>

            <div className="nav-grid">
                <Link to="/audio-studio" className="nav-item">
                    <div className="glass-card nav-content">
                        <div className="icon-wrapper">
                            <Mic size={32} />
                        </div>
                        <h2>Áudio Studio</h2>
                        <p>Clonagem de voz, text-to-speech e processamento de áudio avançado.</p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: 'var(--primary-color)' }}>
                            Acessar <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </div>
                    </div>
                </Link>

                <Link to="/image-studio" className="nav-item">
                    <div className="glass-card nav-content">
                        <div className="icon-wrapper" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' }}>
                            <ImageIcon size={32} />
                        </div>
                        <h2>Image Studio</h2>
                        <p>Geração de imagens com Stable Diffusion, Flux e edição inteligente.</p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: '#ec4899' }}>
                            Acessar <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </div>
                    </div>
                </Link>

                <Link to="/video-studio" className="nav-item">
                    <div className="glass-card nav-content">
                        <div className="icon-wrapper" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                            <Video size={32} />
                        </div>
                        <h2>Video Studio</h2>
                        <p>Criação de avatares, animação e download de conteúdo (Instagram/YouTube).</p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: '#8b5cf6' }}>
                            Acessar <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </div>
                    </div>
                </Link>

                <Link to="/projects" className="nav-item">
                    <div className="glass-card nav-content">
                        <div className="icon-wrapper" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <FolderOpen size={32} />
                        </div>
                        <h2>Meus Projetos</h2>
                        <p>Gerencie suas criações, histórico de downloads e arquivos gerados.</p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: '#10b981' }}>
                            Acessar <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

function AudioStudio() {
    return (
        <div className="app-container animate-fade-in">
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>← Voltar</Link>
            <div className="glass-card">
                <div className="icon-wrapper">
                    <Mic size={32} />
                </div>
                <h2>Estúdio de Áudio</h2>
                <p>Funcionalidades em desenvolvimento. Em breve você poderá clonar vozes e gerar narrações.</p>
            </div>
        </div>
    );
}

function ImageStudio() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!prompt) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/v1/image/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    model: 'runwayml/stable-diffusion-v1-5', // Modelo padrão otimizado
                    size: '512x512'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Erro ao gerar imagem');
            }

            setResult(data.data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Erro de conexão. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container animate-fade-in">
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>← Voltar</Link>
            <div className="glass-card">
                <div className="icon-wrapper" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' }}>
                    <ImageIcon size={32} />
                </div>
                <h2>Estúdio de Imagem</h2>
                <p>Gere imagens incríveis usando nossos modelos de IA otimizados.</p>

                <div style={{ marginTop: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Prompt</label>
                    <textarea
                        className="glass-card"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        style={{ width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid #334155' }}
                        placeholder="Descreva a imagem que você quer criar..."
                    ></textarea>
                    <button
                        className="btn"
                        onClick={handleGenerate}
                        disabled={loading}
                        style={{ marginTop: '1rem', background: '#ec4899', opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
                    >
                        {loading ? 'Gerando Imagem...' : 'Gerar Imagem'}
                    </button>
                </div>

                {error && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '6px' }}>
                        ❌ {error}
                    </div>
                )}

                {result && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <h3 style={{ color: '#ec4899', marginBottom: '1rem' }}>✨ Imagem Gerada!</h3>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'inline-block' }}>
                            <img
                                src={`data:image/png;base64,${result.image_base64}`}
                                alt="Generated"
                                style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px' }}
                            />
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            Salvo em: {result.local_path}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function VideoStudio() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        if (!url) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Tenta conectar na porta 3000 (Node) que faz proxy para o Python
            const response = await fetch('http://localhost:3000/api/instagram/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.message || 'Erro ao baixar vídeo');
            }

            setResult(data.data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Erro de conexão. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container animate-fade-in">
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>← Voltar</Link>
            <div className="glass-card">
                <div className="icon-wrapper" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                    <Video size={32} />
                </div>
                <h2>Estúdio de Vídeo</h2>
                <p>Baixe vídeos do Instagram e YouTube ou crie conteúdo novo.</p>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>Instagram Downloader</h3>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Cole o link do Instagram aqui..."
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: 'white' }}
                        />
                        <button
                            className="btn"
                            onClick={handleDownload}
                            disabled={loading}
                            style={{ background: '#8b5cf6', opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
                        >
                            {loading ? 'Baixando...' : 'Baixar Vídeo'}
                        </button>
                    </div>

                    {error && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '6px' }}>
                            ❌ {error}
                        </div>
                    )}

                    {result && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '6px' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6ee7b7' }}>✅ Download Concluído!</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#d1fae5' }}>
                                Arquivo salvo em: <strong>{result.filename}</strong><br />
                                Título: {result.title}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Projects() {
    return (
        <div className="app-container animate-fade-in">
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>← Voltar</Link>
            <div className="glass-card">
                <div className="icon-wrapper" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <FolderOpen size={32} />
                </div>
                <h2>Meus Projetos</h2>
                <p>Seus arquivos gerados aparecerão aqui.</p>
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Nenhum projeto encontrado.
                </div>
            </div>
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
