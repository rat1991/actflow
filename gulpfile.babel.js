"use strict";
import path from 'path'
import register from 'babel-register'
import gulp from 'gulp'
import dev from './gulp/dev'
import dist from './gulp/dist'

  // 项目配置
  const config = {
    // 项目存放目录(不要修改)
    base: 'project',
    // 当前开发活动名称(修改项目名进行开发)
    name: 'demo',
    // 文件修改后是否自动刷新
    livereload: true,
    /*========================================================================================
      build任务时是否添加版本号(css文件内引用的图片也会添加版本号)
      注意:因修改添加版本号为“?=hash*10”形式，请在 npm install 完成后将update文件下的模块覆盖到node_modules
    ============================================================================================*/
    assetRev: false
  }

  // 执行开发，并启动http服务器
  gulp.task('dev', dev(config));
  
  // 执行构建，压缩and合并css，js,、压缩图片、添加版本号
  gulp.task('build', dist(config));