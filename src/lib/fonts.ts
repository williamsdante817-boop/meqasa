import { Inter as FontSans } from "next/font/google";

// Google Fonts
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["system-ui", "arial"],
  display: "swap",
});
