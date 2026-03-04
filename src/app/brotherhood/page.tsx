"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ============================================
   /brotherhood — Personal Message Page
   ============================================ */

const MESSAGES = [
    "To the one who never lets anyone walk alone.",
    "You are the definition of loyalty.",
    "When the world turns cold, you bring the warmth.",
    "Every challenge you face, you face with a smile.",
    "You don't just lift yourself — you lift everyone around you.",
    "The world doesn't know yet what you're about to become.",
    "But we do. Your brothers do.",
    "Happy Birthday, Peer Sheik Mydeen.",
    "Here's to another year of building the impossible.",
];

export default function BrotherhoodPage() {
    const [visibleCount, setVisibleCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        // Reveal messages one by one
        MESSAGES.forEach((_, i) => {
            const t = setTimeout(() => {
                setVisibleCount((prev) => prev + 1);
            }, 800 + i * 1200);
            timeoutsRef.current.push(t);
        });

        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        // Auto-scroll to latest message
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [visibleCount]);

    return (
        <div className="brotherhood-page">
            {/* Nav */}
            <nav className="page-nav">
                <Link href="/" className="nav-link">← The Ascent</Link>
                <div className="nav-links">
                    <Link href="/vision" className="nav-link">Vision</Link>
                    <Link href="/empire" className="nav-link">Empire</Link>
                    <Link href="/credits" className="nav-link">Credits</Link>
                </div>
            </nav>

            {/* Header */}
            <header className="brotherhood-header">
                <div className="brotherhood-header__tag">A MESSAGE</div>
                <h1 className="brotherhood-header__title">
                    From <span className="text-gold">Brother</span> to Brother
                </h1>
            </header>

            {/* Messages */}
            <div className="brotherhood-messages" ref={containerRef}>
                {MESSAGES.map((msg, i) => (
                    <div
                        key={i}
                        className={`brotherhood-msg ${i < visibleCount ? "brotherhood-msg--visible" : ""}`}
                        style={{ transitionDelay: `${i * 0.05}s` }}
                    >
                        <div className="brotherhood-msg__line" />
                        <p className="brotherhood-msg__text">{msg}</p>
                    </div>
                ))}
            </div>

            {/* Final CTA */}
            {visibleCount >= MESSAGES.length && (
                <div className="brotherhood-final">
                    <div className="brotherhood-final__emoji">🤝</div>
                    <p className="brotherhood-final__text">
                        Built Different. Built Together. Forever.
                    </p>
                    <Link href="/credits" className="footer-cta">
                        Watch the Credits →
                    </Link>
                </div>
            )}
        </div>
    );
}
