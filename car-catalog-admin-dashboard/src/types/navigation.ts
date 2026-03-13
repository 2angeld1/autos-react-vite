import React from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  allowedRoles?: string[];
  children?: NavItem[];
}

export interface NavSection {
  titleKey?: string;
  title_fixed?: string;
  items: NavItem[];
  allowedRoles?: string[];
}
