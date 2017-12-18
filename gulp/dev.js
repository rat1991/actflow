"use strict";
import path from 'path'
import del from 'del'
import fs from 'fs'
import async from 'async'
import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import concat from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'
import gulpif from 'gulp-if'
import spritesmith from 'gulp.spritesmith'
import ejs from 'gulp-ejs'
import babel from 'gulp-babel'
import merge from 'merge-stream'
import buffer from 'vinyl-buffer'
import util from './util'

function dev (param, callback) {
  // 项目目录配置
  let config = Object.assign({}, param);
  const projectPath = `${config.base}/${config.name}`;
  const bs = require('browser-sync').create();  // 自动刷新浏览器
  let paths = {
    src: {
      dir: path.join(projectPath, 'src'),
      html: path.join(projectPath, 'src/html/*.html'),
      htmlAll: path.join(projectPath, 'src/html/**/*.{html,ejs}'),
      sass: path.join(projectPath, 'src/css/style-*.scss'),
      sassAll: path.join(projectPath, 'src/css/**/*.scss'),
      sassDir: path.join(projectPath, 'src/css'),
      js: path.join(projectPath, 'src/js/**/*.js'),
      images: path.join(projectPath, 'src/images/**/*.{JPG,jpg,png,gif,svg}'),
      slice: path.join(projectPath, 'src/slice/*.png'),
      sliceDir: path.join(projectPath, 'src/slice'),
      sliceAll: path.join(projectPath, 'src/slice/**/*.png'),
      media: path.join(projectPath, 'src/media/**/*')
    },
    dev: {
      dir: path.join(projectPath, 'dev'),
      html: path.join(projectPath, 'dev/html'),
      css: path.join(projectPath, 'dev/css'),
      js: path.join(projectPath, 'dev/js'),
      sprite: path.join(projectPath, 'dev/sprite'),
    }
  }
  // 自动刷新
  function reloadHandler() {
      config.livereload && bs.reload();
  }
  // 复制操作
  function copyHandler(type, file, cb) {
      if (typeof file === 'function') {
          cb = file;
          file = paths['src'][type];
      }

      gulp.src(file, {base: paths.src.dir})
          .pipe(gulp.dest(paths.dev.dir))
          .on('end', ()=> {
              console.log(`copy ${type} success.`);
              cb ? cb() : reloadHandler();
          });
  }
  // 清空文件
  function delFile (type, next) {
      del(paths[type].dir, {force: true}).then(()=>{
          next && next();
      })
  }
  //编译 sass
  function compileSass(cb) {
      gulp.src(paths.src.sass)
          .pipe(sourcemaps.init())
          .pipe(sass())
          .on('error', error => {
              console.log(error.message)
          })
          .pipe(autoprefixer({
              browsers: ['last 7 versions'],
              cascade: false
          }))
          .pipe(sourcemaps.write('./maps'))
          .pipe(gulp.dest(paths.dev.css))
          .on('data', ()=> {})
          .on('end', ()=> {
              if (cb) {
                  console.log('compile Sass success.');
                  cb();
              } else {
                  reloadHandler();
              }
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
    if(!folderList.length){
      cb && cb();
      return
    };
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
      let imgStream = spriteData.img.pipe(gulp.dest(paths.dev.sprite))
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
          padding: 4
    }));
    let imgStream = spriteData.img.pipe(gulp.dest(paths.dev.sprite))
    let cssStream = spriteData.css.pipe(gulp.dest(paths.src.sassDir))

    return merge(imgStream, cssStream).on('end', ()=> {
        console.log('compileSprite success.');
        cb && cb();
    })
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
                    "browsers": ["last 5 versions", "ie >= 8"]
                  }
                }
              ],
              "babel-preset-stage-2"
            ],
//            plugins: ['transform-runtime']
//            modules: "common", // 默认是 common，也可以改成 umd
          }))
          .pipe(gulp.dest(paths.dev.js))
          .on('end', ()=> {
              if (cb) {
                  console.log('compileJs success.');
                  cb();
              } else {
                  reloadHandler();
              }
          });
  }
  //编译 html
  function compileHtml(cb) {
      gulp.src(paths.src.html)
          .pipe(ejs().on('error', error => {
              console.log(error.message);
          }))
          .pipe(gulp.dest(paths.dev.html))
          .on('end', ()=> {
              if (cb) {
                  console.log('compile Html success.');
                  cb();
              } else {
                  reloadHandler();
              }
          })
  }
  //监听文件
  function watch(cb) {
    let watcher = gulp.watch([
            paths.src.htmlAll,
            paths.src.sassAll,
            paths.src.js,
            paths.src.images,
            paths.src.sliceAll,
            paths.src.media,
        ],
        {ignored: /[\/\\]\./}
    );
    watcher.on('change', file => {
                console.log(file + ' has been changed');
                watchHandler('changed', file);
            }).on('add', file => {
                console.log(file + ' has been added');
                watchHandler('add', file);
            }).on('unlink', file => {
                console.log(file + ' is deleted');
                watchHandler('removed', file);
            });
    console.log('watching...');
    cb && cb()
  }
  function watchHandler(type, file) {

        let target = file.split('src')[1].match(/[\/\\](\w+)[\/\\]/);

        if (target.length && target[1]) {
            target = target[1];
        }

        switch (target) {
            case 'images':
                if (type === 'removed') {
                    let tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () {
                        reloadHandler();
                    });
                } else {
                    copyHandler('images', file);
                }
                break;

            case 'slice':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    gulp.series(compileSpriteMulti, compileSass)()
                }
                break;

            case 'js':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    util.throttle(compileJs, 500)()
                }
                break;

            case 'media':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    copyHandler('media', file);
                }
                break;

            case 'css':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev').replace('.scss', '.css');
                    del([tmp], {force: true});
                } else {
                    util.throttle(compileSass, 1000)()
                }

                break;

            case 'html':
                if (type === 'removed') {
                    let tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () {
                    });
                } else {
                    compileHtml();
                }

                break;
        }

    };
  //启动 livereload
  function startServer(cb) {
      bs.init({
          server: {
              baseDir: paths.dev.dir,
              directory: true
          },
          startPath: "/html",
          port: 3000,
          reloadDelay: 0,
          timestamps: true,
          notify: {      //自定制livereload 提醒条
              styles: [
                  "margin: 0",
                  "padding: 5px",
                  "position: fixed",
                  "font-size: 10px",
                  "z-index: 9999",
                  "bottom: 0px",
                  "right: 0px",
                  "border-radius: 0",
                  "border-top-left-radius: 5px",
                  "background-color: rgba(60,197,31,0.5)",
                  "color: white",
                  "text-align: center"
              ]
          }
      });

      cb();
  }

  // 执行任务
  return gulp.series(
    function(cb){
      delFile('dev', cb)
    },
    compileSpriteMulti,
    gulp.parallel(compileSass, compileHtml, compileJs, startServer),
    //复制不需要编译的文件
    gulp.parallel(
      function(cb){
        copyHandler('images', cb);
      },
      function(cb){
        copyHandler('media', cb);
      }
    ),
    watch
  )
}
module.exports = dev;