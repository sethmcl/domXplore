module.exports = {
  src: {
    files: [
      {
        expand: true,
        cwd: 'src',
        src: ['manifest.json', '_locales/**/*', '*.html', 'styles/**/*', 'images/**/*'],
        dest: 'build/'
      }
    ]
  },

  handlebars: {
    files: [
      {
        expand: true,
        cwd: 'node_modules/grunt-contrib-handlebars/node_modules/handlebars/dist',
        src: ['handlebars.runtime.min.js'],
        dest: 'build/scripts/'
      }
    ]
  }
};
