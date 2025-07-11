import { Inter as FontSans } from "next/font/google";

// Google Fonts
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans", // CSS variable for the sans-serif font
});
