import {
  ArrowRightLeft,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Compass,
  Landmark,
  Route,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  compass: Compass,
  "book-open": BookOpen,
  "briefcase-business": BriefcaseBusiness,
  "building-2": Building2,
  "users-round": UsersRound,
  landmark: Landmark,
  route: Route,
  "arrow-right-left": ArrowRightLeft,
};

export function CategoryIcon({ name }: { name: string }) {
  const Icon = icons[name] ?? Compass;
  return <Icon aria-hidden="true" />;
}
