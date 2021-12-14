const { src, dest, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const watch = require("gulp-watch");
const autoprefixer = require("gulp-autoprefixer");
const rimraf = require("rimraf");
const webpack = require("webpack-stream");
const fileinclude = require("gulp-file-include");

function clean(done) {
  rimraf("./dist", done);
}

function cssDev() {
  return src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./src/css"))
    .pipe(browserSync.stream());
}

function cssBuild() {
  return src("./src/scss/*.scss")
    .pipe(autoprefixer())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./dist/css"));
}

function htmlDev() {
  return src("./src/_html/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./src/"));
}

function htmlBuild() {
  return src("./src/*.html")
    .pipe(replace("main.css", "main.min.css"))
    .pipe(replace("main.build.js", "main.min.js"))
    .pipe(dest("./dist/"));
}

function jsDev() {
  return src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "development",
      })
    )
    .pipe(rename({ suffix: ".build" }))
    .pipe(dest("./src/js"));
}

function jsBuild() {
  return src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "production",
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./dist/js"));
}

function staticBuild() {
  return src([
    "./src/{fonts,img,static}/**/*",
    "./src/manifest.webmanifest",
  ]).pipe(dest("./dist/"));
}

function dev() {
  browserSync.init({
    server: {
      baseDir: "./src",
      directory: true,
    },
    files: "*.html",
    injectChanges: true,
  });

  watch("src/scss/*.scss", cssDev);
  watch("src/js/main.js", jsDev);

  watch("src/_html/**/*.html", series(htmlDev, browserSync.reload));
}

const build = series(
  clean,
  parallel(cssBuild, jsBuild, htmlBuild, staticBuild)
);

module.exports = {
  dev,
  build,
};
