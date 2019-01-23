const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const header = require('gulp-header');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const babylon = require('babylon');

const config = require('./build-config');

function es(components, cb) {
    const env = process.env.NODE_ENV || 'development';
    const target = process.env.TARGET || config.target;

    // bundle
    rollup.rollup({
        input: './src/index.js',
        external: [], // 配置外部库
        plugins: [
            replace({
                delimiters: ['', ''],
                'process.env.NODE_ENV': JSON.stringify(env),
                'process.env.TARGET': JSON.stringify(target),
                '//EXPORT': components.map(component => `export { default as ${component.capitalized}} from './components/${component.name}/${component.name}';`).join('\n'),
            }),
            resolve({
                jsnext: true
            })
        ]
    }).then(bundle => bundle.write({
        format: 'es',
        name: 'Custom',
        strict: true,
        sourcemap: env === 'development',
        sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/js/custom.esm.bundle.js.map`,
        file: `./${env === 'development' ? 'build' : 'dist'}/js/custom.esm.bundle.js`,
    })).then(() => {
        if(cb) cb();
    }).catch(err => {
        if(cb) cb();
        console.log(err.toString())
    });

     rollup.rollup({
        input: './src/index.js',
        external: [],
        plugins: [
            replace({
                delimiters: ['', ''],
                'process.env.NODE_ENV': JSON.stringify(env),
                'process.env.TARGET': JSON.stringify(target),
                '//EXPORT': components.map(component => `export { default as ${component.capitalized}} from './components/${component.name}/${component.name}';`).join('\n'),
            }),
            resolve({ jsnext: true }),
        ],
    }).then(bundle => bundle.write({
        format: 'es',
        name: 'Custom',
        strict: true,
        sourcemap: env === 'development',
        sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/js/custom.esm.js.map`,
        file: `./${env === 'development' ? 'build' : 'dist'}/js/custom.esm.js`,
    })).then(() => {
        if (cb) cb();
    }).catch((err) => {
        if (cb) cb();
        console.error(err.toString());
    });
}

function readFileDisplay(filePath) {
    if(fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        files.forEach(file => {
            const fileDir = path.join(filePath, file);
            const stats = fs.statSync(fileDir);
            console.log(path.posix.parse(fileDir).ext);
            if(stats.isDirectory()) {
                readFileDisplay(fileDir);
            } else if(path.posix.parse(fileDir).ext === 'js') {
                return fs.readFileSync(fileDir).toString();
            }
        });
    }
}

function umd(components, cb) {
    const env = process.env.NODE_ENV || 'development';
    const target = process.env.TARGET || config.target;

    rollup.rollup({
        input: './src/index.js',
        plugins: [
            replace({
                delimiters: ['', ''],
                'process.env.NODE_ENV': JSON.stringify(env),
                'process.env.TARGET': JSON.stringify(target),
                '//EXPORT': components.map(component => `export { default as ${component.capitalized}} from './components/${component.name}';`).join('\n'),
            }),
            resolve({ jsnext: true }),
            buble(),
        ],
    }).then(bundle => bundle.write({
        format: 'umd',
        name: 'Custom',
        strict: true,
        sourcemap: env === 'development',
        sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/js/custom.js.map`,
        file: `./${env === 'development' ? 'build' : 'dist'}/js/custom.js`,
    })).then(() => {
        if (env === 'development') {
            if (cb) cb();
            return;
        }
        gulp.src('./dist/js/custom.js')
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename((filePath) => {
                filePath.basename += '.min';
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'))
            .on('end', () => {
                cb();
            });
    }).catch((err) => {
        if (cb) cb();
        console.error(err.toString());
    });
}

function build(cb) {
    const env = process.env.NODE_ENV || 'development';

    const componentList = fs.readdirSync('./src/components');

    const components = [];
    componentList.forEach((name) => {
        const capitalized = name.split('').map((char, index) => {
                if (index === 0) return char.toUpperCase();
                return char;
        }).join('');
        const jsFilePath = `./src/components/${name}/index.js`;
        if (fs.existsSync(jsFilePath)) {
            components.push({ name, capitalized });
        }
    });

    const expectCbs = env === 'development' ? 1 : 2;
    let cbs = 0;

    umd(components, () => {
        cbs += 1;
        if (cbs === expectCbs) cb();
    });
    if (env !== 'development') {
        es(components, () => {
            cbs += 1;
            if (cbs === expectCbs) cb();
        });
    }
}

module.exports = build;