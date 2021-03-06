"use strict";
import path from 'path'
import del from 'del'
import fs from 'fs'
import async from 'async'
import gulp from 'gulp'
import gulpif from 'gulp-if'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import ejs from 'gulp-ejs'
import babel from 'gulp-babel'
import minifyCSS from 'gulp-cssnano'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import rev from 'gulp-rev'
import revCollector from 'gulp-rev-collector'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import useref from 'gulp-useref'
import spritesmith from 'gulp.spritesmith'
import merge from 'merge-stream'

function dist (options, callback) {
  // 项目目录配置
  const config = Object.assign({}, options);
  const projectPath = path.resolve(`${config.base}/${config.name}`);
  
  let paths = {
    src: {
      dir: path.join(projectPath, 'src'),
      html: path.join(projectPath, 'src/html/**/*.html'),
      sass: path.join(projectPath, 'src/css/style-*.scss'),
      sassAll: path.join(projectPath, 'src/css/**/*.scss'),
      sassDir: path.join(projectPath, 'src/css'),
      js: path.join(projectPath, 'src/js/**/*.js'),
      images: path.join(projectPath, 'src/images/**/*.{JPG,jpg,png,gif,svg}'),
      slice: path.join(projectPath, 'src/slice/*.png'),
      sliceDir: path.join(projectPath, 'src/slice'),
      media: path.join(projectPath, 'src/media/**/*')
    },
    tmp: {
      dir: path.join(projectPath, 'tmp'),
      dirAll: path.join(projectPath, 'tmp/**/*'),
      html: path.join(projectPath, 'tmp/html'),
      htmlAll: path.join(projectPath, 'tmp/html/**/*.html'),
      css: path.join(projectPath, 'tmp/css'),
      cssAll: path.join(projectPath, 'tmp/css/style-*.css'),
      js: path.join(projectPath, 'tmp/js'),
      images: path.join(projectPath, 'tmp/images'),
      sprite: path.join(projectPath, 'tmp/sprite'),
      rev: path.join(projectPath, 'tmp/rev')
    },
    dist: {
      dir: path.join(projectPath, 'dist'),
      html: path.join(projectPath, 'dist/html'),
      css: path.join(projectPath, 'dist/css'),
      js: path.join(projectPath, 'dist/js'),
      images: path.join(projectPath, 'dist/images'),
      sprite: path.join(projectPath, 'dist/sprite'),
    }
  };
  
  // 复制操作
  function copyHandler(type, file, cb) {
      if (typeof file === 'function') {
          cb = file;
          file = paths['src'][type];
      }

      gulp.src(file, {base: paths.src.dir})
          .pipe(gulp.dest(paths.dist.dir))
          .on('end', ()=> {
              console.log(`copy ${type} success.`);
              cb ? cb() : reloadHandler();
          });
  }
  // 清空文件
  function delFile (type, next) {
      del(paths[type].dir, {force: true}).then(()=>{
        console.log(`deleted ${type} success.`);
          next && next();
      })
  }
  // 编译雪碧图(多文件)
  function compileSpriteMulti (cb) {
    try {
      fs.accessSync(paths.src.sliceDir);
    } catch (e) {
      cb && cb()
      return;
    }
    let cssMerged = merge();
    let imgMerged = merge();
    let files = fs.readdirSync(paths.src.sliceDir);
    let folderList = files.filter( item =>{
      return !/\.png$/.test(item)
    });
    let rootSlice = files.filter( item =>{
      return /\.png$/.test(item)
    });
    if(rootSlice.length > 0){
      folderList.unshift(null)
    }
    if(!folderList.length) return;
    folderList.forEach(folder=>{
      let slicePath = folder === null ? '' : `/${folder}`;
      let spriteData = gulp.src(paths.src.sliceDir + `${slicePath}/*.png`).pipe(spritesmith({
          imgName: `${folder||'sprite'}.png`,
          cssName: `${folder||'sprite'}.scss`,
          cssFormat: 'scss',
          cssVarMap(sprite) {
            sprite.name = `${config.sprite.prefix}${folder ? '-' + folder : ''}-${sprite.name}`;
          },
          cssTemplate: 'templates/sprite.handlebars',
          algorithm: config.sprite.algorithm,
          padding: 8
      }));
      let imgStream = spriteData.img.pipe(gulp.dest(paths.tmp.sprite))
      let cssStream = spriteData.css
      cssMerged.add(cssStream)
      imgMerged.add(imgStream, cssStream)
    })
    cssMerged.pipe(concat('sprite.scss'))
             .pipe(gulp.dest(paths.src.sassDir));

    return merge(imgMerged, cssMerged).on('end', ()=> {
        console.log('compileSpriteMulti success.');
        cb && cb();
    })
  }
  // 编译雪碧图
  function compileSprite (cb) {
    let spriteData = gulp.src(paths.src.slice).pipe(spritesmith({
          imgName: 'sprite.png',
          cssName: 'sprite.scss',
          cssFormat: 'scss',
          cssTemplate: 'templates/sprite.handlebars',
          padding: 8
    }));
    let imgStream = spriteData.img.pipe(gulp.dest(paths.tmp.sprite))
    let cssStream = spriteData.css.pipe(gulp.dest(paths.src.sassDir))

    return merge(imgStream, cssStream).on('end', ()=> {
        console.log('compileSprite success.');
        cb && cb();
    })
  }
  //雪碧图压缩
  function imageminSprite(cb) {
      let spritePath = `${paths.tmp.sprite}/**/*.png`
      gulp.src(spritePath)
          .pipe(imagemin({
              progressive: true,
              use: [pngquant()]
          }))
          .pipe(rev())
          .pipe(gulp.dest(paths.dist.sprite))
          .pipe(rev.manifest({
            path: 'rev-manifest-sprite.json'
          }))
          .pipe(gulp.dest(paths.tmp.rev))
          .on('end', function () {
              console.log('imageminSprite success.');
              cb && cb();
          });
  }
  //编译 sass
  function compileSass(cb) {
      gulp.src(paths.src.sass)
          .pipe(sass())
          .on('error', function (error) {
              console.log(error.message);
              log(error.message);
          })
          .pipe(autoprefixer({
              browsers: ['last 7 versions'],
              cascade: false
          }))
          .pipe(gulp.dest(paths.tmp.css))
          .on('data', function () {
          })
          .on('end', function () {
              console.log('compileSass success.');
              cb && cb();
          })
  }
  //CSS 压缩
  function miniCSS(cb) {
      gulp.src(paths.tmp.cssAll)
          .pipe(minifyCSS({
              safe: true,
              reduceTransforms: false,
              advanced: false,
              compatibility: 'ie7',
              keepSpecialComments: 0
          }))
          .pipe(gulp.dest(paths.tmp.css))
          .on('end', function () {
              console.log('miniCSS success.');
              cb && cb();
          });
  }
  //编译 JS
  function compileJs(cb) {

      return gulp.src(paths.src.js)
          .pipe(babel({
            presets: [
              [
                "env",
                {
                  "targets": {
                    "browsers": ["last 4 versions", "ie >= 8"]
                  }
                }
              ],
              "babel-preset-stage-2"
            ]
          }))
          .pipe(uglify())
          .pipe(gulp.dest(paths.tmp.js))
          .on('end', function () {
              console.log('compileJs success.');
              cb && cb();
          });
  }
  //编译 html
  function compileHtml(cb) {
      gulp.src(paths.src.html)
          .pipe(ejs().on('error', error => {
              console.log(error.message);
          }))
          .pipe(gulp.dest(paths.tmp.html))
          .on('end', function () {
              console.log('compileHtml success.');
              cb && cb();
          });
  }
  // rev CSS
  function revCollectorCss(cb){
    if(config.assetRev){
      gulp.src([paths.tmp.rev + '/*.json', paths.dist.css + '/*.css'])
              .pipe(revCollector())
              .pipe(gulp.dest(paths.dist.css))
              .on('end', function () {
                  console.log('revCollectorCss success.');
                  cb && cb();
              });
    }else{
      cb && cb();
    }
  }
  // rev HTML
  function revCollectorHtml(cb){
    if(config.assetRev){
      gulp.src([paths.tmp.rev + '/rev-manifest-html.json', paths.dist.html + '/**/*.html'])
              .pipe(revCollector())
              .pipe(gulp.dest(paths.dist.html))
              .on('end', function () {
                  console.log('revCollectorHtml success.');
                  cb && cb();
              });
    }else{
      cb && cb();
    }
  }
  function getCssJsRev(cb){
    gulp.src([paths.dist.css + '/*.css', paths.dist.js + '/**/*.js'])
          .pipe(rev())
          .pipe(rev.manifest({
            path: 'rev-manifest-html.json'
          }))
          .pipe(gulp.dest(paths.tmp.rev))
          .on('end', function () {
              console.log('revCollectorHtml success.');
              cb && cb();
          });
  }
  //新文件名(md5)
  function mergeRes(cb) {
    gulp.src(paths.tmp.htmlAll)
          .pipe(useref())
          .pipe(gulp.dest(paths.dist.html))
          .on('end', function () {
              console.log('merge asset success.');
              cb && cb();
          });
  }
  //图片压缩
  function imageminImg(cb) {
      gulp.src(paths.src.images)
          .pipe(imagemin({
              optimizationLevel: 5,
              progressive: true,
              use: [pngquant()]
          }))
          .pipe(rev())
          .pipe(gulp.dest(paths.dist.images))
          .pipe(rev.manifest({
            path: 'rev-manifest-img.json'
          }))
          .pipe(gulp.dest(paths.tmp.rev))
          .on('end', function () {
              console.log('imageminImg success.');
              cb && cb();
          });
  }
  //复制媒体文件
  function copyMedia(cb) {
      gulp.src(paths.src.media, {base: paths.src.dir})
          .pipe(gulp.dest(paths.dist.dir))
          .on('end', function () {
              console.log('copyMedia success.');
              cb && cb();
          });
  }
  //
  // 执行任务
  return gulp.series(
    function(cb){
      delFile('dist', cb)
    },
    //compileSprite,
    compileSpriteMulti,
    gulp.parallel(
      gulp.series(compileSass, miniCSS),
      compileJs,
      compileHtml,
      imageminImg,
      imageminSprite,
      function(cb){
        copyHandler('media', cb);
      }
    ),
    mergeRes,
    revCollectorCss,
    getCssJsRev,
    revCollectorHtml,
    function(cb){
      delFile('tmp', cb)
    }
  )
}
module.exports = dist;