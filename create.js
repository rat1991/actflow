"use strict";
var path = require('path')
var fs = require('fs')
var yargs = require('yargs')
var extract = require('extract-zip')

let argv = yargs
.alias('n', 'name')
.alias('t', 'tpl')
.argv;

function createProject (config, callback){
  let basePath = './project';
  let projectName = argv.name;
  let projectTplName = argv.tpl;
  const PROJECT_PATH = path.join(__dirname, `${basePath}/${projectName}`);
  const TEMPLATE_PROJECT = path.join(__dirname, 'templates/project.zip');
  // 判断项目是否存在
  fs.exists(PROJECT_PATH, function (exists) {
      if(exists){
        console.error('项目已存在, 请更换名称')
      }else{
        // 创建模版目录
        extract(TEMPLATE_PROJECT, {dir: PROJECT_PATH}, function (err) {
         // extraction is complete. make sure to handle the err
          if(!err){
            console.log(`创建${projectName}项目成功：${PROJECT_PATH}`)
            console.log(`请自行修改D:\act-flow目录下gulpfile.babel.js文件中项目配置config["name"]项为“${projectName}”后, 执行gulp dev命令进行开发`)
          }else{
            console.error(err)
          }
        })
      }
    });
}
createProject()