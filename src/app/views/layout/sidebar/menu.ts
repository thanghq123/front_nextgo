import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Danh mục',
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
  ,
  {
    label: 'Bảo hành',
    icon: 'home',
    link: '/warranties/list'
  },
  {
    label: 'Nhóm khách hàng',
    icon: 'home',
    link: '/group_customers/list'
  },
  {
    label: 'Khách hàng',
    icon: 'home',
    link: '/customers/list'
  },
  {
    label: 'Nhóm Nhà Cung Cấp',
    icon: 'home',
    link: '/group_suppliers/list'
  },
  {
    label: 'Nhà Cung Cấp',
    icon: 'home',
    link: '/suppliers/list'
  },
  {
    label: 'Sản phẩm',
    icon: 'mail',
    subItems: [
      {
        label: 'Danh sách sản phẩm',
        link: 'products/list',
      },
       {
        label: 'Bán hàng',
        link: 'shop/tabshop',
      },
    ]},
{    label: 'Chi nhánh',
    icon: 'target',
    link: '/locations/list'
  },
  {
    label: 'Kho & tồn',
    icon: 'target',
    link: '/item-units/list'
  }
];
