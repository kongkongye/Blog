---
layout: post
title:  IOS消息传递机制
categories: ios
tags:
author: kongkongye
---

* content
{:toc}

IOS消息传递机制




## KVO
`key-value observing`

当一个对象的某个属性值发生了改变,可以通知这些值的观察者.

## Notification
适合在两部分不相关的代码中传递消息,可以对消息进行广播(单向).

## delegation
可以通过返回值的形式给发送者作出回应,适合在两个相对接近的模块间传递消息.

## block
可以使可读性更强,但要注意避免发生retain环

## target-action
主要用于响应用户界面事件,但不能携带自定义的信息.
