const Menu = [{
    title: 'Dashboard',
    icon: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    header: 'Management'
  },
  {
    title: 'Driver',
    group: 'apps',
    icon: 'directions_car',
    name: 'Driver',
    href: '/driver/driver'
  },
  {
    title: 'Child',
    group: 'apps',
    icon: 'face',
    name: 'Child',
    href: '/child/child'
  },
  {
    title: 'Passenger Assistant',
    group: 'apps',
    icon: 'supervised_user_circle',
    name: 'Passenger Assistant',
    href: '/pa/pa'
  },
  {
    header: 'Others'
  },
  {
    title: 'Attendance',
    group: 'Attendance',
    component: 'Attendance',
    icon: 'emoji_people',
    items: [{
        name: 'Driver Attendance',
        title: 'Driver Attendance',
        href: '/attendance/driver'
      },
      {
        name: 'PA Attendance',
        title: 'PA',
        href: '/attendance/pa'
      },


    ]
  },
  {
    title: 'Invoices',
    group: 'Invoices',
    component: 'Invoices',
    icon: 'insert_drive_file',
    items: [{
        name: 'Driver',
        title: 'Driver Invoices',
        href: '/invoice/driver'
      },
      {
        name: 'PA',
        title: 'PA Invoices',
        href: '/invoice/pa'
      },

    ]
  }
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
});

export default Menu;
