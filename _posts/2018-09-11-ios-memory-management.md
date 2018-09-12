---
layout: post
title:  IOS内存管理
categories: ios
tags:
author: kongkongye
---

* content
{:toc}

IOS内存管理




## 关于(un)retained return value
这两个都是针对函数返回`对象指针`的情况:

* `retained return value`: 调用者拥有返回值,负责释放
* `unretained return value`: 调用者不拥有返回值,不负责释放

比如函数内new了一个对象并返回.

## ARC

### 变量标识符
ARC模式引入了几种与内存管理有关的`变量标识符`:

* `__strong`(默认)
* `__weak/__unsafe_unretained`: 在对象回收后自动设置为nil,新版本请用__weak
* `__autoreleasing`: 用以指示以引用（id*）传入的参数并在return后自动释放

关于隐性的默认值:

* `NSString * param`的默认变量标识符是`__strong`,
* `NSString ** param`作为声明时编译器会报错,必须明确指定变量标识符,如`NSString * __strong * param`
* `NSString ** param`作为方法参数时,默认标识符是`__autoreleasing`(这个要注意!)

变量标识符严格上来说应该放在`*`与`变量名`之间,如`NSNumber * __strong num = @(3);`(放其它地方编译器可能也不会报错)

### 属性标识符
ARC模式引入了几种与内存管理有关的`属性标识符`,使用如`@property (strong) Number* num`:

* `assign`(基本数据类型时的默认值): 表示单纯的复制,通常用于基本的数值类型如NSInteger与CGFloat
* `retain/strong`(strong是对象类型时的默认值): 作用都是强引用,strong是新引入的,语意上比retain更好.当给属性设定一个新值的时候，首先这个值进行 retain ，旧值进行 release ，然后进行赋值操作
* `weak/unsafe_unretained`: 在对象回收后自动设置为nil,新版本请用__weak
* `copy`: 为实例变量保留一个自己的副本

### ARC模式下什么时候需要把变量置为nil?
通常在使用`block`时,用于破除retain cycle(引用循环),如:

```objc
MyViewController * __block myController = [[MyViewController alloc] init…];
// ...
myController.completionHandler =  ^(NSInteger result) {
    [myController dismissViewControllerAnimated:YES completion:nil];
    myController = nil;
};
```

### 使用`__autoreleasing`
对象指针赋值时,所有权修饰符必须一致

以下会编译错误:
```objc
NSError *error = nil;// 默认修饰符是 __strong
NSError **pError = &error;// 必须明确指定修饰符
```

以下才是正确的:
```objc
NSError *error = nil;
NSError *__strong *pError = &error;
```

但是以下代码却能正确运行:
```objc
NSError *error = nil;
[myObject performOperationWithError:&error];
```
方法声明为`- (BOOL)performOperationWithError:(NSError *__autoreleasing *)error2;`

原因是编译器会重写代码,增加临时变量:

```objc
NSError *error = nil;
NSError __autoreleasing *tmp = error; //此处为对象赋值
BOOL result = [obj performOperationWithError:&tmp];//传参时的动作才是对象指针赋值，需要保证所有权修饰符一致
error = tmp; //此处为对象赋值
```

那么,什么时候使用`__autoreleasing`呢?
一般来说只在方法参数中使用,而且也不需要手动指定,让编译器自动加就好了.

简单的说就是,变量标识符其实就`__strong`与`__weak`,至于`__autoreleasing`只是objc搞出来专门给以引用传入的方法参数用的.

## @autoreleasepool
即使用了ARC,`@autoreleasepool`仍然是可以用的.

默认情况下,整个应用外面(在main.m内)有个`@autoreleasepool`,但你可以在里面添加更多.

有什么用?当然是优化性能,一般用在一个大的循环中,如:

```objc
- (void)useALoadOfNumbers {
    for (int j = 0; j < 10000; ++j) {
        @autoreleasepool {
            for (int i = 0; i < 10000; ++i) {
                NSNumber *number = [NSNumber numberWithInt:(i+j)];
                NSLog(@"number = %p", number);
            }
        }
    }
}
```

(但是又有言论称编译器已经做了优化,用跟不用效果差不多...后续继续观察吧)

## 引用循环
很简单,就比如A引用B,B引用A,就引用循环了,这样就没法释放了.

破除引用循环可以从以下几点入手:

1. 注意变量作用域,使用autorelease让编译器来处理引用
2. 使用弱引用(weak)
3. 当实例变量工作完成后,置为nil
