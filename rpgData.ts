import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: string;
  iconName?: string;
  className?: string;
  size?: number;
}

export const IconHelper: React.FC<IconProps> = ({ name, iconName, className = 'w-5 h-5', size = 20, ...props }) => {
  const iconKey = name || iconName || 'Sparkles';
  const LucideIcon = (Icons as Record<string, any>)[iconKey] || Icons.Sparkles;
  return <LucideIcon className={className} size={size} {...props} />;
};
