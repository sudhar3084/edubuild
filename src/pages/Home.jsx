import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { translate } = useLanguage();

    return (
        <div className="container animate-fade" style={{ textAlign: 'center', marginTop: 100 }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 20 }}>
                {translate('home.heroTitle') || <>Reimagine <span style={{ color: 'var(--primary)' }}>STEM</span> Education</>}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 40px' }}>
                {translate('home.heroSubtitle')}
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                <Link to="/signup" className="btn-primary" style={{ padding: '16px 40px', fontSize: 18 }}>{translate('nav.getStarted')}</Link>
                <Link to="/signin" className="btn-primary" style={{ padding: '16px 40px', fontSize: 18, background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>{translate('nav.login')}</Link>
            </div>

            <div className="grid-auto" style={{ marginTop: 80 }}>
                <div className="glass-card" style={{ padding: 30 }}>
                    <h3>₹ {translate('home.lowCost')}</h3>
                    <p>{translate('home.lowCostDesc')}</p>
                </div>
                <div className="glass-card" style={{ padding: 30 }}>
                    <h3>📱 {translate('home.offline')}</h3>
                    <p>{translate('home.offlineDesc')}</p>
                </div>
                <div className="glass-card" style={{ padding: 30 }}>
                    <h3>🇮🇳 {translate('home.regional')}</h3>
                    <p>{translate('home.regionalDesc')}</p>
                </div>
            </div>
        </div>
    );
}
