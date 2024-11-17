### 如何开发一个脚手架

1、npm init -y 初始化项目，在bin字段里面添加脚本路径，key是脚本名字，value是脚本路径
2、创建bin/cli.js 脚本文件
3、npm link 全局
4、新开一个项目，然后测试脚本




#### 用到的命令

npm link
npm list -g --depth=0
npm unlink
echo $PATH


### 踩坑记录
1、require is not defined
require 跟 export 不能混用，一种是commonjs 一种是ESM
