export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home',
  },
  {
    text: 'Examples',
    icon: 'folder',
    items: [
      {
        text: 'Profile',
        path: '/profile',
        // icon: 'user',
      },
      {
        text: 'Tasks',
        path: '/tasks',
        // icon: 'check',
      },
    ],
  },
  {
    text: 'CdsOptions',
    path: '/cds/cds-option',
    icon: 'preferences',
  },
  {
    text: 'Quick Monitor',
    icon: 'preferences',
    items: [
      {
        text: 'Currency',
        path: '/quick-monitor/currency',
        // icon: 'user',
      },
      {
        text: 'Rates',
        path: '/quick-monitor/rates',
        // icon: 'check',
      },
      {
        text: 'Index',
        path: '/quick-monitor/index',
        // icon: 'check',
      },
      {
        text: 'Commodity',
        path: '/quick-monitor/commodity',
        // icon: 'check',
      }
    ],
  },
];
