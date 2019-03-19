---
layout: post
title:  Spring Aop
categories: spring
tags:  spring aop
author: kongkongye
---

* content
{:toc}

spring aop(Aspect-oriented Programming)学习




## 适用场景
* 事务管理
* 记录日志

## spring aop相关概念
* `Aspect(方面)`: 横切多个类的一系列关系,spring的事务管理就是一个很好的例子.在spring aop内,方面使用xml方式+类或@Aspect+类实现
* `JoinPoint(连接点)`: 执行程序中的一个连接点,如方法的执行或异常的处理.在spring aop中,只有方法的执行这一个连接点
* `Advice(建议)`: 在特定连接点执行的动作.动作类型包含:
    * around: 功能最强大
    * before: 方法调用前运行,但无法阻止正常执行流除非抛出异常
    * after returning: 方法无异常正常返回时运行
    * after throwing: 抛出异常后运行
    * after finally: 方法退出后运行(无论正常还是异常退出)
* `Pointcut()`: 符合指定条件的连接点.通常与建议一起使用,如执行指定名字的方法时
* `Introduction`: 
* `Target Object(目标对象)`: 被一个或多个方面建议的目标对象(在spring内这总是一个代理对象)
* `AOP proxy`: AOP代理对象,在spring内是jdk动态代理或cglib动态代理
* `Weaving(编织)`: 连接方面与其他应用对象来创建被建议的对象.这个操作可以在编译时,加载时或运行时完成.在spring内是在运行时进行编织的.

## spring aop的能力与目标
使用纯java实现,不需要特殊的编译器,spring aop不准备提供最完整的aop功能,也不会与aspecj竞争,它的目标是提供aop与ioc的集成,来解决常见的企业应用问题.

## @AspectJ支持
### 开启@AspectJ支持
开启支持包含开启自动代理,自动代理指如果spring检测到一个bean上存在aspect,就会自动生成一个代理来拦截方法调用

* java方式: `@EnableAspectJAutoProxy`
* xml方式: `<aop:aspectj-autoproxy/>`

### 定义Aspect
在类上使用`@Aspect`注解(同时要加个如@Component注解,否则不会被spring自动搜索到)

### 定义Pointcut
Pointcut方法必须返回`void`

```java
@Pointcut("execution(* transfer(..))")// 字符串是pointcut表达式
private void method() {}// pointcut签名
```

spring aop支持以下PCD(pointcut designator):

* `execution`
* `within`
* `this`: 指代理对象
* `target`: 指被代理的原目标对象
* `args`
* `@target`
* `@args`
* `@within`
* `@annotation`
* `bean`: spring附加的,aspectj里没有

其他的aspectj的PCD不被spring aop支持

#### 组合Pointcut表达式
可用操作符: `&&`, `||`, `!`,如:

```java
@Pointcut("execution(public * *(..))")
private void anyPublicOperation() {} 

@Pointcut("within(com.xyz.someapp.trading..*)")
private void inTrading() {} 

@Pointcut("anyPublicOperation() && inTrading()")
private void tradingOperation() {} 
```

方法可见度不影响

#### 分享通用的Pointcut定义
推荐定义一个通用的结构类,如:

```java
@Aspect
public class SystemArchitecture {
    @Pointcut("within(com.xyz.someapp.web..*)")
    public void inWebLayer() {}

    @Pointcut("within(com.xyz.someapp.service..*)")
    public void inServiceLayer() {}
    
    @Pointcut("execution(* com.xyz.someapp..service.*.*(..))")
    public void businessService() {}
}
```

#### 注意事项
由于spring的代理机制,`target`内的方法是无法拦截的.
对于jdk动态代理,只有接口内的public方法可以被拦截.
对于cglib动态代理,public,protected,包可见的方法可以拦截.
但是,一般情况下应该只针对public方法添加拦截.

### 定义Advice
通常与Pointcut联系在一起,如:

```java
@Aspect
public class BeforeExample {
    @Before("com.xyz.myapp.SystemArchitecture.inWebLayer()")
    public void doWebCheck() {
    }
    
    /**
     * 同上
     */
    @Before("within(com.xyz.someapp.web..*)")
    public void doWebCheck() {
    }
    
    @AfterReturning(
        pointcut="com.xyz.myapp.SystemArchitecture.inWebLayer()",
        returning="retVal")
    public void doWebCheck(Object retVal) {
    }
    
    @AfterThrowing(
        pointcut="com.xyz.myapp.SystemArchitecture.inWebLayer()",
        throwing="ex")
    public void doRecoveryActions(DataAccessException ex) {
    }
    
    /**
     * after final
     */
    @After("com.xyz.myapp.SystemArchitecture.inWebLayer()")
    public void doReleaseLock() {
    }
    
    /**
     * 第一个参数必须是ProceedingJoinPoint
     */
    @Around("com.xyz.myapp.SystemArchitecture.inWebLayer()")
    public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
        // start stopwatch
        Object retVal = pjp.proceed();
        // stop stopwatch
        return retVal;
    }
}
```

#### Advice参数
advice可以将第一个参数定义为`org.aspectj.lang.JoinPoint`(around需要定义为JoinPoint的子类`ProceedingJoinPoint`)

其他参数定义如:

```java
@Before("com.xyz.myapp.SystemArchitecture.inWebLayer() && args(account,..)")
public void validateAccount(Account account) {
}
```

或:

```java
@Pointcut("com.xyz.myapp.SystemArchitecture.inWebLayer() && args(account,..)")
private void accountDataAccessOperation(Account account) {}

@Before("accountDataAccessOperation(account)")
public void validateAccount(Account account) {
}
```

以下PCD支持类似的方式: `this`,`target`,注解类的`@within`,`@target`,`@annotation`,`@args`,如:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Auditable {
    AuditCode value();
}

@Before("com.xyz.lib.Pointcuts.anyPublicMethod() && @annotation(auditable)")
public void audit(Auditable auditable) {
    AuditCode code = auditable.value();
    // ...
}
```

如果包含多个参数,需要设置argNames属性:

```java
@Before(value="com.xyz.lib.Pointcuts.anyPublicMethod() && target(bean) && @annotation(auditable)",
        argNames="bean,auditable")
public void audit(JoinPoint jp, Object bean, Auditable auditable) {
    AuditCode code = auditable.value();
    // ... use code, bean, and jp
}
```

如果参数只有一个,可以不设置,或者使用`-g:vars`进行编译,否则由于参数名擦除,在运行时spring可能抛出异常

#### advice顺序
1. 同一aspect,不同类型的advice运行在同一个join point,会按固定的优先级执行: 
    1. around前
    2. before
    3. 方法调用
    4. around后
    5. after
    6. after returning/after throwing
2. 不同的aspect的advice执行顺序可以用实现`org.springframework.core.Ordered`接口或添加`Order`注解来指定,返回值小的先执行.
3. 同一aspect,相同多个advice的执行顺序: 无法确定,解决方式:
    1. 将两个advice合并为一个
    2. 将两个advice放到不同aspect中
