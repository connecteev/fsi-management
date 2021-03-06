const pkg = require('./package')


const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'FSI Service',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'FSI Service'
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ],
    script: [{
      src: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.4/echarts-en.min.js',
      src: 'https://printjs-4de6.kxcdn.com/print.min.js'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#3adced'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/theme.styl',
    '~/assets/style/app.styl',
    'font-awesome/css/font-awesome.css',
    'roboto-fontface/css/roboto/roboto-fontface.css',
    'ant-design-vue/dist/antd.css',
    'print-js/dist/print.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/vee-validate',
    '@/plugins/antd-ui',


  ],

  /*
   ** Nuxt.js modules
   */
  modules: [],


  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ["~assets/style/variables.styl"]
      }
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  },
  optimization: {
    minimize: false
  },
  serverMiddleware: ['~/api/index.js']
}
