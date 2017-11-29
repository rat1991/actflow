## 开始
`npm install`

`node create -n 项目名称` 创建项目（默认创建模版为project的项目）
并修改gulpfile.babel.js里的项目配置 `config.name`项为`项目名称`（即创建的项目目录名）
```javascript
// 项目配置
  const config = {
    // 当前开发活动名称(修改项目名进行开发)
    name: 'demo',
    // 项目存放目录(如无需要不需修改)
    base: 'project',
    // 文件修改后是否自动刷新
    livereload: true,
    /*========================================================================================
      build任务时是否添加版本号(css文件内引用的图片也会添加版本号)
      注意:因修改添加版本号为“?=hash*10”形式，请在 npm install 完成后将update文件下的模块覆盖到node_modules
    ============================================================================================*/
    assetRev: true,
    /**
     * 雪碧图选项
     * @key prefix: css前缀
     * @key algorithm: sprite合并方式 https://www.npmjs.com/package/gulp.spritesmith#algorithms
     */
    sprite: {
      prefix: 'sp',
      algorithm:'binary-tree',
    },
  }
```
`gulp dev` 执行开发

`gulp build` 执行构建

## 开发约定
* 项目文件结构为: html、css、js、images、slice、media
    *  html为放置html、ejs模版文件
    *  css 放置 css、sass样式文件
    *  js 放置脚本文件
    *  images 放置图片文件
    *  slice 放置雪碧图切片
    *  media放置音频、视频等文件

## 注意事项
##### 一、html引入的css、js都要以`<!-- build:css/js --><!-- endbuild -->`包裹否则在build时不会被打包到dist文件
如下：
```javascript
// 单个文件也需要包裹
  <!-- build:css ../css/style-base.css -->
    <link href="../css/style-base.css" rel="stylesheet">
  <!-- endbuild -->

// 包含多个文件，则会进行合并
  <!-- build:js ../js/app-share.js -->
    <script src="../js/appshare/appShare.bundle.js"></script>
    <script src="../js/appshare/jsbridge3.1.4.js"></script>
  <!-- endbuild -->
```

##### 二、sass入口文件
sass所有入口文件统一以“`style-*`”开头，gulp也只会编译“`style-*.scss`”开头的文件

##### 三、支持ES6
目前仅编译js目录下的脚本，在html行内编写的脚本请用回es5

##### 四、html文件支持EJS模版语法
具体使用请 [查看官网](http://www.embeddedjs.com/)

##### 四、雪碧图使用
将雪碧图的切片统一放入`project/src/slice`文件夹，使用时则引用样式`sp-*` “*”为切片的文件名
关于生产多张雪碧图（避免单一雪碧图文件过大）：
在`project/src/slice`文件夹下通过文件夹来分类切片文件，每个文件夹生产一张雪碧图；引用的样式名为: `sp-文件夹名-*`

##### 五、关于自定义项目模版
创建项目时会自动生成一个项目模版，可修改`templates/project.zip`文件定制自己的项目模版；也可在`templates`文件下创建模版压缩包，在创建项目时`node create -n 项目名称 -t 模版名称`来创建指定的模版项目；