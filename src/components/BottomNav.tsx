import { Home, Book, Gamepad2, Wind, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dash', icon: Home, label: 'Dash' },
  { to: '/log', icon: Book, label: 'Log' },
  { to: '/play', icon: Gamepad2, label: 'Play' },
  { to: '/breathe', icon: Wind, label: 'Breathe' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`
          }
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
