---
layout: post
title:  create-react-native-app
categories: js
tags:  react native
author: kongkongye
---

* content
{:toc}

create-react-native-app项目可以让你不用安装xcode或android studio环境.




## 快速使用
1. 安装`create-react-native-app`,使用命令`npm install -g create-react-native-app`
2. 新建项目,使用命令`create-react-native-app 项目名`
3. 运行项目,在项目目录下使用命令`npm start`

## 弹出来
弹出不可回退,因此官方强烈推荐使用`git`.

使用方法为运行`npm run eject`

### 为什么?什么时候需要?
1. 使用了需要用到`react-native link`操作的库
2. 写native code(本地代码)
3. 构建应用发布到app store或play store

### 弹出位置
1. ExpoKit

    如果使用了`Expo API`里的接口,则需要使用此方式.

    好处是发布后,仍然可以用js来编码,项目不用改动.
    并且不用手动打包,可以使用expo提供的服务来打包.

    发布方法也很简单,先安装exp命令行工具`npm i -g exp`,然后使用`exp publish`来发布

2. React Native

    弹出后变为原生代码,然后可以使用`xcode`或`android studio`来开发.
