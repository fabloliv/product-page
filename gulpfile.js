var gulp = require('gulp');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
});

gulp.task('imgmin', function(){
  return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin({
    verbose: true
  }))
  .pipe(gulp.dest('assets/img'))
});

gulp.task('serve', gulp.series(['browserSync', 'imgmin', 'sass'], function() {
    gulp.watch('src/img/**/*.+(png|jpg|gif|svg)', gulp.parallel(['imgmin']));
    gulp.watch('src/scss/**/*.scss', gulp.parallel(['sass']));
    gulp.watch('./*.html', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));