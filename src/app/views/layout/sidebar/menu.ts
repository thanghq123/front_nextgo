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
  },
  {
    label: 'Thương hiệu',
    icon: 'target',
    link: '/brands/list'
  },
  {
    label: 'Đơn vị tính',
    icon: 'target',
    link: '/item-units/list'
  }
];
