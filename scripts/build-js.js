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
                '//IMPORT_COMPONENTS': components.map(component => `import ${component.capitalized} from './components/${component.name}/${component.name}';`).join('\n'),
                '//INSTALL_COMPONENTS': components.map(component => `${component.capitalized}`).join(',\n  '),
                '//EXPORT': 'export default Custom',
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
                '//IMPORT_COMPONENTS': components.map(component => `import ${component.capitalized} from './components/${component.name}/${component.name}';`).join('\n'),
                '//INSTALL_COMPONENTS': '',
                '//EXPORT': `export { Custom, ${components.map(component => component.capitalized).join(', ')} }`,
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

function toReact() {
    let fileContent = '';
    fileContent = fileContent + readFileDisplay('./src') ;
    console.log(fileContent);
    const ast = babylon.parse(fileContent, {
        sourceType:'module',
        plugins: ["typescript", "classProperties", "jsx", "trailingFunctionCommas", "asyncFunctions", "exponentiationOperator", "asyncGenerators", "objectRestSpread", "decorators"]
    });
    console.log(ast);
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
                '//IMPORT_COMPONENTS': components.map(component => `import ${component.capitalized} from './components/${component.name}/${component.name}';`).join('\n'),
                '//INSTALL_COMPONENTS': components.map(component => `${component.capitalized}`).join(',\n  '),
                '//EXPORT': 'export default Custom;',
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
        const capitalized = name.split('-').map((word) => {
            return word.split('').map((char, index) => {
                if (index === 0) return char.toUpperCase();
                return char;
            }).join('');
        }).join('');
        const jsFilePath = `./src/components/${name}/${name}.js`;
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
    toReact();
    if (env !== 'development') {
        es(components, () => {
            cbs += 1;
            if (cbs === expectCbs) cb();
        });
    }
}

module.exports = build;