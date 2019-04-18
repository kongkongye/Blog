---
layout: post
title:  Mysql学习笔记
categories: mysql
tags: mysql 学习 笔记
author: kongkongye
---

* content
{:toc}

里面放置一些零碎的mysql知识/注意事项等.




## mysql锁
### 类型
1. `共享锁(Shared Lock, 也叫S锁,读锁)`: 多个事务可以同时为一个对象加共享锁
2. `排他锁(Exclusive Lock, 也叫X锁,写锁)`: 如果一个事务给对象加了排他锁,其它事务就不能加任何锁了

### 粒度/级别
1. `表级`: 开销小, 加锁快;不会出现死锁;锁定粒度大,发生锁冲突的概率最高,并发度最低.
2. `页级`: 开销和加锁时间界于表锁和行锁之间;会出现死锁;锁定粒度界于表锁和行锁之间,并发度一般.
3. `行级`: 开销大, 加锁慢;会出现死锁;锁定粒度最小,发生锁冲突的概率最低,并发度也最高.

mysql显著的特点是不同的存储引擎支持不同的锁机制。
比如，MyISAM和MEMORY存储引擎采用的是表级锁（table-level locking）；
BDB存储引擎采用的是页面锁（page-level locking），但也支持表级锁；
InnoDB存储引擎既支持行级锁（row-level locking），也支持表级锁，但默认情况下是采用行级锁。

## 关于逻辑删除与唯一索引冲突
物理删除/真删除/硬删除: 使用delete语句删除

逻辑删除/假删除/软删除: 增加is_deleted字段

一般业务数据都使用逻辑删除,一些临时数据/无价值数据/无意义数据可以使用真删除

逻辑删除会导致唯一索引冲突,解决方式:

1. 放弃使用mysql(不靠谱方案),比如sql server就不会有这个问题
2. 增加delete_token字段,并将其加入唯一索引中,删除时更新此字段为32位的uuid.但mysql中唯一索引长度是有限制的(innodb是737bytes),此字段会占据128bytes
3. 修改is_deleted字段类型与id字段相同,删除时将id赋值进去,并将其加入唯一索引(推荐方式)
4. 新建另一张结构相同的表,转移删除的数据到另一张表(缺点多多,不推荐)

## 事务ACID
* 原子性(Atomic): 全部成功或全部失败
* 一致性(Consistent): 事务保证数据库整体数据的完整性与业务数据的一致性
* 隔离性(Isolated): 事务互不影响
* 持久性(Durable): 事务完成后改动持久化

## MySQL的复制原理以及流程
1. 主：binlog线程——记录下所有改变了数据库数据的语句，放进master上的binlog中；
2. 从：io线程——在使用start slave 之后，负责从master上拉取 binlog 内容，放进 自己的relay log中；
3. 从：sql执行线程——执行relay log中的语句；

## join
![](http://wxb.github.io/images/mysql/01.jpg)

* 默认的join是指`inner join`
* mysql不支持`full join`,但可以通过`union`关键字合并`left join`与`right join`来模拟`full join`
* 对于所有的连接类型而言，就是将符合关键字 ON 后条件匹配的对应组合都成为一条记录出现在结果集中，对于两个表中的某条记录可能存在：一对多 或者 多对一 的情况会在结果集中形成多条记录，只是另外一个表中查询的字段信息相同而已；千万不要误以为：左外连接查询到的记录数是和左表的记录数一样，对于其他连接一样，不能形成这个误区。

### explicit/implicit inner join
explicit(显式) inner join:

```mysql
select * from
table a inner join table b
on a.id = b.id;
```

implicit(隐式) inner join:

```mysql
select a.*, b.*
from table a, table b
where a.id = b.id;
```

在mysql里,他们在性能上差不多

## mysql查询缓存
参考文章: [线上环境到底要不要开启query cache](https://www.kancloud.cn/thinkphp/mysql-faq/47450)

1. 查询缓存严格要求2次SQL请求要完全一样，包括SQL语句，连接的数据库、协议版本、字符集等
2. 很多场景查询缓存不适用
3. MySQL在从查询缓存中取回结果前，会先判断执行SQL的用户是否有全部库、表的SELECT权限，如果没有，则也不会使用查询缓存
4. 最重要的是,查询缓存是由一个全局锁在控制，每次更新查询缓存的内存块都需要进行锁定

因此,如果数据库基本上是只读的,可以再考虑开启查询缓存,否则可能性能反而会下降.

## explain

### type
效率比较: 

system>const>eq_ref>ref>fulltext>ref_or_null>index_merge>unique_subquery>index_subquery>range>index>ALL

## 语法与执行顺序

### 语法顺序
1. select [distinct]
2. from
3. join
4. on
5. where
6. group by
7. having
8. union
9. order by
10. limit

### 执行顺序
由优化器(optimizer)决定,不一定完全正确:

1. from
2. on
3. join
4. where
5. group by
6. having
7. select
8. distinct
9. union
10. order by