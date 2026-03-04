import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PEER SHEIK MYDEEN – THE ASCENT",
    description:
        "A cinematic scroll-driven birthday tribute. An interactive film experience.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
