module.exports = {
  app: {
    options: {
      namespace: 'tl',
      wrapped: true,
      processName: function (filePath) {
        var parts = filePath.split('/');
        return parts[parts.length - 1].split('.')[0];
      }
    },
    files: {
      'build/scripts/templates.js': ['src/tl/*.tl']
    } 
  }
};
