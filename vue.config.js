module.exports = {
  useBuiltIns: 'entry',
  pwa: {
    name: 'Jerma Logs',
    themeColor: '#0afc9e',
    msTileColor: '#0afc9e',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/firebase-messaging-sw.js'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/_variables.scss";
        `
      }
    }
  }
}
