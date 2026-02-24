import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { useNavigate } from 'react-router-dom';

export default function WasteScanner() {
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [model, setModel] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();
    const imageRef = useRef();
    const fileInputRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        loadModel();
        return () => stopCamera();
    }, []);

    const loadModel = async () => {
        try {
            console.log("Loading MobileNet model...");
            const loadedModel = await mobilenet.load();
            setModel(loadedModel);
            setIsModelLoading(false);
            console.log("Model loaded successfully!");
        } catch (error) {
            console.error("Failed to load model:", error);
            setIsModelLoading(false);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            // First activate the camera UI state so the <video> element is rendered
            setCameraActive(true);
            setImageURL(null);
            setResults([]);

            // Wait a brief moment for React to mount the <video> tag, then attach the stream
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 50);
        } catch (err) {
            console.error("Camera Error:", err);
            alert("Could not access camera. Please check permissions or use Upload.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setCameraActive(false);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageURL(dataUrl);
        stopCamera();

        // Auto identify after capture - give React a moment to render the <img> tag
        setTimeout(() => identify(), 200);
    };

    const handleUpload = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            const url = URL.createObjectURL(files[0]);
            setImageURL(url);
            setResults([]);
            stopCamera();
        }
    };

    const identify = async () => {
        if (!model || !imageRef.current) return;
        setLoading(true);
        try {
            const imgElement = imageRef.current;
            // Wait for image to load if it's new
            if (!imgElement.complete) {
                await new Promise((resolve) => {
                    imgElement.onload = resolve;
                    imgElement.onerror = resolve; // Continue anyway to avoid hang
                });
            }
            const predictions = await model.classify(imgElement);
            setResults(predictions);
        } catch (error) {
            console.error("Identification error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getMaterialType = (className) => {
        const name = className.toLowerCase();
        if (name.includes('bottle') || name.includes('plastic') || name.includes('container') || name.includes('water bottle')) return 'Plastic';
        if (name.includes('cardboard') || name.includes('box') || name.includes('carton') || name.includes('paper') || name.includes('packet')) return 'Cardboard';
        if (name.includes('metal') || name.includes('can') || name.includes('tin') || name.includes('aluminum') || name.includes('foil')) return 'Metal';
        if (name.includes('straw') || name.includes('pipe')) return 'Straw';
        if (name.includes('cup') || name.includes('mug') || name.includes('beaker')) return 'Cup';
        return null;
    };

    const detectedMaterial = results.length > 0 ? getMaterialType(results[0].className) : null;

    const handleFindProjects = () => {
        if (detectedMaterial) {
            navigate(`/projects?search=${detectedMaterial}`);
        }
    };

    if (isModelLoading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 20 }}>🧠</div>
                <h2>Initializing AI Material Scanner...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Powering up TensorFlow.js & MobileNet</p>
                <div className="animate-pulse" style={{ marginTop: 20, color: 'var(--primary)' }}>Loading Neural Network...</div>
            </div>
        );
    }

    return (
        <div className="container animate-fade" style={{ maxWidth: 800 }}>
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 10, background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    📸 AI Project Scanner
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: 30, fontSize: '1.1rem' }}>
                    Scan your waste materials to find matching STEM projects instantly!
                </p>

                <div style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    background: '#000',
                    borderRadius: 20,
                    overflow: 'hidden',
                    marginBottom: 30,
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
                }}>
                    {cameraActive && (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '70%', height: '60%',
                                border: '2px dashed rgba(255,255,255,0.5)',
                                borderRadius: 10,
                                pointerEvents: 'none'
                            }}>
                                <div style={{ position: 'absolute', top: -30, width: '100%', color: 'white', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>Scan Area</div>
                            </div>
                        </>
                    )}

                    {imageURL && !cameraActive && (
                        <img
                            src={imageURL}
                            alt="Captured"
                            ref={imageRef}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    )}

                    {!cameraActive && !imageURL && (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                            <div style={{ fontSize: 60 }}>📷</div>
                            <p style={{ color: 'var(--text-muted)' }}>Camera is currently off</p>
                        </div>
                    )}

                    {loading && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 15 }}>
                            <div className="animate-spin" style={{ fontSize: 40 }}>🔬</div>
                            <div style={{ fontWeight: 600 }}>Analyzing Material...</div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 30 }}>
                    {!cameraActive ? (
                        <button onClick={startCamera} className="btn-primary" style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            🎥 Start Camera
                        </button>
                    ) : (
                        <button onClick={capturePhoto} className="btn-primary" style={{ padding: '12px 25px', background: 'var(--accent)', color: 'black', display: 'flex', alignItems: 'center', gap: 10 }}>
                            📸 Capture & Analyze
                        </button>
                    )}

                    <button onClick={() => fileInputRef.current.click()} className="btn-primary" style={{ padding: '12px 25px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
                        📁 Upload
                    </button>

                    {cameraActive && (
                        <button onClick={stopCamera} className="btn-primary" style={{ padding: '12px 25px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444' }}>
                            ✖ Stop
                        </button>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {results.length > 0 && (
                    <div className="animate-fade" style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: 30, borderRadius: 20, border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Top Match Found</h3>
                                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{results[0].className.split(',')[0]}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                                <div style={{ fontSize: 28, fontWeight: 800 }}>{(results[0].probability * 100).toFixed(1)}%</div>
                            </div>
                        </div>

                        {detectedMaterial ? (
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 25, borderRadius: 15, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                                    <div style={{ fontSize: 32 }}>🌿</div>
                                    <div>
                                        <h4 style={{ margin: 0, color: '#10b981', fontSize: 18 }}>Material Verified: {detectedMaterial}</h4>
                                        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>Confirmed by Edubuild Smart Logic</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleFindProjects}
                                    className="btn-primary"
                                    style={{ width: '100%', background: '#10b981', padding: 15, fontSize: 16, fontWeight: 700 }}
                                >
                                    🚀 See Projects for {detectedMaterial}
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 25, borderRadius: 15, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                <h4 style={{ color: '#ef4444', marginBottom: 10 }}>⚠️ Category Not Recognized</h4>
                                <p style={{ fontSize: 14 }}>We identified this as "{results[0].className.split(',')[0]}", but we don't have specific DIY projects for this category yet. Try scanning a plastic bottle or cardboard!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
