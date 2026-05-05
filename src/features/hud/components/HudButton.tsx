import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface HudButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  delay?: number;
}

export const HudButton = ({ icon: Icon, label, description, onClick, variant = 'primary', delay = 0 }: HudButtonProps) => {
  const variants = {
    primary: "bg-walnut text-parchment hover:bg-walnut-light",
    secondary: "bg-sage/20 text-walnut border border-sage/30 hover:bg-sage/30",
    accent: "bg-terracotta/20 text-walnut border border-terracotta/30 hover:bg-terracotta/30"
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center p-5 rounded-2xl transition-all duration-300 shadow-sm ${variants[variant]}`}
    >
      <div className={`p-3 rounded-xl mr-4 ${variant === 'primary' ? 'bg-parchment/10' : 'bg-white/50'}`}>
        <Icon size={24} />
      </div>
      <div className="text-left">
        <h3 className="font-serif text-lg leading-none mb-1">{label}</h3>
        <p className="text-xs opacity-70 leading-tight">{description}</p>
      </div>
    </motion.button>
  );
};
