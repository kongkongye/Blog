---
layout: post
title:  java代理及在spring中的应用
categories: java
tags: java 代理
author: kongkongye
---

* content
{:toc}

本文主要研究java代理与spring代理.
通常我们说的代理可以分类如下:

* 动态代理
    * JDK动态代理
    * CGLIB动态代理
* 静态代理
    * AspectJ




## 前言: 设计模式之代理模式
代理模式是设计模式的一种,它是一种结构型模式.

它不改变接口,主要起到中介,控制的作用

### 例子: 用户Dao添加事务支持
1. 接口: UserDao
2. 默认实现: UserDaoImpl
3. 代理实现(可以添加事务支持): UserDaoProxy

代码实现:

用户DAO: 

```java
/**
 * 用户DAO
 */
public interface UserDao {
    /**
     * 保存
     */
    void save();
}
```

默认实现:

```java
/**
 * 用户DAO实现
 */
public class UserDaoImpl implements UserDao{
    @Override
    public void save() {
        System.out.println("保存.");
    }
}
```

代理实现:

```java
/**
 * 用户DAO代理
 */
public class UserDaoProxy implements UserDao{
    private UserDao userDao;

    public UserDaoProxy(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void save() {
        System.out.println("开始事务~");
        userDao.save();
        System.out.println("结束事务~");
    }
}
```

测试类:

```java
public class UserDaoTest {
    public static void main(String... args) {
        //目标对象
        UserDao userDao = new UserDaoImpl();
        //代理对象
        UserDaoProxy userDaoProxy = new UserDaoProxy(userDao);
        userDaoProxy.save();
    }
}
```

运行结果:

```
开始事务~
保存.
结束事务~
```

## JDK动态代理
jdk的动态代理调用了`Proxy.newProxyInstance(ClassLoader loader,Class<?>[] interfaces,InvocationHandler h)`方法.
通过此方法生成字节码动态创建一个类.

### 例子: 用户Dao添加事务支持
1. 接口: UserDao
2. 默认实现: UserDaoImpl
3. 代理调用处理器: UserDaoInvocationHandler
4. 生成代理

代码实现:

用户DAO: 

```java
/**
 * 用户DAO
 */
public interface UserDao {
    /**
     * 保存
     */
    void save();
}
```

默认实现:

```java
/**
 * 用户DAO实现
 */
public class UserDaoImpl implements UserDao{
    @Override
    public void save() {
        System.out.println("保存.");
    }
}
```

代理调用处理器:

```java
/**
 * 调用处理器
 */
public class UserDaoInvocationHandler implements InvocationHandler {
    private UserDao target;

    public UserDaoInvocationHandler(UserDao target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("开始事务~");
        Object result = method.invoke(target, args);
        System.out.println("结束事务~");
        return result;
    }
}
```

测试类:

```java
public class UserDaoTest {
    public static void main(String... args) {
        //目标对象
        UserDao userDao = new UserDaoImpl();
        //代理对象
        UserDao userDaoProxy = (UserDao) Proxy.newProxyInstance(userDao.getClass().getClassLoader(), userDao.getClass().getInterfaces(), new UserDaoInvocationHandler(userDao));
        userDaoProxy.save();
    }
}
```

运行结果:

```
开始事务~
保存.
结束事务~
```

## CGLIB动态代理
CGLIB是一个`代码生成包`,被很多AOP框架使用,为他们提供`方法的拦截`.
它通过ASM操纵字节码,生成指定类的子类,因此不能继承final类,也不能覆盖final方法.

### 例子: 用户Dao添加事务支持
1. 类: UserDao
2. 方法拦截器: UserDaoMethodInterceptor
3. 生成代理

代码实现:

用户DAO: 

```java
/**
 * 用户DAO
 */
public class UserDao {
    /**
     * 保存
     */
    public void save() {
        System.out.println("保存.");
    }
}
```

方法拦截器:

```java
/**
 * 方法拦截
 */
public class UserDaoMethodInterceptor implements MethodInterceptor {
    @Override
    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        System.out.println("开始事务~");
        Object result = methodProxy.invokeSuper(o, args);
        System.out.println("结束事务~");
        return result;
    }
}
```

测试类:

```java
public class UserDaoTest {
    public static void main(String... args) {
        UserDaoMethodInterceptor userDaoProxy = new UserDaoMethodInterceptor();

        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(UserDao.class);
        enhancer.setCallback(userDaoProxy);

        //生成UserDao的子类
        UserDao userDao = (UserDao) enhancer.create();

        userDao.save();
    }
}
```

运行结果:

```
开始事务~
保存.
结束事务~
```

## AspectJ
AspectJ是一个java实现的aop框架,需要使用专门的编译器在编译时织入代码.

### 与动态代理的区别?
静态代理需要用指定的编译器在编译时织入,因此无法应用到已经打包好的jar包内,但代码执行效率相对更高.
动态代理是运行时生成的代理,因此没有上面的限制,但相对效率更低.

## spring aop
spring aop使用动态代理,基本规则如下: 

1. 如果被代理对象实现了需要被代理的接口,则使用JDK动态代理
2. 其他情况使用CGLIB动态代理
3. 可以配置总是使用CGLIB动态代理

### 配置总是使用CGLIB的方式
可以通过java配置`@EnableAspectJAutoProxy(proxyTargetClass = true)`,proxyTargetClass默认值为false,改为true后对接口也会使用CGLIB动态代理

### jdk代理与cglib比较
* jdk代理需要有`接口`才能使用
* cglib不能对`final类`进行继承,也不能覆盖`final方法`
* 性能上,创建性能jdk比cglib高,运行性能jdk比cglib低(但从jdk6,7,8,jdk代理的性能得到了显著提升,而cglib的表现并未跟上)
* jdk动态代理是jdk支持的,cglib动态代理是在spring-core包中
* 在spring4.0前,cglib代理方式需要生成被代理的类实例与代理子类实例,因此构造方法将被调两次,但4.0后,spring使用`Objenesis`来避免生成代理实例时调用构造方法,因此构造方法会正常的调用一次

### spring aop在spring事务管理中的应用
spring事务管理建立在spring aop机制上,是spring aop机制的典型应用.

spring允许使用aspectj注解用于定义,但并不使用aspectj的编译器或织入器,底层依然使用spring aop

为了启用spring对@AspectJ配置的支持,需要添加`@EnableAspectJAutoProxy`

### spring aop中调用自身方法无法拦截
由于spring aop的代理机制,被代理的对象内方法调用内部的方法是无法拦截的.

spring aop代理机制会生成一个被代理的对象实例,再生成一个代理对象实例,像注入都是注入的代理对象,
因此如果从外部代理对象开始调用,那么可以被aop拦截,但在被代理对象方法内调用自身方法,this指向的是被代理对象,因此aop无法拦截

如何解决?

1. 重构代码,确保不会调用自身方法
2. 注入类自身,如在UserService里`@Autowired private UserService self;`
3. 使用`((Pojo) AopContext.currentProxy()).xxx();`(不推荐,spring框架代码侵入,还需要代理配置expose proxy)

(提示: aspectj不会有这个问题)