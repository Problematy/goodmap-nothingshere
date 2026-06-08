import React, { useEffect, useState } from 'react';

export default function NothingsherePlugin() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const container = document.querySelector('.leaflet-container');
        if (!container) return;

        const check = () => {
            const markers = container.querySelectorAll('.leaflet-marker-icon');
            setShow(markers.length === 0);
        };

        const observer = new MutationObserver(check);
        observer.observe(container, { childList: true, subtree: true });
        check();

        return () => observer.disconnect();
    }, []);

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.72)',
            color: '#fff',
            padding: '0.6rem 1.4rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            zIndex: 1000,
            pointerEvents: 'none',
        }}>
            No points visible in this area.
        </div>
    );
}
