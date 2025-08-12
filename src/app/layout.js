// app/layout.js
import "./global.css";

export const metadata = {
  title: "SHIELD Admin",
  description: "Admin panel for SHIELD",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Explicit link tags for better browser compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
