Package.describe({
  name: 'aldeed:autoform-bs-datetimepicker',
  summary: 'Custom bootstrap-datetimepicker input type with timezone support for AutoForm',
  version: '1.0.3',
  git: 'https://github.com/aldeed/meteor-autoform-bs-datetimepicker.git'
});

Package.onUse(function(api) {
  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('aldeed:autoform@4.0.0');
  api.addFiles([
    'autoform-bs-datetimepicker.html',
    'autoform-bs-datetimepicker.js'
  ], 'client');
});
