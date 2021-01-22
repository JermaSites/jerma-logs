module.exports = {
  pwa: {
    name: 'Jerma Logs',
    themeColor: '#0afc9e',
    msTileColor: '#0afc9e',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
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
