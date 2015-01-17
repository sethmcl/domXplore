module.exports = {
  scripts: {
    files: [
      {
        expand: true,
        cwd: 'src/scripts/',
        src: ['*.js'],
        dest: 'build/scripts/',
        ext: '.js',
        extDot: 'first'
      }
    ],
    options: {
      transform: ['brfs'],
      browserifyOptions: {
        debug: true
      }
    }
  }
};
