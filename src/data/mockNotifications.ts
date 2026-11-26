import { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order Out for Delivery',
    message: 'Your order #AURA-2026-89241 containing iPhone 16 Pro Max is out for delivery with Ramesh Sharma.',
    date: '10 minutes ago',
    type: 'shipping',
    read: false,
    link: 'orders',
  },
  {
    id: 'notif-2',
    title: 'Price Drop Alert',
    message: 'Sony WH-1000XM5 from your Wishlist just dropped by 17% to ₹28,990! Limited festival inventory.',
    date: '2 hours ago',
    type: 'price_drop',
    read: false,
    link: 'wishlist',
  },
  {
    id: 'notif-3',
    title: 'Exclusive Member Privilege',
    message: 'Coupon code FESTIVAL50 unlocked for your account. Enjoy up to ₹7,500 instant savings on flagship electronics.',
    date: 'Yesterday',
    type: 'offer',
    read: true,
    link: 'offers',
  },
  {
    id: 'notif-4',
    title: 'Back in Stock Alert',
    message: 'Herman Miller Aeron Chair in Graphite Mesh is back in stock at the Mumbai regional atelier.',
    date: '2 days ago',
    type: 'stock',
    read: true,
    link: 'products',
  },
  {
    id: 'notif-5',
    title: 'Warranty Card Generated',
    message: 'Official warranty certificate for Tissot PRX Horology #HM-TIS-7719 is now available for download.',
    date: '4 days ago',
    type: 'order',
    read: true,
    link: 'orders',
  },
];
