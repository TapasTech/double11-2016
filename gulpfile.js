
// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var streamqueue = require('streamqueue');

var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var revReplace = require('gulp-rev-replace');

var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function () {
    return gulp.src(['src/scss/*.scss'])
        .pipe(sass({outputStyle: 'expanded'}))  // nested, expanded, compact, compressed
        .on('error', sass.logError)
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// inspect JS
gulp.task('jshint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

// minify images
gulp.task('images', function(){
    return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
});

// synchronize browser
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    })
});

// Watch Files For Changes
// gulp.task('watch', ['browserSync', 'sass', 'jshint', 'images'], function() {
gulp.task('watch', ['browserSync', 'sass', 'jshint'], function() {
    gulp.watch(['src/**/*.js']).on('change', browserSync.reload);
    gulp.watch(["src/**/*.html"]).on('change', browserSync.reload);
    gulp.watch(["./**/*.txt"]).on('change', browserSync.reload);
    gulp.watch('src/scss/*.scss', ['sass']);
});

// run dev build sequence
gulp.task('dev', function (callback) {
    runSequence(
        // ['watch', 'sass', 'uglify', 'images', 'browserSync'],
        ['watch', 'sass', 'uglify', 'browserSync'],
        callback
    )
});
gulp.task('default', function() {
    runSequence('dev');
});

// uglify JS and pipe to dist
gulp.task('uglify', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        // .pipe(revCollector({replaceReved: true}))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest({
            merge: true
        }))
        .pipe(gulp.dest('dist/rev/js'));
});

// compile sass and pipe to dist
gulp.task('sass-prod', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(browserSync.reload({
            stream: true
        }))
        // .pipe(revCollector({replaceReved: true}))
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', sass.logError)
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest({
            merge: true
        }))
        .pipe(gulp.dest('dist/rev/css'))
});

// minify images
gulp.task('images-prod', function () {
    return streamqueue({objectMode: true},
        gulp.src(['src/images/**/*.+(png|jpg|jpeg|gif|svg)'])
        // Caching images that ran through imagemin
        //     .pipe(cache(imagemin({interlaced: true})))
            .pipe(rev())
            .pipe(gulp.dest('dist/images'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('dist/rev/images'))
    )
});

// copy html and common resources to dist
gulp.task('copy', function () {
    return streamqueue({objectMode: true},
        gulp.src(['src/**/*.html','src/**/*.txt','src/**/*.json', 'src/common/*'])
            .pipe(gulp.dest('dist/'))
    )
});

// update all file names with md5-suffixed ones
gulp.task('rev', function () {
    return streamqueue({objectMode: true},
        // 更新html中引用的所有资源的路径
        gulp.src(['dist/rev/**/*.json', 'dist/*.html'])
            .pipe(revCollector({replaceReved: true}))
            .pipe(gulp.dest('dist/')),
        // 更新css中引用的图片的路径
        gulp.src(['dist/rev/images/*.json', 'dist/css/*.css'])
            .pipe(revCollector({replaceReved: true}))
            .pipe(gulp.dest('dist/css/'))
    )
});

// clean up unused generated files
gulp.task('clean', function() {
    return del.sync('dist/**/*');
});

gulp.task('browserSync-prod', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    })
});

// Watch Files For Changes
gulp.task('watch-prod', ['browserSync-prod'], function() {
    gulp.watch(['src/js/*.js']).on('change', browserSync.reload);
    gulp.watch(["src/**/*.html"]).on('change', browserSync.reload);
    gulp.watch('src/scss/*.scss', ['sass']);
});


gulp.task('prod', function (callback) {
    runSequence(
        ['clean', 'uglify', 'sass-prod','images-prod', 'copy'],'rev',
        callback
    )
});