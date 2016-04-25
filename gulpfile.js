var gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
pngmin = require('gulp-pngmin'),
zip = require('gulp-zip'),
cssmin = require('gulp-cssmin');

gulp.task('png', function () {
	gulp.src(['*.png'])
		.pipe(pngmin())
		.pipe(gulp.dest('extension/'));
});

gulp.task('js', function () {
	gulp.src(['script.js'])
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('extension/'));
});

gulp.task('css', function () {
	gulp.src(['style.css'])
		.pipe(cssmin())
		.pipe(gulp.dest('extension/'));
});

gulp.task('zip', ['js', 'css', 'png'], function () {
	gulp.src(['extension/*'])
		.pipe(zip('extension.zip'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
	gulp.watch('*.js', ['js']);
	gulp.watch('*.css', ['css']);
});
