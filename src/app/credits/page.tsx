"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ============================================
   /credits — Hidden Cinematic Ending
   ============================================ */

interface CreditLine {
    role: string;
    name: string;
}

const CREDITS: CreditLine[] = [
    { role: "THE LEGEND", name: "Peer Sheik Mydeen" },
    { role: "DIRECTED BY", name: "Brotherhood" },
    { role: "PRODUCED BY", name: "Loyalty & Trust" },
    { role: "CINEMATOGRAPHY", name: "Every Memory Together" },
    { role: "SOUNDTRACK", name: "Years of Laughter" },
    { role: "WRITTEN BY", name: "The Heart" },
    { role: "SPECIAL EFFECTS", name: "Pure Dedication" },
    { role: "COSTUME DESIGN", name: "Confidence & Style" },
    { role: "INSPIRED BY", name: "KGF, Rocky, Iron Man" },
    { role: "EXECUTIVE PRODUCER", name: "God's Plan" },
];

const DEDICATION = "This experience was built with love, code, and brotherhood.\nHappy Birthday, PSM. 🎂";

export default function CreditsPage() {
    const [scrollY, setScrollY] = useState(0);
    const [showDedication, setShowDedication] = useState(false);
    const creditsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            if (!creditsRef.current) return;
            const rect = creditsRef.current.getBoundingClientRect();
            const progress = Math.max(0, -rect.top) / (rect.height - window.innerHeight);
            setScrollY(Math.min(1, progress));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        // Show dedication after 12 seconds
        const t = setTimeout(() => setShowDedication(true), 12000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="credits-page">
            {/* Nav */}
            <nav className="page-nav">
                <Link href="/" className="nav-link">← The Ascent</Link>
                <div className="nav-links">
                    <Link href="/vision" className="nav-link">Vision</Link>
                    <Link href="/empire" className="nav-link">Empire</Link>
                    <Link href="/brotherhood" className="nav-link">Brotherhood</Link>
                </div>
            </nav>

            {/* Stars background */}
            <div className="credits-stars">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div
                        key={i}
                        className="credits-star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                        }}
                    />
                ))}
            </div>

            {/* Auto-scroll credits */}
            <div className="credits-roll" ref={creditsRef} style={{ height: "400vh" }}>
                <div className="credits-roll__inner" style={{ transform: `translateY(${100 - scrollY * 200}vh)` }}>
                    <div className="credits-title-card">
                        <div className="credits-title-card__tag">A CINEMATIC EXPERIENCE</div>
                        <h1 className="credits-title-card__name text-gold">
                            PEER SHEIK MYDEEN
                        </h1>
                        <div className="credits-title-card__sub">THE ASCENT</div>
                    </div>

                    {CREDITS.map((c, i) => (
                        <div key={i} className="credit-line" style={{ animationDelay: `${i * 0.3}s` }}>
                            <div className="credit-line__role">{c.role}</div>
                            <div className="credit-line__name">{c.name}</div>
                        </div>
                    ))}

                    <div className="credits-spacer" />

                    {showDedication && (
                        <div className="credits-dedication">
                            {DEDICATION.split("\n").map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Replay CTA */}
            <div className="credits-replay" style={{ opacity: scrollY > 0.8 ? 1 : 0 }}>
                <Link href="/" className="footer-cta">
                    ↻ Experience Again
                </Link>
            </div>
        </div>
    );
}
