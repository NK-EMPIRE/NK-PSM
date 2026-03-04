"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ============================================
   /empire — Interactive Dream Slider
   ============================================ */

interface Dream {
    year: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

const DREAMS: Dream[] = [
    {
        year: "2020",
        title: "The Spark",
        description: "Every empire begins with a single spark of ambition. PSM lit his fire early — and it hasn't stopped burning since.",
        icon: "🔥",
        color: "hsl(15, 85%, 50%)",
    },
    {
        year: "2021",
        title: "The Grind",
        description: "While others slept, PSM studied. While others partied, PSM planned. The grind doesn't care about your feelings — it rewards consistency.",
        icon: "⚙️",
        color: "hsl(220, 70%, 55%)",
    },
    {
        year: "2022",
        title: "The Breakthrough",
        description: "Every wall has a crack. PSM found his — and broke through. Not with force, but with relentless patience and unshakeable belief.",
        icon: "💥",
        color: "hsl(45, 90%, 50%)",
    },
    {
        year: "2023",
        title: "The Rise",
        description: "From the ashes of doubt emerged a phoenix. PSM didn't just rise — he soared. And the world started to notice.",
        icon: "🦅",
        color: "hsl(280, 70%, 55%)",
    },
    {
        year: "2024",
        title: "The Empire",
        description: "Brick by brick, the empire takes shape. Not built on sand, but on the bedrock of vision, grit, and brotherhood.",
        icon: "🏰",
        color: "hsl(43, 85%, 55%)",
    },
    {
        year: "2025",
        title: "The Legacy",
        description: "Empires are measured not by what they take, but by what they give. PSM's legacy is being written — in gold.",
        icon: "👑",
        color: "hsl(43, 100%, 60%)",
    },
];

export default function EmpirePage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goTo = (idx: number) => {
        if (isTransitioning || idx === activeIndex) return;
        setIsTransitioning(true);
        setActiveIndex(idx);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const next = () => goTo((activeIndex + 1) % DREAMS.length);
    const prev = () => goTo((activeIndex - 1 + DREAMS.length) % DREAMS.length);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, isTransitioning]);

    const dream = DREAMS[activeIndex];

    return (
        <div className="empire-page">
            {/* Nav */}
            <nav className="page-nav">
                <Link href="/" className="nav-link">← The Ascent</Link>
                <div className="nav-links">
                    <Link href="/vision" className="nav-link">Vision</Link>
                    <Link href="/brotherhood" className="nav-link">Brotherhood</Link>
                    <Link href="/credits" className="nav-link">Credits</Link>
                </div>
            </nav>

            {/* Timeline header */}
            <div className="empire-timeline">
                {DREAMS.map((d, i) => (
                    <button
                        key={i}
                        className={`empire-timeline__dot ${i === activeIndex ? "active" : ""} ${i < activeIndex ? "past" : ""}`}
                        onClick={() => goTo(i)}
                        style={{ "--dot-color": d.color } as React.CSSProperties}
                    >
                        <span className="empire-timeline__year">{d.year}</span>
                    </button>
                ))}
                <div className="empire-timeline__line" />
                <div
                    className="empire-timeline__progress"
                    style={{ width: `${(activeIndex / (DREAMS.length - 1)) * 100}%` }}
                />
            </div>

            {/* Dream Card */}
            <div className="empire-slider" ref={sliderRef}>
                <button className="empire-arrow empire-arrow--left" onClick={prev}>‹</button>

                <div className={`empire-card ${isTransitioning ? "empire-card--exit" : "empire-card--enter"}`}>
                    <div className="empire-card__icon" style={{ color: dream.color }}>
                        {dream.icon}
                    </div>
                    <div className="empire-card__year" style={{ color: dream.color }}>
                        {dream.year}
                    </div>
                    <h2 className="empire-card__title">{dream.title}</h2>
                    <p className="empire-card__desc">{dream.description}</p>
                    <div
                        className="empire-card__accent"
                        style={{ background: `linear-gradient(90deg, transparent, ${dream.color}, transparent)` }}
                    />
                </div>

                <button className="empire-arrow empire-arrow--right" onClick={next}>›</button>
            </div>

            {/* Progress indicator */}
            <div className="empire-progress">
                {activeIndex + 1} / {DREAMS.length}
            </div>

            {/* Footer */}
            <footer className="page-footer">
                <Link href="/brotherhood" className="footer-cta">
                    To Brotherhood →
                </Link>
            </footer>
        </div>
    );
}
