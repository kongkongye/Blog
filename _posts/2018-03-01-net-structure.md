---
layout: post
title:  OSI网络模型
categories: 网络
tags:  网络 OSI 架构
author: kongkongye
---

* content
{:toc}

这里将介绍一下OSI(Open System Interconnect,意为开放式系统互联)七层网络模型.




## 模型

OSI七层模型 | 功能 | 协议 | 设备
---- | --- | --- | ---
应用层 | 文件传输，电子邮件，文件服务，虚拟终端 | TFTP，HTTP，SNMP，FTP，SMTP，DNS，Telnet |
表示层 | 数据格式化，代码转换，数据加密 | |
会话层 | 解除或建立与别的接点的联系 |  |
传输层 | 提供端对端的接口 | TCP，UDP | 四层交换机,四层路由器
网络层 | 为数据包选择路由 | IP，ICMP，RIP，OSPF，BGP，IGMP | 三层交换机,路由器
数据链路层 | 传输有地址的帧以及错误检测功能 | Ethernet, PPP, HDLC, SLIP，CSLIP, ARP，RARP，MTU, 帧中继(Frame Relay) | 网桥(现已很少使用),以太网交换机(二层交换机),网卡(其实网卡一半工作在物理层,一半工作在数据链路层)
物理层 | 以二进制数据形式在物理媒体上传输数据 | ISO2110，IEEE802，IEEE802.2 | 中继器,集线器,双绞线

注: 交换器主要在第二层,路由器主要在第三层.

## OSI模型与TCP/IP协议的区别?
TCP/IP协议只有5层(少了会话层与表示层),它的`应用层`对应OSI协议的`会话层+表示层+应用层`

开放式系统互联模型是一个参考标准，解释协议相互之间应该如何相互作用。
TCP/IP协议是美国国防部发明的，是让互联网成为了目前这个样子的标准之一。
