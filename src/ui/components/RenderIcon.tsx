import * as Icons from "lucide-react";

export function renderIcon(iconName: string, style?: string) {
  const IconComponent = (Icons as any)[
    iconName.charAt(0).toUpperCase() +
    iconName.slice(1).replace(/-([a-z])/g, (_, char) => char.toUpperCase())
  ];
  return IconComponent ? <IconComponent className={style} /> : null;
}