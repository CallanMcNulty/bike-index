var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var buildProduction = utilities.env.production;
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});
var browserSync = require('browser-sync').create();

gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js', 'bower_components/jquery/dist/jquery.min.js'])
  .pipe(concat('allConcat.js'))
  .pipe(gulp.dest('./tmp'));
});

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'));
});

gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

gulp.task("build", ['clean'], function(){
  if (buildProduction) {
  gulp.start('minifyScripts');
  } else {
  gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('cssBuild');
});

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task('jshint', ['build'], function(){
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['.env'], ['build'])
  gulp.watch(["*.html"], ['htmlBuild']);
  gulp.watch(["scss/*.scss"], ['cssBuild', 'htmlBuild']);
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});
gulp.task('htmlBuild', ['bower'], function(){
  browserSync.reload();
});
gulp.task('cssBuild', ['htmlBuild'], function() {
  return gulp.src(['scss/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./build/css'));
  browserSync.reload();
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function () {
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css'));
});
