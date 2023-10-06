import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Categories',
    icon: 'home',
    link: '/categories/list'
  }
];
