import React, { useEffect, useState } from 'react';

// Shown only if the deployment didn't configure a message for the active language.
const DEFAULT_MESSAGE = 'No points visible in this area.';

// config.messages is keyed by language code, e.g. { pl: "...", en: "..." }. A message
// may contain HTML (e.g. an <a> link to a partner page); the link is part of the message.
function resolveMessage(config) {
    const messages = (config && config.messages) || {};
    const lang = globalThis.APP_LANG;
    return messages[lang] || messages.en || DEFAULT_MESSAGE;
}

export default function NothingsherePlugin({ config, isMapLoading = false }) {
    const [noMarkers, setNoMarkers] = useState(false);

    useEffect(() => {
        const container = document.querySelector('.leaflet-container');
        if (!container) return undefined;

        const check = () => {
            // Exclude the "your location" marker (goodmap's own Marker, icon className
            // "location-icon") - it's always present once geolocation is granted and
            // isn't a data point, so counting it would mask a genuinely empty view.
            const markers = container.querySelectorAll('.leaflet-marker-icon:not(.location-icon)');
            setNoMarkers(markers.length === 0);
        };

        const observer = new MutationObserver(check);
        observer.observe(container, { childList: true, subtree: true });
        check();

        return () => observer.disconnect();
    }, []);

    // Stay hidden until the map's data has loaded, so we don't flash the message
    // during the initial fetch (or while a lazy-load refetch is in flight).
    if (isMapLoading || !noMarkers) return null;

    // Match the page's top header bar: both follow the site's primary_color
    // (falls back to Bootstrap's light surface). Text and links use the accent color.
    const background = globalThis.PRIMARY_COLOR || '#f8f9fa';
    const color = globalThis.SECONDARY_COLOR || 'black';

    return (
        <div
            className="nothingshere-overlay"
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // Square: width drives a 1:1 box; content is centered inside.
                width: 'min(18rem, 80vw)',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background,
                color,
                padding: '1.6rem',
                borderRadius: '0.5rem',
                fontSize: '1.1rem',
                lineHeight: 1.4,
                boxShadow: '0 2px 14px rgba(0, 0, 0, 0.25)',
                zIndex: 1000,
                // 'auto' (not 'none') so an embedded link in the message stays clickable.
                pointerEvents: 'auto',
            }}
        >
            {/* Links adopt the message text color instead of the browser default blue. */}
            <style>{`.nothingshere-overlay a { color: inherit; }`}</style>
            {/* config is authored by the deployment admin (trusted), so HTML is allowed. */}
            <span dangerouslySetInnerHTML={{ __html: resolveMessage(config) }} />
        </div>
    );
}
