---
layout: post
title:  CocoaPods
categories: ios
tags:
author: kongkongye
---

* content
{:toc}

Objective-C的依赖管理器,用来管理项目引用的第三方库




## 介绍
[官网](https://cocoapods.org/)

它是用Ruby写的,因此需要使用`gem`来安装:
```
sudo gem install cocoapods
```

可以在项目根目录内使用指令`pod init`来智能创建`PodFile`,里面会自动设置一些默认值.

然后使用指令`pod install`来安装依赖

在这之后,请永远使用`App.xcworkspace`来打开项目,而不是之前的`App.xcodeproj`

然后就可以导入依赖了,如:
```
#import <Reachability/Reachability.h>
```
