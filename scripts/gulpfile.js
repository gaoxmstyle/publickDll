const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const modifyFile = require('gulp-modify-file');

const buildJs = require('./build-js.js');
const buildSass = require('./build-scss.js');

gulp.task('playground', (cb) => {
    const env = process.env.NODE_ENV || 'development';
    gulp.src('./play/index.html')
        .pipe(modifyFile((content) => {
            if (env === 'development') {
                return content
                    .replace('../dist/css/custom.min.css', '../build/css/custom.css')
                    .replace('../dist/js/custom.min.js', '../build/js/custom.js');
            }
            return content
                .replace('../build/css/custom.css', '../dist/css/custom.min.css')
                .replace('../build/js/custom.js', '../dist/js/custom.min.js');
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
        server: './play/'
    });

    gulp.watch('./src/**/**/*.js', gulp.series('js'));
    gulp.watch('./src/**/**/*.scss', gulp.series('scss'));
    gulp.watch('./play/*.html').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('server'));