var gulp       = require('gulp');
var livereload = require('gulp-livereload');
var bower = require('gulp-bower');
var connect = require('connect');
var http    = require('http');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');

gulp.task('bundle', function(){
  return browserify()
    //.require('backbone/node_modules/underscore', { expose: 'underscore' })
    .bundle({debug: true})
    .pipe(source('./src/js/main.js'))
    .pipe(gulp.dest('./build/'))
    //.pipe(livereload());
});

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

gulp.task('watch', function(){
  gulp.watch('src/js/**', ['bundle']);
  livereload();
});