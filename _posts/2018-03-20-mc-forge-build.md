---
layout: post
title:  forge搭建教程
categories: 我的世界
tags:  forge 搭建 教程
author: kongkongye
---

* content
{:toc}

本文主要介绍如何搭建Forge开发环境,来进行我的世界PC端mod的开发.

我的世界官方并未提供进行mod开发的API,因此包括Forge在内的所有mod api都是非官方开发的.

除了Forge以外,其它的mod api还包括`Player API`,`LiteLoader`等,其中`Player API`目前已经成为Forge的附属,
而`LiteLoader`在流行程度,易用度,文档完善程度上面不如Forge,因此这里只进行使用Forge进行mod开发的研究.

这里说的Forge适用于我的世界java版(即PC版/电脑版),不适用于pe版(手机版)或其它版本.

如果需要更详细的文档,请查看 [Forge官方文档](https://mcforge.readthedocs.io/en/latest/) ([中文版](http://mcforge-cn.readthedocs.io/zh/latest/))




![](/imgs/2018-03-20-mc-forge-build/Forge搭建教程.png)

## 名词概念
* `MCP(Minecraft Coder Pack)`: [官方wiki](https://minecraft.gamepedia.com/Programs_and_editors/Mod_Coder_Pack),这是Minecraft反编译/反混淆代码工具包,虽然它违反了著作权法,但因为mod的制作基于对源代码的解析,因此mojiang一直是默许的.如果某个mc版本没有对应的MCP释放出来,就没法开发对应的mod.但是在Forge出来后,MCP已经逐渐没落.
* `FML(ForgeModLoader)`: 是`ModLoader`的代替品,作用就是加载mod,在一定程度上解决MOD冲突.虽然`FML`与`Forge`一直是一起发行的,但从代码角度,它们是独立的.
* `ForgeGradle`: 作用与MCP类似,反编译MC并准备开发环境.
* `Forge`: Minecraft Mod api库,提供了很多基础有用的api

## 搭建开发环境
1. `下载开发工具包`: 在[Forge官网](http://files.minecraftforge.net/)下载`Mdk`,里面包含了所有进行Forge开发需要的东西
2. `新建Forge项目`: 新建一个项目文件夹,将mdk内的`build.gradle`,`gradlew.bat`(windows),`gradlew`(\*inx),`gradle目录`复制过去
3. `初始化开发环境`: 在项目文件夹内运行`gradlew setupDecompWorkspace`,下载一些东西,用来反编译mc源码,构建mc与Forge等.(只需要进行一次,除非删除gradle缓存)
4. `导入项目`: 如果你用eclipse,运行`gradlew eclipse`;如果你用idea,选择导入`build.gradle`,然后运行`gradlew genIntellijRuns`.

## 开始开发
在下载的mdk的src文件夹内,有一个样例mod,你可以将它复制过来使用.

你可以修改`build.gradle`内的信息,包括`archivesBaseName`,`group`,`version`.

测试MOD: 初始化开发环境时,测试mod的配置(run config)一般会生成,你可以直接运行,会在`<runDir>`(默认为run)文件夹内运行.
或者使用`gradlew runClient`/`gradlew runServer`来运行

构建MOD: 运行`gradlew build`来构建mod,将在`build/libs`内生成`archivesBaseName-version.jar`文件.(这就是mod的jar文件,放到客户端的mods文件夹内就可以使用)

## Mod入口
新建一个类,添加`@net.minecraftforge.fml.common.Mod`这个注解,这就是mod的入口了.

类内可以添加几个FML的生命周期钩子函数,如:

* `FMLPreInitializationEvent`: 初始化前,可以进行如读取配置,注册方块,注册物品等
* `FMLInitializationEvent`: 初始化,可以进行如注册合成公式.同时也会在此阶段发送`FMLInterModComms`信息给其它MOD.
* `FMLPostInitializationEvent`: 初始化后,可以进行如与其它MOD交互等操作.

添加方法为:

```java
@EventHandler
public void init(FMLInitializationEvent event) {
}
```

## 安装mod
很多启动器可能内置了Forge的mod安装功能,此时看启动器的提示就可以了,不需要手动安装.

如果启动器没有内置mod安装功能,或者你希望手动安装mod,方法如下:

1. 找到`.minecraft`文件夹,一般在启动器里可以设置.
2. 对于新版的Forge来说,安装mod只需要简单地将mod的jar文件放入`.minecraft`文件夹内的`mods`文件夹.

## 重要文件
### mcmod.info
这个文件可以定义mod的信息,这些信息通常会在客户端的mod列表内展示给用户.
而且一个mcmod.info文件可以定义若干个mod的信息.

如果`@Mod`注解内的`useMetadata`属性为true,则将使用mcmod.info内的属性覆盖注解内的值.

## 常见问题
#### Forge下载文件慢?
Forge安装后第一次使用会联网下载一些必要的文件到`.minecraft/lib`文件夹或`.minecraft/libraries`文件夹下.
因为Forge官网是国外的,因此可能下载会很慢,这时,你只能从其它地方复制这些文件.

#### 初始化开发环境失败,提示'GC overhead limit exceeded'?
这是内存不足的意思,在反编译MC时可能会出现,添加`org.gradle.jvmargs=-Xmx2G`到`~/.gradle/gradle.properties`(全局属性),指定最大使用2g内存来运行gradle程序.

#### 安装Forge提示no launcher profile?
大致有两种解决办法:

1. 运行一次正版启动器(无需登录)
2. 在`.minecraft`文件夹内新建`launcher_profiles.json`文件,内容为:

        {
          "selectedProfile": "Default",
          "profiles": {
              "Default": {
                  "name": "Default",
                  "allowedReleaseTypes": [
                      "snapshot",
                      "release"
                  ]
              },
          },
          "clientToken": "1fa242a6-0cbc-4d50-a5db-7fb59f6bc344"
        }
