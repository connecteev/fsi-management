const getFileMenu = [{
    icon: 'photo',
    title: 'Images',
    to: {
      path: '/media',
      query: {
        type: 'image'
      }
    }
  },
  {
    icon: 'videocam',
    title: 'Video',
    to: {
      path: '/media',
      query: {
        type: 'video'
      }
    }
  },
  {
    icon: 'volume_down',
    title: 'Audio',
    to: {
      path: '/media',
      query: {
        type: 'audio'
      }
    }
  },
  {
    icon: 'insert_drive_file',
    title: 'Document',
    to: {
      path: '/media',
      query: {
        type: 'doc'
      }
    }
  },

];
const Items = [{
    'uuid': 'a32c4aec-54de-4ff4-b165-8571ae805598',
    'fileName': '.DS_Store',
    'fileType': false,
    'path': '/static/.DS_Store',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/.DS_Store',
    'ext': '',
    'dir': 'static',
    'ctime': '2018-04-08T09:15:19.307Z',
    'size': 12292
  },
  {
    'uuid': 'a30f71db-7dcf-4467-978f-e32841d47825',
    'fileName': '.gitkeep',
    'fileType': false,
    'path': '/static/.gitkeep',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/.gitkeep',
    'ext': '',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.010Z',
    'size': 0
  },
  {
    'uuid': '78a63d97-c763-4fa4-883f-8f9ed4425a6a',
    'fileName': '1.jpg',
    'fileType': 'image/jpeg',
    'path': 'https://dummyimage.com/600x400/000/fff',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/1.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.070Z',
    'size': 275608
  },
  {
    'uuid': '29245130-ec05-4bf1-90ea-06574faa9bda',
    'fileName': '10.jpg',
    'fileType': 'image/jpeg',
    'path': 'https://dummyimage.com/600x400/000/fff',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/10.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.096Z',
    'size': 283680
  }

];

const getFile = (limit) => {
  return (limit) ? Items.slice(0, limit) : Items;
};

export {
  getFileMenu,
  getFile
};
