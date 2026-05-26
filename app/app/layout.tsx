import "./globals.css"; import type { Metadata } from "next";

export const metadata: Metadata = { title: "CoCreate", description: "Discover. Match. CoCreate." };

export default function RootLayout({ children }: { children: React.ReactNode }) { return (

{children}
); }
