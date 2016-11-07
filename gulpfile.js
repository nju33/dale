const gulp = require('gulp');
const postcss = require('gulp-postcss');

const cwd = process.cwd();

gulp.task('markup', () => {
  gulp.src('src/markups/*.html', {cwd}).pipe(gulp.dest('app/'));
});

gulp.task('style', () => {
  gulp.src('src/styles/index.css', {base: 'src/'})
    .pipe(postcss([
      require('autoprefixer')({browsers: ['last 2 versions']}),
      require('postcss-import'),
      require('postcss-preref'),
      require('postcss-namespace').bem,
      require('postcss-easings'),
      require('css-mqpacker'),
      require('cssnano')
    ]))
    .pipe(gulp.dest('app/'));
});

gulp.task('watch', ['style'], () => {
  gulp.watch('src/styles/**/*.css', ['style']);
});
