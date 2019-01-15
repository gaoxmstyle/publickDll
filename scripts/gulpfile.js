const gulp = require('gulp');
const connect = require('gulp-connect');
const gopen = require('gulp-open');
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

gulp.task('reload', () => {
    return gulp.src('./play/*.html').pipe(connect.reload());
});

gulp.task('build', gulp.series('js', 'scss'));

gulp.task('watch', (cb) => {
    gulp.watch('./play/*.html', gulp.series('reload'));
    gulp.watch('./src/**/**/*.js', gulp.series('js', 'reload'));
    gulp.watch('./src/**/**/*.scss', gulp.series('scss', 'reload'));
    cb && cb();
});

gulp.task('connect', (cb) => {
    connect.server({
        root: ['./'],
        livereload: true,
        port: '3000',
        host: '10.105.18.76'
    });
    cb && cb();
});

gulp.task('open', () => {
    return gulp.src('./play/index.html').pipe(gopen({ uri: 'http://10.105.18.76:3000/play/' }));
});

gulp.task('server', gulp.series('watch', 'connect', 'open'));

gulp.task('default', gulp.series('server'));