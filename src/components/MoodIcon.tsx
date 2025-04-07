import { LucideIcon } from 'lucide-react';
import { MoodEmoji } from '@/types/mood';
import { motion } from 'framer-motion';

const iconMap: Record<MoodEmoji, LucideIcon> = {
  laugh: require('lucide-react').Laugh,
  smile: require('lucide-react').Smile,
  meh: require('lucide-react').Meh,
  frown: require('lucide-react').Frown,
  angry: require('lucide-react').Angry,
};

const colorMap: Record<MoodEmoji, { light: string; dark: string }> = {
  laugh: { light: 'text-yellow-500', dark: 'text-yellow-400' },
  smile: { light: 'text-green-500', dark: 'text-green-400' },
  meh: { light: 'text-blue-500', dark: 'text-blue-400' },
  frown: { light: 'text-purple-500', dark: 'text-purple-400' },
  angry: { light: 'text-red-500', dark: 'text-red-400' },
};

interface MoodIconProps {
  emoji: MoodEmoji;
  size?: number;
  className?: string;
  isSelected?: boolean;
}

export function MoodIcon({ emoji, size = 24, className = '', isSelected = false }: MoodIconProps) {
  const Icon = iconMap[emoji];
  const colors = colorMap[emoji];
  const colorClass = isSelected ? `${colors.light} dark:${colors.dark}` : 'text-gray-400 dark:text-gray-500';
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${colorClass} ${className} transition-colors duration-200`}
    >
      <Icon size={size} />
    </motion.div>
  );
}
