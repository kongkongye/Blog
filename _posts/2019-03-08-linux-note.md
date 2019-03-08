---
layout: post
title:  Linux学习笔记
categories: linux
tags: linux 学习 笔记
author: kongkongye
---

* content
{:toc}

里面放置一些零碎的linux知识/注意事项等.




## buffer与cache的区别
使用linux的top命令,可以显示buff/cache内存占用,linux会在内存不足时释放这种内存.

#### buffer缓冲区
类似于netty网络框架的buffer缓冲.

通常用在高速的`内存`与低速的`硬盘`或`网络`间,让数据积累一定的量再一次性读/写,可以减少io次数,提高效率.

#### cache缓存
类似于用redis做缓存来提高效率

缓存也是由两端速度不对等而出现的,同样是为了提高效率.

通常用在高速的`CPU`与低速的`内存`之间(CPU多级缓存),或高速的`内存`与低速的`硬盘`之间(磁盘缓存)

高速的那一方访问时先访问缓存,缓存没有再去访问低速的那一方并保存到缓存,这样来提高效率.
当然这是有命中率的.
