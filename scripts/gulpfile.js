const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const modifyFile = require('gulp-modify-file');

const buildJs = require('./build-js.js');
const buildSass = require('./build-scss.js');

gulp.task('playground', (cb) => {
    const env = process.env.NODE_ENV || 'development';
    gulp.src('./playground/index.html')
        .pipe(modifyFile((content) => {
            if (env === 'development') {
                return content
                    .replace('../dist/css/swiper.min.css', '../build/css/swiper.css')
                    .replace('../dist/js/swiper.min.js', '../build/js/swiper.js');
            }
            return content
                .replace('../build/css/swiper.css', '../dist/css/swiper.min.css')
                .replace('../build/js/swiper.js', '../dist/js/swiper.min.js');
        }))
        .pipe(gulp.dest('./play/'))
        .on('end', () => {
            if(cb) cb();
        })
});

gulp.task('js', (cb) => {
    return buildJs(cb);
});

gulp.task('scss', (cb) => {
    return buildSass(cb);
});

gulp.task('build', gulp.series('js', 'scss'));

gulp.task('server', gulp.series('js', 'scss', function () {
    browserSync.init({
        server: './play'
    });

    gulp.watch('./src/**/**/*.js', gulp.series('js'));
    gulp.watch('./src/**/**/*.scss', gulp.series('scss'));
    gulp.watch('./play/*.html').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('server'));