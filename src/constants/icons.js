import {
  Activity,
  Apple,
  Award,
  Bed,
  Bike,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  Camera,
  ChefHat,
  Code2,
  Coffee,
  Dog,
  DollarSign,
  Droplets,
  Dumbbell,
  Fish,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Home,
  Languages,
  Leaf,
  Moon,
  Mountain,
  Music,
  Palette,
  Pencil,
  Pill,
  Plane,
  Salad,
  ShoppingCart,
  Smile,
  Snowflake,
  Star,
  Sun,
  Target,
  Telescope,
  Timer,
  TreePine,
  Trophy,
  Tv,
  Users,
  Waves,
  Wind,
  Zap,
} from 'lucide-react-native';

export const ICON_MAP = {
  Activity,
  Apple,
  Award,
  Bed,
  Bike,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  Camera,
  ChefHat,
  Code2,
  Coffee,
  Dog,
  DollarSign,
  Droplets,
  Dumbbell,
  Fish,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Home,
  Languages,
  Leaf,
  Moon,
  Mountain,
  Music,
  Palette,
  Pencil,
  Pill,
  Plane,
  Salad,
  ShoppingCart,
  Smile,
  Snowflake,
  Star,
  Sun,
  Target,
  Telescope,
  Timer,
  TreePine,
  Trophy,
  Tv,
  Users,
  Waves,
  Wind,
  Zap,
};

export const PALETTE = [
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#EAB308',
  '#84CC16',
  '#22C55E',
  '#10B981',
  '#14B8A6',
  '#06B6D4',
  '#0EA5E9',
  '#64748B',
  '#111827',
];

export const getHabitIconAndColor = habit => {
  if (!habit) return { habitColor: PALETTE[0], HabitIcon: Target };

  const bgIndex = habit.id ? Math.abs(habit.id) % PALETTE.length : 0;
  const habitColor = habit.color || PALETTE[bgIndex];

  let HabitIcon = ICON_MAP[habit.icon];
  if (!HabitIcon) {
    const titleLower = (habit.title || '').toLowerCase();
    const catLower = (
      habit.category_name ||
      habit.category ||
      ''
    ).toLowerCase();

    if (
      titleLower.includes('read') ||
      titleLower.includes('book') ||
      catLower.includes('read')
    ) {
      HabitIcon = BookOpen;
    } else if (
      titleLower.includes('water') ||
      titleLower.includes('health') ||
      titleLower.includes('drink')
    ) {
      HabitIcon = Heart;
    } else if (
      titleLower.includes('run') ||
      titleLower.includes('walk') ||
      titleLower.includes('gym') ||
      titleLower.includes('workout') ||
      titleLower.includes('fit')
    ) {
      HabitIcon = Dumbbell;
    } else if (
      titleLower.includes('meditat') ||
      titleLower.includes('mind') ||
      titleLower.includes('sleep')
    ) {
      HabitIcon = Smile;
    } else if (titleLower.includes('coffee') || titleLower.includes('tea')) {
      HabitIcon = Coffee;
    } else if (
      titleLower.includes('code') ||
      titleLower.includes('work') ||
      titleLower.includes('learn')
    ) {
      HabitIcon = Zap;
    } else {
      HabitIcon = Target;
    }
  }

  return { habitColor, HabitIcon };
};
