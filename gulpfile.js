const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
// const jquery = require('jquery');
const  plumber = require('gulp-plumber'); // вывод ошибок в терминал
const cache = require('gulp-cache');  //
const imagemin = require('gulp-imagemin'); // минификация изображений
const concat = require('gulp-concat'); // конкатенация файлов в один
const autoprefixer = require('gulp-autoprefixer'); // автопрефиксы
const cleanCSS = require('gulp-clean-css'); // сжатие стилей
const uglify = require('gulp-uglify');// сжатие  js
const sourcemaps = require("gulp-sourcemaps"); // показывает в каких файлах находятся стили
const browserSync = require('browser-sync').create(); // авто перезагрузка
const del = require('del');

sass.compiler = require('node-sass');

const plumberOptions = {
    handleError: function(err) {
        console.log(err);
        this.emit('end');
    }
};

//  записываем в переменную какие css файлы будем обрабатывать
const sassAllFiles = [
    'node_modules/normalize.css/normalize.css',
    './src/scss/style.scss'
];

function sassStyles() {
    return gulp.src(sassAllFiles) // ** -  './src/scss/**/*.scss' искать во всех папках, с расширением scss
        .pipe(sourcemaps.init()) // инициализация sourcemaps перед началом компиляции
        .pipe(plumber(plumberOptions)) // показывать ошибки
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('all.css')) // конкатенация файлов в один
        .pipe(autoprefixer({
            browsers: ['> 0.1%'], // браузеры которые используются больше 0.1%
            cascade: false
        }))
        .pipe(cleanCSS({ level: 2 })) // сжатие стилей
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

//  записываем в переменную какие js файлы будем обрабатывать
const jsFiles = [
    './src/js/main.js'
];

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('all.js')) // конкатенация файлов в один
        .pipe(plumber(plumberOptions)) // показывать ошибки
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    modules: false
                }]
            ]
        }))
        .pipe(uglify({
            toplevel: true  // сжатие
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}


function img() {   //  минификация картинок
    return gulp.src('./src/img/**/*.*')
        .pipe(cache(imagemin([  // Сжимаем с учетом кеширования
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ])))
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream());
}

function fonts() {  // добавление шрифтов в папку build, можно вручную добавлять, по желанию
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));
}


function watch() {   // функция watch  следит за всеми файлами которые в ней прописаны
        browserSync.init({  //инициализация синхронизации
            server: {
                baseDir: "./"  // указываем в какой папке искать наш файл index.html
            }
            // tunnel: true
        });

    gulp.watch('./src/scss/**/*.scss', sassStyles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/img/**/*.*', img);
    gulp.watch('./src/fonts/**/*.*', fonts);
    gulp.watch('./*.html',  browserSync.reload);
}


function clean() {
    return del(['build/*'])
}


gulp.task('sassStyles', sassStyles);
gulp.task('scripts', scripts);
gulp.task('img', img);
gulp.task('fonts', fonts);
gulp.task('watch', watch);
gulp.task('build', gulp.series( clean, //series- последовательность действий
    gulp.parallel(sassStyles, scripts, img, fonts)));  //parallel- все запускается одновременно

gulp.task('dev', gulp.series('build', 'watch'));










//  если нужен чистый scss
// const cssAllFiles = [
//     'node_modules/normalize.scss/normalize.scss',
//     './src/scss/header.scss',
//     './src/scss/style.scss'
// ];
//
// function styles() {
//     return gulp.src(cssAllFiles) // ** -  './src/scss/**/*.scss' искать во всех папках, с расширением scss
//         .pipe(concat('all.scss')) // конкатенация файлов в один
//         .pipe(plumber(plumberOptions))
//         .pipe(autoprefixer({
//             browsers: ['> 0.1%'], // браузеры которые используются больше 0.1%
//             cascade: false
//         }))
//         .pipe(cleanCSS({ level: 2 })) // сжатие стилей
//         .pipe(gulp.dest('./build/scss'))
//         .pipe(browserSync.stream());
// }