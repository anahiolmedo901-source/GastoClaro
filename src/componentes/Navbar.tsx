// src/components/Navbar.tsx
import { Menu } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-3">
        {/* Aquí luego puedes poner avatar, notificaciones, etc. */}
        <span className="text-sm text-gray-500">Junio 2026</span>
      </div>
    </header>
  );
}
