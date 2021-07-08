const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const package = require('./package.json');

const banner = function () {
    return [
        '/**',
        ` * ${package.name} - v${package.version}`,
        ` * ${package.description}`,
        ` * ${package.homepage}`,
        ' *',
        ` * ${new Date(Date.now())}`,
        ` * ${package.license} (c) ${package.author.name}`,
        ' */',
        '',
    ].join('\n');
};

gulp.task('browserify', function () {
    return gulp
        .src('dist/what.js')
        .pipe(concat('what.min.js'))
        .pipe(uglify({ compress: { conditionals: false } }))
        .pipe(header(banner()))
        .pipe(gulp.dest('./dist'));
});
