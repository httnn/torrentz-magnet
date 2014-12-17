var gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
pngmin = require('gulp-pngmin'),
zip = require('gulp-zip');

gulp.task('png', function () {
	gulp.src(['*.png'])
		.pipe(pngmin())
		.pipe(gulp.dest('extension/'));
});

gulp.task('js', function () {
	gulp.src(['*.js', '!gulpfile.js'])
		.pipe(concat('script.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('extension/'));
});

gulp.task('zip', function () {
	gulp.src(['extension/*'])
		.pipe(zip('extension.zip'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
	gulp.watch('*.js', ['js']);
});