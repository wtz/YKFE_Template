# YKFE_Template
前端工作流前端模板

## 缘起
每次开启一个新的前端项目,总是copy之前的项目代码然后改来改去，容易出错，并且项目代码冗余。针对公司业务特点及后端php框架。特开发此项目模板。
结合ykfe（npm install ykfe -g） 命令行。会自动生成项目需要的目录结构及自动生成php模板文件,提高开发效率。

## 该框架的功能点：
 * 支持类似sass 功能 css 变量 
 * 支持css spreite 自动合图
 * 支持静态资源压缩并自动分页面打包功能
 * 支持更新静态资源缓存	
 * 支持开发server 接口方向代理
 * 支持数据接口mock，无需等待后端接口开发完成
 * 支持及时刷新功能，无需手动刷新看效果 ok
 * 整合PC端iframe 登录逻辑，及注销逻辑
 * 社交分享组件-(百度分享)
 
 ## 如何使用(以pc端项目为例，h5端项目将参数pc改为h5即可)
  1. 安装nodejs version >= 8.9.4
  2. 安装npm包管理 version >=5.6.0
  3. 安装命令行工具 npm install ykfe -g 
  4. 初始化项目模板文件 ykfe init
  5. 开启开发server 进行开发调试 ykfe run pc
  6. 开发完成打包静态资源文件 上线前的操作 ykfe build pc

 ## 技术构架
  * node
  * gulp4  
  * postcss
  * commander
  
  
  
