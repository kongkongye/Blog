---
layout: post
title:  设计模式
categories: java
tags:  设计模式
author: kongkongye
---

* content
{:toc}

设计模式(Design Pattern)代表了**最佳实践**,通常适合**面向对象**开发时使用.
1994年出版的一本书中提到了面向对象设计原则: 对接口编程而不是对实现编程;优先使用对象组合而不是继承.




## 介绍
设计模式之间的关系:

![](/imgs/2018-03-23-design-patterns/relation.jpg)

## 六大原则
1. `开闭原则(Open Close Principle)`: 对扩展开放,对修改关闭.
2. `里氏代换原则(Liskov Substitution Principle)`: 任何基类可以出现的地方,子类一定可以出现.这是对开闭原则的补充.
3. `依赖倒转原则(Dependence Inversion Principle)`: 针对接口编程,依赖于接口而不依赖于具体实现.这是开闭原则的基础.
4. `接口隔离原则(Interface Seregation Principle)`: 使用多个隔离的接口比使用单个的接口好,降低类之间的耦合度.
5. `迪米特法则/最少知道原则(Demeter Principle)`: 一个实体应该尽量少与其它实体发生相互作用,使功能模块相对独立.
6. `合成复用原则(Composite Reuse Principle)`: 尽量使用合成/聚合的方式,而不是继承.

## 类型
### 创建型(Creational Patterns)
* 工厂模式
* 抽象工厂模式
* 单例模式(Singleton Pattern)
* 建造者模式(Builder Pattern)
* 原型模式(Prototype Pattern)

### 结构型(Structural Patterns)
* 适配器模式
* 桥接模式
* 过滤器模式
* 组合模式
* 装饰器模式
* 外观模式
* 享元模式
* 代理模式

### 行为型(Behavioral Patterns)
* 责任链模式
* 命令模式
* 解释器模式
* 迭代器模式
* 中介者模式
* 备忘录模式
* 观察者模式
* 状态模式
* 空对象模式
* 策略模式
* 模板模式
* 访问者模式

## 设计模式
### 工厂模式(Factory Pattern)

### 抽象工厂模式(Abstract Factory Pattern)
