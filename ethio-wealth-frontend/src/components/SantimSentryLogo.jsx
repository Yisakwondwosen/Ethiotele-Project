import React from 'react';

/**
 * SantimSentryLogo — inline SVG logo component.
 *
 * Props:
 *  variant  — "full" (icon + wordmark) | "icon" (icon only) | "wordmark" (text only)
 *  height   — number, controls rendered height in px (default: 36)
 *  color    — fill color for the glyph (default: "white")
 */
export default function SantimSentryLogo({ variant = 'full', height = 36, color = 'white' }) {
    const iconAspect = 1;       // 1:1 square for icon
    const fullAspect = 2.9;     // wider for full logo

    if (variant === 'icon') {
        const w = height * iconAspect;
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 80 80"
                width={w}
                height={height}
                fill="none"
                role="img"
                aria-label="Santim Sentry Icon"
            >
                <g fill={color}>
                    {/* Left curly brace */}
                    <path d="M12 8C5 8 2 12 2 18L2 30C2 35 0 37 0 40C0 43 2 45 2 50L2 62C2 68 5 72 12 72L17 72L17 66C12 66 10 64 10 59L10 47C10 42 8 40 8 40C8 40 10 38 10 33L10 21C10 16 12 14 17 14L17 8Z" />
                    {/* Right curly brace */}
                    <path d="M68 8L68 14C73 14 75 16 75 21L75 33C75 38 77 40 77 40C77 40 75 42 75 47L75 59C75 64 73 66 68 66L68 72L73 72C80 72 82 68 82 62L82 50C82 45 84 43 84 40C84 37 82 35 82 30L82 18C82 12 80 8 73 8Z" />
                    {/* S letterform */}
                    <path d="M42 20C32 20 27 25 27 32C27 38 31 41 38 43L47 45.5C51 46.5 53 48.5 53 52C53 56 50 59 42 59C34 59 31 56 31 52L24 52C24 59 30 65 42 65C54 65 60 59 60 52C60 45.5 56 42 49 40L40 37.5C36 36.5 34 34.5 34 31C34 27 37 24 42 24C47 24 50 27 50 31L57 31C57 24 51 20 42 20Z" />
                </g>
            </svg>
        );
    }

    if (variant === 'wordmark') {
        return (
            <span
                style={{
                    fontFamily: '"Outfit", "Inter", sans-serif',
                    fontWeight: 800,
                    fontSize: `${height}px`,
                    color,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                }}
                aria-label="Santim Sentry"
            >
                SANTIM{' '}
                <span style={{ fontWeight: 400 }}>SENTRY</span>
            </span>
        );
    }

    // "full" — icon + wordmark side by side
    const iconSize = height;
    return (
        <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: `${Math.round(height * 0.35)}px` }}
            role="img"
            aria-label="Santim Sentry"
        >
            <SantimSentryLogo variant="icon" height={iconSize} color={color} />
            <span
                style={{
                    fontFamily: '"Outfit", "Inter", sans-serif',
                    fontSize: `${Math.round(height * 0.55)}px`,
                    color,
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                }}
            >
                <span style={{ fontWeight: 800 }}>SANTIM</span>{' '}
                <span style={{ fontWeight: 400 }}>SENTRY</span>
            </span>
        </div>
    );
}
