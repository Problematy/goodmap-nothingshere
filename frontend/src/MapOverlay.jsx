import React, { useEffect, useState } from 'react';

// Shown only if the deployment didn't configure a message for the active language.
const DEFAULT_MESSAGE = 'No points visible in this area.';

// Accessible name for the close button, for the languages this plugin ships catalogues
// for. A deployment can override/extend it with config.closeLabels, same shape as messages.
const DEFAULT_CLOSE_LABELS = { en: 'Close', pl: 'Zamknij' };

// Closing hides the overlay for a while - long enough to explore the area that the popup
// was covering, short enough that the message comes back for a later, unrelated search.
// Tunable per deployment with config.dismissMinutes.
const DEFAULT_DISMISS_MINUTES = 15;

// Holds the epoch-ms deadline the dismissal expires at (not a boolean), so a page reload
// inside the window keeps the overlay hidden while a later one shows it again.
const DISMISSED_UNTIL_KEY = 'nothingshere-dismissed-until';

// setTimeout stores its delay in a signed 32-bit int; anything larger overflows and fires
// straight away, which would defeat a long configured window.
const MAX_TIMEOUT_MS = 2147483647;

function resolveLocalized(byLang, fallback) {
    const lang = globalThis.APP_LANG;
    return byLang[lang] || byLang.en || fallback;
}

// config.messages is keyed by language code, e.g. { pl: "...", en: "..." }. A message
// may contain HTML (e.g. an <a> link to a partner page); the link is part of the message.
function resolveMessage(config) {
    return resolveLocalized((config && config.messages) || {}, DEFAULT_MESSAGE);
}

function resolveCloseLabel(config) {
    const labels = { ...DEFAULT_CLOSE_LABELS, ...((config && config.closeLabels) || {}) };
    return resolveLocalized(labels, DEFAULT_CLOSE_LABELS.en);
}

function resolveDismissMs(config) {
    const minutes = config && config.dismissMinutes;
    const valid = typeof minutes === 'number' && Number.isFinite(minutes) && minutes > 0;
    return (valid ? minutes : DEFAULT_DISMISS_MINUTES) * 60 * 1000;
}

// sessionStorage can throw outright (private mode, site data blocked). The overlay has to
// work there too - the dismissal then only lasts until the page is reloaded.
function readDismissedUntil() {
    try {
        // Number('') is 0 and Number(null) is 0, so a missing or junk value reads as
        // "not dismissed" - including the plain flag written by earlier versions.
        const until = Number(globalThis.sessionStorage.getItem(DISMISSED_UNTIL_KEY));
        return Number.isFinite(until) ? until : 0;
    } catch {
        return 0;
    }
}

function writeDismissedUntil(until) {
    try {
        globalThis.sessionStorage.setItem(DISMISSED_UNTIL_KEY, String(until));
    } catch {
        // Nothing to do - the dismissal still holds for this page view.
    }
}

function clearDismissedUntil() {
    try {
        globalThis.sessionStorage.removeItem(DISMISSED_UNTIL_KEY);
    } catch {
        // Nothing to do - the in-memory state has already been reset.
    }
}

export default function NothingsherePlugin({ config, isMapLoading = false }) {
    const [noMarkers, setNoMarkers] = useState(false);
    const [dismissedUntil, setDismissedUntil] = useState(readDismissedUntil);

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

    // Bring the overlay back when the window runs out, without waiting for a reload.
    useEffect(() => {
        const remaining = dismissedUntil - Date.now();
        if (remaining <= 0 || remaining > MAX_TIMEOUT_MS) return undefined;

        const timer = setTimeout(() => {
            clearDismissedUntil();
            setDismissedUntil(0);
        }, remaining);

        return () => clearTimeout(timer);
    }, [dismissedUntil]);

    // Stay hidden until the map's data has loaded, so we don't flash the message
    // during the initial fetch (or while a lazy-load refetch is in flight).
    if (isMapLoading || !noMarkers || dismissedUntil > Date.now()) return null;

    // Match the page's top header bar: both follow the site's primary_color
    // (falls back to Bootstrap's light surface). Text and links use the accent color.
    const background = globalThis.PRIMARY_COLOR || '#f8f9fa';
    const color = globalThis.SECONDARY_COLOR || 'black';

    const dismiss = () => {
        const until = Date.now() + resolveDismissMs(config);
        writeDismissedUntil(until);
        setDismissedUntil(until);
    };

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
                // Extra top padding keeps the message clear of the close button.
                padding: '2.6rem 1.6rem 1.6rem',
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
            <button
                type="button"
                className="nothingshere-overlay-close"
                aria-label={resolveCloseLabel(config)}
                onClick={dismiss}
                style={{
                    position: 'absolute',
                    top: '0.35rem',
                    right: '0.35rem',
                    width: '2.25rem',
                    height: '2.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    borderRadius: '50%',
                    background: 'transparent',
                    color: 'inherit',
                    // The glyph is decorative; the accessible name comes from aria-label.
                    font: 'inherit',
                    fontSize: '1.5rem',
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                <span aria-hidden="true">&times;</span>
            </button>
            {/* config is authored by the deployment admin (trusted), so HTML is allowed. */}
            <span dangerouslySetInnerHTML={{ __html: resolveMessage(config) }} />
        </div>
    );
}
