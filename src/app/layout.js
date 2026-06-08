import './globals.css';

export const metadata = {
  title: 'Grit — Christian Habit Tracker',
  description: 'Discipline for the glory of God. A habit tracker for Reformed Baptist Christians.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">{children}</body>
    </html>
  );
}
