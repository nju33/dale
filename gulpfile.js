const gulp = require('gulp');

const cwd = process.cwd();

gulp.task('markup', () => {
  gulp.src('src/markups/*.html', {cwd}).pipe(gulp.dest('app/'));
});

gulp.task('style', () => {
  gulp.src('src/styles/*.css', {cwd}).pipe(gulp.dest('app/'));
});
