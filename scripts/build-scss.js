const gulp = require('gulp');
const fs = require('fs');
const modifyFile = require('gulp-modify-file');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const header = require('gulp-header');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

const config = require('./build-config.js');
const banner = require('./banner.js');

function build(cb) {
    const env = process.env.NODE_ENV || 'development';

    const components = [];
    config.components.forEach((name) => {
        const scssFilePath = `./src/components/${name}/${name}.scss`;
        if (fs.existsSync(scssFilePath)) {
            components.push(name);
        }
    });

    const colors = [];

    Object.keys(config.colors).forEach((key) => {
        colors.push(`${key} ${config.colors[key]}`);
    });

    gulp.src('./src/index.scss')
        .pipe(modifyFile((content) => {
            const newContent = content
                .replace('//IMPORT_COMPONENTS', components.map(component => `@import url('./components/${component}/${component}.scss');`).join('\n'))
                .replace('$themeColor', config.themeColor)
                .replace('$colors', colors.join(', '));
            return newContent;
        }))
        .pipe(sass({
            javascriptEnabled: true,
        }))
        .on('error', (err) => {
            if (cb) cb();
            console.error(err.toString());
        })
        .pipe(autoprefixer({
            cascade: false,
        }))
        .on('error', (err) => {
            if (cb) cb();
            console.error(err.toString());
        })
        .pipe(header(banner))
        .pipe(gulp.dest(`./${env === 'development' ? 'build' : 'dist'}/css/`))
        .on('end', () => {
            if (env === 'development') {
                if (cb) cb();
                return;
            }
            gulp.src('./dist/css/dll.css')
                .pipe(cleanCSS({
                    advanced: false,
                    aggressiveMerging: false,
                }))
                .pipe(header(banner))
                .pipe(rename((filePath) => {
                    /* eslint no-param-reassign: ["error", { "props": false }] */
                    filePath.basename += '.min';
                }))
                .pipe(gulp.dest('./dist/css/'))
                .on('end', () => {
                    if (cb) cb();
                });
        });
}

module.exports = build;