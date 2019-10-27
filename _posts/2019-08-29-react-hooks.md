---
layout: post
title:  react hooks到底是什么？
categories: js
tags: react hooks
author: kongkongye
---

* content
{:toc}

我眼中的react hooks




先看两段代码：

java：
```java
public class Demo {
    /**
     * 变量
     */
    public String state;

    /**
     * 构造函数
     */
    public Demo(String param1, String param2) {
    }

    /**
     * 方法
     */
    public void method() {
        //做一些事
    }
}
```

js：
```js
export default function useDemo(param1, param2) {
  /**
   * 变量
   */
  const [state, setState] = useState()

  /**
   * 方法
   */
  const method = useCallback(() => {
    //做一些事
  }, [])

  return {state, method}
}
```

## 面向对象
其实，hooks就是类似面向对象的封装。
所谓封装，顾名思义就是把相关的`变量`与`逻辑`写在一起，在java里是类，在hooks的角度就是hook函数。

> 封装体接受输入，产生输出，逻辑在内部处理。

在java里，new实例时，输入从构造函数传入，输出就是你可以访问实例暴露的变量与方法，私有方法可以包含业务逻辑；在hooks里，调用函数可以输入参数，函数返回可以返回想要暴露的变量与方法，函数内部可以包含业务逻辑，跟java一样一样的，虽然实现方式比较新奇。

## 全局状态
hooks这种奇怪的调用方式，没法实现全局状态！
变量最终都是用`useState()`来实现的，你需要配合使用比如`redux`来实现全局状态。
奇怪的方式毕竟会有不足~

## 与js的new方式比较
```js
export default function Demo(param1, param2) {
  /**
   * 变量
   */
  this.name = param1

  /**
   * 方法
   */
  this.method = () => {
    //做一些事
  }
}
```
使用时`new Demo()`生成实例，这种方法看着跟java更接近，输入输出内部逻辑也都正常。
但最大区别在于，hooks方式你不需要用到`this`这个磨人的小妖精了！可以节省脑细胞不用去思考`this`是否会产生bug。这跟java里的this不同，在java里使用this并不会有任何可能产生误解的地方。
而且hooks有自己的使用方式，并不能用这种方式替代。

## 限制
用hooks，你要遵守它独特的写法，不能当做普通的js随心所欲地写，比如：
1. 内部方法要用`useMemo()`或`useCallback()`，而不能直接定义！
2. 内部耗时的变量要用`useMemo()`记录下来，避免每次调用都重新计算！
3. 成员变量用`useState()`，局部变量可以简单的用`let`/`const`
