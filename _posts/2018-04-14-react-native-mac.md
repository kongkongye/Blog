---
layout: post
title:  在mac下为ios进行react native开发
categories: js
tags:  react native
author: kongkongye
---

* content
{:toc}

react native




## 安装依赖
1. `Node`,`Watchman`: 推荐使用[HomeBrew](https://brew.sh/)来安装

    ```bash
    brew install node
    brew install watchman
    ```

    Watchman用来监控文件改变

2. `React Native CLI`: 使用命令:

    ```bash
    npm install -g react-native-cli
    ```

3. `Xcode`: 比如通过`mac app store`来安装,会同时安装ios模拟器各其它必要的构建ios应用的工具

    同时,你可能需要安装`Xcode Command Line Tools`,方法为在Xcode里打开`Preferences`,在`Locations`选项卡下选择.

## 快速使用
1. 新建项目,使用命令`react-native init 项目名`
2. 运行项目,在项目目录下使用命令`react-native run-ios`
