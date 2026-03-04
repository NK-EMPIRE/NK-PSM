"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ============================================
   /vision — Future Builder Interactive Page
   ============================================ */

interface VisionCard {
    icon: string;
    title: string;
    description: string;
    gradient: string;
}

const VISION_CARDS: VisionCard[] = [
    {
        icon: "🚀",
        title: "The Rocket Mindset",
        description: "Like SpaceX breaking orbit, PSM launches past every limit. No ceiling is real when you refuse to look down.",
        gradient: "linear-gradient(135deg, #1a0a2e, #16213e, #0f3460)",
    },
    {
        icon: "🏗️",
        title: "Empire Builder",
        description: "Brick by brick, dream by dream. Empires don't happen overnight — they happen because one person refuses to quit.",
        gradient: "linear-gradient(135deg, #0d1117, #1a1a2e, #2d1b69)",
    },
    {
        icon: "⚡",
        title: "Storm Walker",
        description: "Others run from storms. PSM walks into them. Every storm survived is a crown earned.",
        gradient: "linear-gradient(135deg, #1a0000, #2d0a0a, #4a1010)",
    },
    {
        icon: "🌅",
        title: "The Sunrise Promise",
        description: "Every dark night ends with sunrise. And PSM? He IS the sunrise for everyone around him.",
        gradient: "linear-gradient(135deg, #1a1400, #2a1e00, #453200)",
    },
    {
        icon: "🔥",
        title: "Built Different",
        description: "Not better. Not worse. DIFFERENT. The kind of different that changes the game for everyone.",
        gradient: "linear-gradient(135deg, #1a0505, #300a00, #4a1500)",
    },
    {
        icon: "💎",
        title: "Diamond Hands",
        description: "Pressure makes diamonds. PSM has been under pressure his whole life. Now he shines.",
        gradient: "linear-gradient(135deg, #0a1a2a, #0d2b45, #1a4060)",
    },
];

export default function VisionPage() {
    const [activeCard, setActiveCard] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("card-visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="vision-page" ref={containerRef}>
            {/* Nav */}
            <nav className="page-nav">
                <Link href="/" className="nav-link">← The Ascent</Link>
                <div className="nav-links">
                    <Link href="/empire" className="nav-link">Empire</Link>
                    <Link href="/brotherhood" className="nav-link">Brotherhood</Link>
                    <Link href="/credits" className="nav-link">Credits</Link>
                </div>
            </nav>

            {/* Hero */}
            <header className="vision-hero">
                <div className="vision-hero__tag">THE VISION</div>
                <h1 className="vision-hero__title">
                    <span className="text-gold">Future</span> Builder
                </h1>
                <p className="vision-hero__sub">
                    Every visionary sees what others can&apos;t. PSM doesn&apos;t just see the future — he builds it.
                </p>
            </header>

            {/* Cards Grid */}
            <section className="vision-grid">
                {VISION_CARDS.map((card, i) => (
                    <div
                        key={i}
                        ref={(el) => { cardsRef.current[i] = el; }}
                        className={`vision-card ${activeCard === i ? "vision-card--active" : ""}`}
                        style={{ background: card.gradient }}
                        onMouseEnter={() => setActiveCard(i)}
                        onMouseLeave={() => setActiveCard(null)}
                    >
                        <div className="vision-card__icon">{card.icon}</div>
                        <h3 className="vision-card__title">{card.title}</h3>
                        <p className="vision-card__desc">{card.description}</p>
                        <div className="vision-card__glow" />
                    </div>
                ))}
            </section>

            {/* Quote */}
            <section className="vision-quote">
                <blockquote>
                    &ldquo;The ones who are crazy enough to think they can change the world are the ones who do.&rdquo;
                </blockquote>
                <cite>— Steve Jobs</cite>
            </section>

            {/* Footer */}
            <footer className="page-footer">
                <Link href="/empire" className="footer-cta">
                    Explore the Empire →
                </Link>
            </footer>
        </div>
    );
}
