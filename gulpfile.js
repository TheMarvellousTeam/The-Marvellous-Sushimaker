var gulp       = require('gulp');
var bower = require('gulp-bower');
var connect = require('connect');
var http    = require('http');


gulp.task('serve', function(){
  var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('./'))
    .use(connect.directory('./'))

  http.createServer(app).listen("8001");
});

gulp.task('bower', function() {
  bower()
});

