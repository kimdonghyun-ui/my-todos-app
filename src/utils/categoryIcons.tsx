import {
  Utensils,
  Coffee,
  ShoppingBag,
  Bus,
  Home,
  Smartphone,
  Heart,
  Shirt,
  Gamepad2,
  GraduationCap,
  Wallet,
  Building2,
  Briefcase,
  Gift,
  PiggyBank,
  BadgeDollarSign,
  CreditCard,
  LucideIcon,
} from 'lucide-react';

type CategoryIconMap = {
  [key: string]: LucideIcon;
};

export const categoryIcons: CategoryIconMap = {
  // 지출 카테고리
  '식비': Utensils,
  '카페/간식': Coffee,
  '쇼핑': ShoppingBag,
  '교통': Bus,
  '주거/통신': Home,
  '문화/여가': Smartphone,
  '의료/건강': Heart,
  '의류/미용': Shirt,
  '게임': Gamepad2,
  '교육': GraduationCap,
  
  // 수입 카테고리
  '급여': Wallet,
  '월세': Building2,
  '알바': Briefcase,
  '용돈': Gift,
  '저축': PiggyBank,
  '투자': BadgeDollarSign,
  '기타': CreditCard,
};

export const getIconByCategory = (category: string) => {
  return categoryIcons[category] || CreditCard;
}; 