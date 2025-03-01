import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./ui/final.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Website Courses to Die",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi">
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-[#01002A] antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
