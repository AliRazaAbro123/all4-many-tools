import React from 'react';
import * as Icons from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-expect-error dynamic access to lucide icons
  const IconComponent = Icons[name] || Icons.Wrench;
  return <IconComponent className={className} size={size} />;
};
