import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function AiLab() {
    const { translate, language } = useLanguage();
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState("");
    const [material, setMaterial] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, loading]);

    // LEVEL 1: Decision-Based Rule System (Hackathon Optimized)
    const ruleEngine = (cls, mat) => {
        const c = cls.toLowerCase();
        const m = mat.toLowerCase();
        if (c.includes('6') && m.includes('plastic')) return { title: "DIY Rain Gauge", description: "Measure rainfall using a waste plastic bottle.", id: "1" };
        if (c.includes('7') && m.includes('bottle')) return { title: "Water Turbine", description: "Generate mechanical energy from water flow using a bottle and spoons.", id: "2" };
        if (c.includes('8') && m.includes('cardboard')) return { title: "Pin Hole Camera", description: "Understand optics by making a simple camera with a box.", id: "3" };
        if (c.includes('9') && m.includes('battery')) return { title: "Simple Electromagnet", description: "Create a magnet using electricity and a copper wire.", id: "4" };
        if (c.includes('10') && (m.includes('glass') || m.includes('mirror'))) return { title: "Light Spectrum Experiment", description: "Split white light into colors using a prism or water glass.", id: "5" };
        return null;
    };

    const handleGetRecommendation = () => {
        if (!selectedClass || !material) return;
        const match = ruleEngine(selectedClass, material);
        if (match) {
            setRecommendation({ ...match, type: 'rule' });
            // Add to chat as a special system message
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                text: `✨ I found a perfect project for you!\n\n**${match.title}**\n${match.description}\n\nYou can find this in our library.`,
                isSpecial: true
            }]);
        } else {
            setRecommendation({ type: 'gemini', message: translate('ailab.noRuleMatch') });
            handleChat(`I am in Class ${selectedClass} and I have ${material}. What can I build?`);
        }
    };

    const handleChat = async (inputOverride = null) => {
        const input = inputOverride || chatInput;
        if (!input.trim()) return;

        setLoading(true);
        const userMsg = { role: 'user', text: input };
        setChatHistory(prev => [...prev, userMsg]);
        if (!inputOverride) setChatInput("");

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: chatHistory,
                    language: language === 'hi' ? 'hindi' : language === 'tel' ? 'telugu' : 'english'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Server Error");
            }

            const aiMsg = { role: 'assistant', text: data.reply };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', text: `⚠️ AI Teacher: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade" style={{ maxWidth: 1200, height: 'calc(100vh - 120px)', margin: '0 auto', display: 'flex', gap: 30, paddingBottom: 20 }}>

            {/* Left Sidebar: Tools & Setup */}
            <div style={{ width: 350, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="glass-card" style={{ padding: 25, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ fontSize: 24 }}>⚙️</div>
                        <h3 style={{ margin: 0 }}>Project Tools</h3>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>YOUR CLASS</label>
                        <select
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            style={{ width: '100%', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }}
                        >
                            <option value="">Select...</option>
                            {[6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>MATERIALS YOU HAVE</label>
                        <input
                            type="text"
                            placeholder="e.g. plastic bottle"
                            value={material}
                            onChange={e => setMaterial(e.target.value)}
                            style={{ width: '100%', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }}
                        />
                    </div>

                    <button
                        onClick={handleGetRecommendation}
                        disabled={!selectedClass || !material}
                        className="btn-primary"
                        style={{ width: '100%', background: 'linear-gradient(45deg, var(--primary), #a855f7)', color: 'black', fontWeight: 700 }}
                    >
                        🪄 Find Magic Project
                    </button>
                </div>

                <div className="glass-card" style={{ padding: 25, flex: 1, overflowY: 'auto' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Suggested Topics</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            "How to build a volcano?",
                            "Explain gravity simply",
                            "Simple solar project",
                            "Science fair ideas"
                        ].map((t, i) => (
                            <button key={i} onClick={() => handleChat(t)} style={{ textAlign: 'left', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}
                                onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                                onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.03)'}
                            >
                                💡 {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area (Gemini Style) */}
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                {/* Header */}
                <div style={{ padding: '20px 30px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg, #4285f4, #9b72cb, #d96570, #f4af11)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            ✦
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 18 }}>EDUBUILD AI</div>
                            <div style={{ fontSize: 12, color: '#10b981' }}>● Smart Assistant Active</div>
                        </div>
                    </div>
                    <button onClick={() => setChatHistory([])} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>Clear Chat</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: 25 }}>
                    {chatHistory.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '10%', opacity: 0.8 }}>
                            <h2 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>STEM Assistant</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: 18 }}>I'm your AI STEM Teacher. How can I help you discover science today?</p>
                        </div>
                    )}

                    {chatHistory.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: 15,
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: msg.role === 'user' ? 'var(--primary)' : 'var(--surface)',
                                border: msg.role === 'assistant' ? '1px solid var(--primary)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                fontSize: 14, color: 'white'
                            }}>
                                {msg.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <div style={{
                                maxWidth: '75%',
                                padding: msg.isSpecial ? '20px' : '12px 20px',
                                borderRadius: 18,
                                background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: msg.isSpecial ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                color: 'white',
                                fontSize: 15,
                                lineHeight: 1.6,
                                whiteSpace: 'pre-line',
                                boxShadow: msg.role === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.1)' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                            <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Teacher is preparing a lesson...</div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px 30px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 30,
                        padding: '8px 20px',
                        border: '1px solid var(--glass-border)',
                        transition: 'border-color 0.3s'
                    }}
                        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    >
                        <input
                            type="text"
                            placeholder="Type a message or use the tools on the left..."
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleChat()}
                            style={{ flex: 1, padding: '12px 0', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: 15 }}
                        />
                        <button
                            onClick={() => handleChat()}
                            disabled={loading || !chatInput.trim()}
                            style={{
                                background: chatInput.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                width: 40, height: 40,
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: chatInput.trim() ? 'pointer' : 'default',
                                color: 'black',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: 20 }}>➔</span>
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <small style={{ color: 'var(--text-muted)', fontSize: 10 }}>Gemini Assistant may provide incorrect info. Always verify scientific facts.</small>
                    </div>
                </div>
            </div>

        </div>
    );
}
