import { motion } from 'framer-motion';

const quotes = [
  "You are safe. You are grounded. You are here.",
  "Breath by breath, you are reclaiming your peace.",
  "The world can wait. This moment is for you.",
  "Your mind is a sanctuary. Protect its borders.",
  "Quiet the noise, find the signal."
];

export const Greeting = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-2 mb-12"
    >
      <h2 className="text-walnut/60 font-medium tracking-[0.2em] uppercase text-xs">
        {timeGreeting}
      </h2>
      <p className="text-walnut font-serif text-2xl px-4 italic leading-relaxed">
        "{quote}"
      </p>
    </motion.div>
  );
};
