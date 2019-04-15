---
layout: post
title:  Spring学习笔记
categories: spring
tags: spring 学习 笔记
author: kongkongye
---

* content
{:toc}

里面放置一些零碎的spring知识/注意事项等.




## spring特点
* `IOC`/`DI`
    * `IOC`(Inversion of Control, 控制反转): 是面向对象编程中的一个设计原则,意在降低代码耦合度
    * `DI`(Dependency Injection, 依赖注入): 这是IOC的常用方式(其它的比如还有`依赖查找`方式)
        * 基于接口
        * 基于set方法
        * 基于构造函数
        * 基于注解
* `AOP`(面向切面)

## spring请求处理流程
1. 找到`HandlerMapping`,得到`HandlerExecutionChain`(就是handler+若干HandlerInterceptor)

    简单的说,就是根据请求找到对应的处理器(handler)

    具体逻辑为: 遍历所有注册的HandlerMapping,直到返回HandlerExecutionChain

    HandlerMapping的具体实现会根据请求来查找处理器,找到就返回.
    Spring默认会注册以下两个HandlerMapping:

    1. `BeanNameUrlHandlerMapping`: bean名与url匹配映射
    2. `RequestMappingHandlerMapping`: 根据有`@Controller`注解的类内的`@RequestMapping`来匹配映射

2. 找到`HandlerAdapter`,得到`ModelAndView`

    简单的说,就是根据处理器(handler)找到对应的适配器(HandlerAdapter),然后进行处理得到结果(ModelAndView)

    具体逻辑为:

    1. 遍历所有注册的HandlerAdapter直到找到能处理此handler的(通过调用HandlerAdapter的`boolean supports(handler)`方法)
    2. 然后进行处理得到ModelAndView(通过调用HandlerAdapter的`ModelAndView handle(request, response, handler)`方法)

    比如`RequestMappingHandlerAdapter`可以处理`HandlerMethod`这个handler(内部会调用相应方法),并产生ModelAndView输出

    PS: 为什么不直接调用handler?因为handler是Object类型的,具体实现可以是任意的类型,因此没法直接调用.
    而需要一个能处理它的HandlerAdapter来调用,大部分HandlerAdapter通过handler的类型来判断是否能够处理.

3. 解析`ModelAndView`,得到`View`并渲染返回

    具体逻辑为:

    1. 如果ModelAndView内包含`viewName`(即内部view字段的类型为String),那么就会遍历所有注册的`viewResolver`来解析出view
    2. 如果ModelAndView内直接包含view,则直接解析view

    PS: View内带有渲染的方法

## AOP/代理
### 分类
1. `静态代理`: 在编译阶段生成AOP代理类,也称为编译时增强,如`AspectJ`
2. `动态代理`: 在运行时借助`JDK动态代理`,`CGLIB`等在内存中临时生成AOP动态代理类,也称为运行时增强

### Spring AOP 底层实现
* 如果类实现了`InvocationHandler`接口,则使用`JDK动态代理`,为你生成代理对象.
* 如果类没有实现上述接口,则使用`CGLIB动态代理`,生成代理对象.

## Spring Boot
约定优于配置:

1. 有约定的默认值
2. 可以自定义配置