import React, { useState } from 'react';
import { findNearbyStores } from '../services/storeFinder';

export default function StoreLocator() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        setLoading(true);
        setError(null);
        setSearched(false);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const results = await findNearbyStores(latitude, longitude);
                    setStores(results);
                    setSearched(true);
                } catch (err) {
                    setError("Failed to find stores. Please try again later.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError("Unable to retrieve your location. Please allow location access.");
                setLoading(false);
            }
        );
    };

    return (
        <div className="glass-card" style={{ padding: 25, marginTop: 40, borderLeft: '4px solid var(--secondary)' }}>
            <h3 style={{ marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>📍</span> DIY Kit Location Assistant
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
                Find local hardware and craft stores where you can buy materials for this project.
            </p>

            {!searched && !loading && (
                <button
                    onClick={handleSearch}
                    className="btn-primary"
                    style={{ background: 'var(--secondary)', color: 'white', width: '100%' }}
                >
                    🔍 Find Stores Near Me
                </button>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <div className="pulse" style={{ fontSize: 24 }}>🌍</div>
                    <p>Scanning your area...</p>
                </div>
            )}

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: 10, borderRadius: 8, marginTop: 10 }}>
                    {error}
                </div>
            )}

            {searched && stores.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: 15 }}>No relevant stores found nearby. Try checking online retailers!</p>
            )}

            {stores.length > 0 && (
                <div className="animate-fade-in" style={{ marginTop: 20 }}>
                    <h4 style={{ marginBottom: 10 }}>Nearby Stores ({stores.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {stores.map(store => (
                            <div key={store.id} style={{
                                background: 'var(--surface)',
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid var(--glass-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{store.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {store.type} • {store.distance} km away
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}
                                >
                                    Map ↗
                                </a>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSearch}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginTop: 15,
                            fontSize: 12,
                            width: '100%'
                        }}
                    >
                        ↻ Update Location
                    </button>
                </div>
            )}
        </div>
    );
}
