---
permalink: /posts/mybatis-ping
layout: post
title:  Mybatis的ping机制
categories: sql
tags:
---

* content
{:toc}

Mybatis的ping机制




通过以下配置:

    <property name="poolPingEnabled" value="true"/>
    <property name="poolPingQuery" value="select now()"/>
    <property name="poolPingConnectionsNotUsedFor" value="6000"/>

可以开启mybatis的自动重连

### 误区
之前以为poolPingConnectionsNotUsedFor配置为6000后,当与数据库没有query请求(即连接idle了),则每6秒就会ping数据库一次,以此来保持连接
以下是测试:
* 将数据库超时设置为10秒,即连接idle超过10秒后自动关闭连接
* mybatis设置poolPingConnectionsNotUsedFor为20000,即每20秒ping一次
* 然后mybatis连接数据库,在连接idle超过10秒后,再query数据库,mybatis打印以下信息:

    2016-07-03 09:34:50  [WARN] Execution of ping query 'select now()' failed: Communications link failure
    The last packet successfully received from the server was 33,895 milliseconds ago.  The last packet sent successfully to the server was 15 milliseconds ago.

就以为连接失败了,mybatis的ping并未生效,但实际不是

### 正确
mybatis的ping只可能在正常query数据库前发出,
比如poolPingConnectionsNotUsedFor设置为60000(即60秒),然后请求idle了超过60秒,那么下次正常query数据库时,mybatis会先ping一下(即query数据库"select now()"语句,语句是配置中设置的),**如果连接断了就会自动重连**,紧接着才是正常是query,这样正常的query就不用担心连接断开的情况.

至于上面mybatis打印的`Execution of ping query 'select now()' failed`信息,实际上可以忽略,它实际表示mybatis的ping失败了,然后mybatis自动重连了(虽然自动重连没有打印信息),什么时候会发生呢?比如数据库超时时间设置为50秒,mybatis的ping设置为30秒,在连接idle了60秒时,再query数据库时就会出现.

### 注意
poolPingConnectionsNotUsedFor的值不能超过数据库的超时断开连接的时间

比如设置为60秒,数据库50秒就断开连接,那么一个连接idle了55秒,已经被数据库断开,但mybatis以为没断,下次mybatis正常query数据库时,就不会先ping一下,那样就会报连接已断开错误(也不会自动重连).
