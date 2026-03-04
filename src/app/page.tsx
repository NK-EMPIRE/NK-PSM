"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ============================================
   SECTION CONFIGURATION
   Maps scroll ranges to frame sequences
   ============================================ */

interface FrameSection {
    id: string;
    type: "frames";
    scrollStart: number; // 0–1 fraction
    scrollEnd: number;
    folder: string;
    prefix: string;
    totalFrames: number;
    padDigits: number;
}

interface CssSection {
    id: string;
    type: "css";
    scrollStart: number;
    scrollEnd: number;
    bgStyle: string; // CSS background value
}

type Section = FrameSection | CssSection;

const SECTIONS: Section[] = [
    // Section 1 — Countdown / 3D Cake (CSS only)
    {
        id: "countdown",
        type: "css",
        scrollStart: 0.0,
        scrollEnd: 0.08,
        bgStyle: "#0b0b0f",
    },
    // Section 2 — PSM ENTRY Scene 1 (288 frames)
    {
        id: "psm-scene1",
        type: "frames",
        scrollStart: 0.08,
        scrollEnd: 0.28,
        folder: "/PSM ENTRY/SCENE 1/",
        prefix: "ezgif-frame-",
        totalFrames: 288,
        padDigits: 3,
    },
    // Section 3 — PSM ENTRY Scene 2 (288 frames)
    {
        id: "psm-scene2",
        type: "frames",
        scrollStart: 0.28,
        scrollEnd: 0.46,
        folder: "/PSM ENTRY/SCENE 2/",
        prefix: "ezgif-frame-",
        totalFrames: 288,
        padDigits: 3,
    },
    // Section 4 — PSM ENTRY Scene 3 (80 frames)
    {
        id: "psm-scene3",
        type: "frames",
        scrollStart: 0.46,
        scrollEnd: 0.53,
        folder: "/PSM ENTRY/SCENE 3/",
        prefix: "ezgif-frame-",
        totalFrames: 80,
        padDigits: 3,
    },
    // Section 5 — KGF 2 Storm (192 frames)
    {
        id: "kgf-storm",
        type: "frames",
        scrollStart: 0.53,
        scrollEnd: 0.70,
        folder: "/KGF 2/",
        prefix: "ezgif-frame-",
        totalFrames: 192,
        padDigits: 3,
    },
    // Section 6 — Birthday Gold (CSS)
    {
        id: "birthday",
        type: "css",
        scrollStart: 0.70,
        scrollEnd: 0.80,
        bgStyle: "linear-gradient(135deg, #0b0b0f, #1a1400, #2a1e00, #1a1400, #0b0b0f)",
    },
    // Section 7 — ROCKET Starship (192 frames)
    {
        id: "rocket",
        type: "frames",
        scrollStart: 0.80,
        scrollEnd: 0.94,
        folder: "/ROCKET/",
        prefix: "ezgif-frame-",
        totalFrames: 192,
        padDigits: 3,
    },
    // Section 8 — Brotherhood End (CSS)
    {
        id: "brotherhood",
        type: "css",
        scrollStart: 0.94,
        scrollEnd: 1.0,
        bgStyle: "#0b0b0f",
    },
];

/* ============================================
   TEXT OVERLAYS CONFIG
   ============================================ */
interface TextOverlay {
    start: number;
    end: number;
    text: string;
    style: "subtitle" | "hero" | "hero-gold" | "hero-red";
    sub?: string;
}

const TEXT_OVERLAYS: TextOverlay[] = [
    // Countdown prompts
    { start: 0.0, end: 0.02, text: "10", style: "hero", },
    { start: 0.02, end: 0.03, text: "9", style: "hero" },
    { start: 0.03, end: 0.035, text: "8", style: "hero" },
    { start: 0.035, end: 0.04, text: "7", style: "hero" },
    { start: 0.04, end: 0.045, text: "6", style: "hero" },
    { start: 0.045, end: 0.05, text: "5", style: "hero" },
    { start: 0.05, end: 0.055, text: "4", style: "hero" },
    { start: 0.055, end: 0.06, text: "3", style: "hero" },
    { start: 0.06, end: 0.065, text: "2", style: "hero" },
    { start: 0.065, end: 0.07, text: "1", style: "hero" },
    // Cake prompt
    { start: 0.07, end: 0.08, text: "🎂", style: "hero", sub: "Scroll to blow the candles" },
    // PSM Entry
    { start: 0.12, end: 0.22, text: "Every legend begins with a step.", style: "subtitle" },
    // PSM Scene 3 — Name reveal
    { start: 0.48, end: 0.53, text: "PEER SHEIK MYDEEN", style: "hero-red" },
    // KGF Storm
    { start: 0.56, end: 0.62, text: "Storms don't break him.", style: "subtitle" },
    { start: 0.63, end: 0.69, text: "They reveal him.", style: "hero-gold" },
    // Birthday
    { start: 0.71, end: 0.76, text: "HAPPY BIRTHDAY", style: "hero-gold" },
    { start: 0.76, end: 0.80, text: "PEER SHEIK MYDEEN", style: "hero", sub: "The Ascent Continues" },
    // Rocket
    { start: 0.84, end: 0.90, text: "Build the Future.", style: "subtitle", sub: "Like the Ones Who Changed the World." },
    // Brotherhood
    { start: 0.95, end: 0.98, text: "Built Different. Built Together.", style: "hero-gold" },
    { start: 0.98, end: 1.0, text: "Happy Birthday, Brother.", style: "subtitle" },
];

/* ============================================
   Utilities
   ============================================ */
function clamp(v: number, min: number, max: number): number {
    return Math.min(Math.max(v, min), max);
}

function framePath(section: FrameSection, index: number): string {
    const num = String(index + 1).padStart(section.padDigits, "0");
    return `${section.folder}${section.prefix}${num}.jpg`;
}

/* ============================================
   Frame cache — per-section lazy loading
   ============================================ */
interface FrameCache {
    sectionId: string;
    frames: (HTMLImageElement | null)[];
    loaded: number;
    total: number;
    loading: boolean;
}

/* ============================================
   PAGE COMPONENT
   ============================================ */
export default function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cssLayerRef = useRef<HTMLDivElement>(null);
    const cakeSectionRef = useRef<HTMLDivElement>(null);
    const brotherhoodRef = useRef<HTMLDivElement>(null);
    const elonRef = useRef<HTMLImageElement>(null);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);
    const subTextRefs = useRef<(HTMLDivElement | null)[]>([]);
    const powerFillRef = useRef<HTMLDivElement>(null);
    const powerPctRef = useRef<HTMLDivElement>(null);
    const preloaderFillRef = useRef<HTMLDivElement>(null);
    const preloaderPctRef = useRef<HTMLDivElement>(null);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);

    const frameCaches = useRef<Map<string, FrameCache>>(new Map());
    const currentSectionRef = useRef<string>("");
    const rafIdRef = useRef<number>(0);
    const lastDrawnFrame = useRef<{ section: string; index: number }>({ section: "", index: -1 });

    /* ---- Build frame path function ---- */
    const getFrameSection = useCallback((id: string): FrameSection | null => {
        const s = SECTIONS.find((s) => s.id === id);
        return s && s.type === "frames" ? (s as FrameSection) : null;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let viewW = window.innerWidth;
        let viewH = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        /* ---- Resize ---- */
        function resizeCanvas() {
            viewW = window.innerWidth;
            viewH = window.innerHeight;
            canvas!.width = viewW * dpr;
            canvas!.height = viewH * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeCanvas();

        let resizeTimer: ReturnType<typeof setTimeout>;
        function onResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 150);
        }
        window.addEventListener("resize", onResize);

        /* ---- Draw frame to canvas (cover-fit) ---- */
        function drawFrame(img: HTMLImageElement) {
            if (!img.complete || img.naturalWidth === 0) return;
            const imgR = img.naturalWidth / img.naturalHeight;
            const canR = viewW / viewH;
            let dw: number, dh: number, dx: number, dy: number;
            if (imgR > canR) {
                dh = viewH; dw = viewH * imgR;
                dx = (viewW - dw) / 2; dy = 0;
            } else {
                dw = viewW; dh = viewW / imgR;
                dx = 0; dy = (viewH - dh) / 2;
            }
            ctx!.fillStyle = "#0b0b0f";
            ctx!.fillRect(0, 0, viewW, viewH);
            ctx!.drawImage(img, dx, dy, dw, dh);
        }

        /* ---- Load section frames ---- */
        function loadSection(sectionId: string) {
            const sec = getFrameSection(sectionId);
            if (!sec) return;
            if (frameCaches.current.has(sectionId)) return; // already loading/loaded

            const cache: FrameCache = {
                sectionId,
                frames: new Array(sec.totalFrames).fill(null),
                loaded: 0,
                total: sec.totalFrames,
                loading: true,
            };
            frameCaches.current.set(sectionId, cache);

            // Load frames in batches of 4 parallel
            let nextIdx = 0;
            function loadNext() {
                if (nextIdx >= sec!.totalFrames) {
                    cache.loading = false;
                    updatePreloader();
                    return;
                }
                const idx = nextIdx++;
                const img = new Image();
                img.src = framePath(sec!, idx);
                img.onload = () => {
                    cache.frames[idx] = img;
                    cache.loaded++;
                    updatePreloader();
                    loadNext();
                };
                img.onerror = () => {
                    cache.frames[idx] = null;
                    cache.loaded++;
                    updatePreloader();
                    loadNext();
                };
            }
            // Start 4 parallel loaders
            for (let i = 0; i < 4; i++) loadNext();
        }

        /* ---- Preloader progress ---- */
        const totalAllFrames = SECTIONS
            .filter((s) => s.type === "frames")
            .reduce((sum, s) => sum + (s as FrameSection).totalFrames, 0);
        let preloaderDismissed = false;

        function updatePreloader() {
            let totalLoaded = 0;
            frameCaches.current.forEach((c) => { totalLoaded += c.loaded; });
            const pct = Math.round((totalLoaded / totalAllFrames) * 100);
            if (preloaderFillRef.current) preloaderFillRef.current.style.width = `${pct}%`;
            if (preloaderPctRef.current) preloaderPctRef.current.textContent = `${pct}%`;
            // Dismiss preloader when first section is ~60% loaded
            const firstSec = SECTIONS.find(s => s.type === "frames") as FrameSection | undefined;
            const threshold = firstSec ? Math.floor(firstSec.totalFrames * 0.6) : 50;
            if (!preloaderDismissed && totalLoaded >= threshold) {
                preloaderDismissed = true;
                preloaderRef.current?.classList.add("done");
            }
        }

        /* ---- Start loading first 3 sections immediately ---- */
        const frameSectionIds = SECTIONS.filter((s) => s.type === "frames").map((s) => s.id);
        // Load first two immediately
        if (frameSectionIds[0]) loadSection(frameSectionIds[0]);
        if (frameSectionIds[1]) loadSection(frameSectionIds[1]);

        /* ---- Main scroll handler ---- */
        function onScroll() {
            const scrollTop = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) return;
            const fraction = clamp(scrollTop / maxScroll, 0, 1);

            // ---- Determine active section ----
            let activeSection: Section | null = null;
            for (const sec of SECTIONS) {
                if (fraction >= sec.scrollStart && fraction < sec.scrollEnd) {
                    activeSection = sec;
                    break;
                }
            }
            // Handle end edge
            if (!activeSection && fraction >= 1) {
                activeSection = SECTIONS[SECTIONS.length - 1];
            }

            if (!activeSection) return;

            // ---- Preload upcoming sections ----
            const activeIdx = SECTIONS.indexOf(activeSection);
            for (let i = activeIdx; i < Math.min(activeIdx + 3, SECTIONS.length); i++) {
                const s = SECTIONS[i];
                if (s.type === "frames") loadSection(s.id);
            }

            // ---- Handle frame sections ----
            if (activeSection.type === "frames") {
                const sec = activeSection as FrameSection;
                const localProgress = clamp(
                    (fraction - sec.scrollStart) / (sec.scrollEnd - sec.scrollStart),
                    0, 1
                );
                const frameIdx = clamp(
                    Math.floor(localProgress * (sec.totalFrames - 1)),
                    0, sec.totalFrames - 1
                );

                // Show canvas, hide CSS layer
                if (canvas) canvas.style.opacity = "1";
                if (cssLayerRef.current) cssLayerRef.current.style.opacity = "0";
                if (cakeSectionRef.current) cakeSectionRef.current.style.opacity = "0";
                if (brotherhoodRef.current) brotherhoodRef.current.style.opacity = "0";
                if (elonRef.current) elonRef.current.style.opacity = "0";

                // Show Elon image overlay during rocket section
                if (sec.id === "rocket" && localProgress > 0.3 && localProgress < 0.7) {
                    if (elonRef.current) elonRef.current.style.opacity = "1";
                }

                // Draw the frame
                if (lastDrawnFrame.current.section !== sec.id || lastDrawnFrame.current.index !== frameIdx) {
                    lastDrawnFrame.current = { section: sec.id, index: frameIdx };
                    cancelAnimationFrame(rafIdRef.current);
                    rafIdRef.current = requestAnimationFrame(() => {
                        const cache = frameCaches.current.get(sec.id);
                        if (cache) {
                            const img = cache.frames[frameIdx];
                            if (img) drawFrame(img);
                        }
                    });
                }
            }

            // ---- Handle CSS sections ----
            if (activeSection.type === "css") {
                const sec = activeSection as CssSection;
                if (canvas) canvas.style.opacity = "0";

                if (sec.id === "countdown") {
                    if (cssLayerRef.current) cssLayerRef.current.style.opacity = "0";
                    if (cakeSectionRef.current) cakeSectionRef.current.style.opacity = "1";
                    if (brotherhoodRef.current) brotherhoodRef.current.style.opacity = "0";
                    if (elonRef.current) elonRef.current.style.opacity = "0";
                } else if (sec.id === "birthday") {
                    if (cssLayerRef.current) {
                        cssLayerRef.current.style.opacity = "1";
                        cssLayerRef.current.style.background = sec.bgStyle;
                    }
                    if (cakeSectionRef.current) cakeSectionRef.current.style.opacity = "0";
                    if (brotherhoodRef.current) brotherhoodRef.current.style.opacity = "0";
                    if (elonRef.current) elonRef.current.style.opacity = "0";
                } else if (sec.id === "brotherhood") {
                    if (cssLayerRef.current) cssLayerRef.current.style.opacity = "0";
                    if (cakeSectionRef.current) cakeSectionRef.current.style.opacity = "0";
                    if (brotherhoodRef.current) brotherhoodRef.current.style.opacity = "1";
                    if (elonRef.current) elonRef.current.style.opacity = "0";

                    // Fade to black at very end
                    const localP = clamp(
                        (fraction - sec.scrollStart) / (sec.scrollEnd - sec.scrollStart),
                        0, 1
                    );
                    if (fadeRef.current) {
                        fadeRef.current.style.opacity = String(localP > 0.7 ? (localP - 0.7) / 0.3 : 0);
                    }
                }
            }

            // ---- Update text overlays (direct DOM) ----
            textRefs.current.forEach((el, i) => {
                if (!el) return;
                const t = TEXT_OVERLAYS[i];
                const visible = fraction >= t.start && fraction <= t.end;
                if (visible) el.classList.add("visible");
                else el.classList.remove("visible");
            });
            subTextRefs.current.forEach((el, i) => {
                if (!el) return;
                const t = TEXT_OVERLAYS[i];
                const visible = fraction >= t.start && fraction <= t.end;
                if (visible) el.classList.add("visible");
                else el.classList.remove("visible");
            });

            // ---- Power HUD ----
            const pct = Math.round(fraction * 100);
            if (powerFillRef.current) powerFillRef.current.style.height = `${pct}%`;
            if (powerPctRef.current) powerPctRef.current.textContent = `${pct}%`;

            // Dismiss preloader on first scroll if not yet dismissed
            if (!preloaderDismissed && fraction > 0.01) {
                preloaderDismissed = true;
                preloaderRef.current?.classList.add("done");
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // Auto-dismiss preloader after 5 seconds regardless
        const preloaderTimeout = setTimeout(() => {
            if (!preloaderDismissed) {
                preloaderDismissed = true;
                preloaderRef.current?.classList.add("done");
            }
        }, 5000);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(rafIdRef.current);
            clearTimeout(resizeTimer);
            clearTimeout(preloaderTimeout);
        };
    }, [getFrameSection]);

    /* ---- Build CSS class for each text overlay ---- */
    function textClass(style: string): string {
        switch (style) {
            case "hero": return "scroll-text text-hero text-red-glow";
            case "hero-gold": return "scroll-text text-hero text-gold";
            case "hero-red": return "scroll-text text-hero text-red-glow";
            case "subtitle": return "scroll-text text-subtitle";
            default: return "scroll-text text-subtitle";
        }
    }

    /* ---- Cursor glow ---- */
    const cursorRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    /* ---- Easter egg: triple scroll-up ---- */
    const easterEggRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let scrollUps = 0;
        let lastY = window.scrollY;
        let timer: ReturnType<typeof setTimeout>;
        const onScroll = () => {
            const y = window.scrollY;
            if (y < lastY && lastY - y > 100) {
                scrollUps++;
                clearTimeout(timer);
                timer = setTimeout(() => { scrollUps = 0; }, 1500);
                if (scrollUps >= 3) {
                    easterEggRef.current?.classList.add("easter-egg--visible");
                    setTimeout(() => {
                        easterEggRef.current?.classList.remove("easter-egg--visible");
                    }, 4000);
                    scrollUps = 0;
                }
            }
            lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
    }, []);

    /* ---- Gold particles for birthday section ---- */
    const goldCanvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = goldCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; }
        const particles: Particle[] = [];
        let animId = 0;

        function spawnGold() {
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: Math.random() * canvas!.width,
                    y: canvas!.height + 10,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -(1 + Math.random() * 3),
                    size: 1 + Math.random() * 3,
                    alpha: 0.5 + Math.random() * 0.5,
                    life: 100 + Math.random() * 100,
                });
            }
        }

        function animateParticles() {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
            spawnGold();
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                p.alpha *= 0.995;
                if (p.life <= 0 || p.alpha < 0.01) { particles.splice(i, 1); continue; }
                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx!.fillStyle = `hsla(43, 85%, 60%, ${p.alpha})`;
                ctx!.fill();
            }
            animId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <>
            {/* ---- Cursor Glow ---- */}
            <div className="cursor-glow" ref={cursorRef} />

            {/* ---- Easter Egg ---- */}
            <div className="easter-egg" ref={easterEggRef}>
                <div className="easter-egg__text text-gold">🎯 You Found It!</div>
                <div className="easter-egg__sub">PSM&apos;s secret: Never stop scrolling up. Always defy gravity.</div>
            </div>

            {/* ---- Preloader ---- */}
            <div className="preloader" ref={preloaderRef}>
                <div className="preloader__title">The Ascent</div>
                <div className="preloader__bar">
                    <div className="preloader__fill" ref={preloaderFillRef} />
                </div>
                <div className="preloader__pct" ref={preloaderPctRef}>0%</div>
            </div>

            {/* ---- Scroll driver (height = scroll distance) ---- */}
            <div className="scroll-page" style={{ height: "3500vh" }}>
                {/* Fixed viewport */}
                <div className="fixed-viewport">
                    {/* Canvas for frame sections */}
                    <canvas
                        ref={canvasRef}
                        style={{ transition: "opacity 0.3s ease" }}
                    />

                    {/* CSS background layer (birthday gold etc.) */}
                    <div
                        ref={cssLayerRef}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            opacity: 0,
                            transition: "opacity 0.4s ease",
                        }}
                    />

                    {/* 3D Cake Section */}
                    <div
                        ref={cakeSectionRef}
                        className="cake-section"
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#0b0b0f",
                            transition: "opacity 0.4s ease",
                        }}
                    >
                        <div className="cake-3d">
                            <div className="cake-layer cake-layer--bottom" />
                            <div className="cake-layer cake-layer--middle" />
                            <div className="cake-layer cake-layer--top" />
                            <div className="cake-frosting" />
                            <div className="candles-row">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="candle">
                                        <div className="candle-flame" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Brotherhood Section */}
                    <div
                        ref={brotherhoodRef}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            opacity: 0,
                            transition: "opacity 0.4s ease",
                            overflow: "hidden",
                        }}
                    >
                        {/* Sunrise gradient */}
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "60%",
                            background: "linear-gradient(180deg, transparent 0%, #1a0a00 40%, #2a1500 70%, #3d2000 100%)",
                            zIndex: 1,
                        }} />
                        {/* Silhouettes */}
                        <div style={{
                            position: "absolute",
                            bottom: "12%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "60px",
                            zIndex: 2,
                        }}>
                            {[0, 1].map((i) => (
                                <div key={i} style={{
                                    width: "50px",
                                    height: "140px",
                                    background: "#000",
                                    borderRadius: "25px 25px 0 0",
                                    position: "relative",
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: "-28px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "50%",
                                        background: "#000",
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Elon Musk overlay during Rocket section */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        ref={elonRef}
                        src="/ROCKET/ELON.png"
                        alt=""
                        style={{
                            position: "absolute",
                            right: "5%",
                            bottom: "10%",
                            width: "clamp(150px, 20vw, 300px)",
                            zIndex: 6,
                            opacity: 0,
                            transition: "opacity 0.6s ease",
                            filter: "drop-shadow(0 0 30px rgba(0,0,0,0.8))",
                            pointerEvents: "none",
                        }}
                    />

                    {/* Film overlays */}
                    <div className="vignette" />
                    <div className="grain" />

                    {/* Fade to black (brotherhood end) */}
                    <div
                        ref={fadeRef}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "#000",
                            zIndex: 50,
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            pointerEvents: "none",
                        }}
                    />

                    {/* Text overlay container */}
                    <div className="text-overlay">
                        {TEXT_OVERLAYS.map((t, i) => (
                            <div key={i} style={{ position: "absolute", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                                <div
                                    ref={(el) => { textRefs.current[i] = el; }}
                                    className={textClass(t.style)}
                                >
                                    {t.text}
                                </div>
                                {t.sub && (
                                    <div
                                        ref={(el) => { subTextRefs.current[i] = el; }}
                                        className="scroll-text text-subtitle"
                                        style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.3rem)", marginTop: "0.5rem", opacity: 0 }}
                                    >
                                        {t.sub}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Power Level HUD */}
            <div className="power-hud">
                <div className="power-hud__pct" ref={powerPctRef}>0%</div>
                <div className="power-hud__track">
                    <div className="power-hud__fill" ref={powerFillRef} />
                </div>
                <div className="power-hud__label">Power</div>
            </div>

            {/* Navigation Pill */}
            <nav className="main-nav">
                <Link href="/vision">Vision</Link>
                <Link href="/empire">Empire</Link>
                <Link href="/brotherhood">Brotherhood</Link>
                <Link href="/credits">Credits</Link>
            </nav>
        </>
    );
}
