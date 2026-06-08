'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/',           label: 'Disciplines', icon: '✝️' },
  { href: '/statistics', label: 'Growth',      icon: '🌿' },
  { href: '/scripture',  label: 'Scripture',   icon: '📜' },
  { href: '/settings',   label: 'Settings',    icon: '🔧' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex bg-surface border-t border-border z-50">
      {TABS.map(tab => {
        const active = path === tab.href;
        return (
          <Link key={tab.href} href={tab.href}
            className={`flex-1 flex flex-col items-center py-3 pb-6 gap-1 transition-colors
              ${active ? 'text-primary' : 'text-faint'}`}>
            <span className="text-xl">{tab.icon}</span>
            <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-primary' : 'text-faint'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
