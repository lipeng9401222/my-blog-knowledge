---
title: jar包模式启动
sidebar: auto
collapsable: true
---

# jar包模式启动



|| 时间 | 作者 | 备注 |
|| :-----: | :-----:| :------: |
|| 2024-9-18  | 张剑峰 | 初稿 |
|| 2024-9-19  | 陆祎炜 | 完善了直接使用Jar包创建开发工程的步骤以及jar包模式切换指南 |
|| 2024-9-29  | 张剑峰 | 将war包升级jar包指南移到文档尾部、并对内容做核对精简。 |
|| 2024-10-9  | 张剑峰 | 将war包升级jar包指南拆分到独立的升级指南中，本文仅保留jar包模式启动的内容；新增工程配置章节。 |
|| 2025-7-10  | 陆祎炜 | 新增常见问题FAQ，包含静态资源访问性能优化等内容 |


- 传统的Java Web应用，通常使用[[war包模式](https://fdoc.epoint.com.cn/onlinedoc/rest/d/JfIRBz "war包模式")](?file=012-快速入门/006-启动项目/005-war包模式启动)进行部署。随着Spring Boot的出现、前后端分离架构以及微服务理念的盛行，后端服务采用jar包模式部署正趋于主流；
- 如果你的应用是war包模式要做升级，可以参照这篇文档进行改造[[jar包模式升级指南](https://fdoc.epoint.com.cn/onlinedoc/rest/d/eqQ3am "jar包模式升级指南")](?file=010-项目介绍/090-升级指南/999-jar包模式升级指南)；
- 在启动项目之前，需要确保[[环境安装](https://fdoc.epoint.com.cn/onlinedoc/rest/d/A3YRVf "环境安装")](?file=012-快速入门/001-安装环境)都到位了；

## 下载开发包

- 如果是全新开发项目，可以直接使用最新的[jar包分支](http://192.168.0.200/frame-public-group/epoint-web) <font color="red">dev/jar-launcher</font> ，并且参照下文中的<a href="#启动项目">启动项目</a>步骤进行启动。
- 启动项目需要的数据库如何准备、以及启动项目后如何登录访问系统，可以参见[[war包模式启动](https://fdoc.epoint.com.cn/onlinedoc/rest/d/JfIRBz "war包模式启动")](?file=012-快速入门/006-启动项目/005-war包模式启动)中的章节。

## 工程配置
### 部署包路径配置
- 原先war包模式，我们会在部署包下设置一些文件夹目录用作业务使用，比如epointtemp这样一个[[临时目录](https://fdoc.epoint.com.cn/onlinedoc/rest/d/ame6vy "临时目录")](?file=015-核心框架/010-框架配置/999-临时目录)，当使用jar包模式运行时，可以在jar包同级路径下创建一个同名文件夹，当作部署路径。
- 比如要运行epoint-web.jar，可以在同路径下创建epoint-web文件夹即可：

![20241009-1e12d58c.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=bcf90991-6f62-4b80-b465-090d7257ee69)

### 端口和上下文名称配置
- jar包模式运行下的应用程序端口和上下文都在application.properties中进行配置：

![20241009-75b1465a.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=34db462e-014b-4f13-ad7b-29c8bd7ae516)


## 启动项目

### eclipse启动

菜单栏选择 run >run/debug configurations ->  选择 Java Application -> 选择Project ->  输入main class：`com.epoint.FrameEsfApplication` -> 点击 Apply -> 点击 Run/Debug
<font color="red">注意：main class 处直接输入，不要使用Search功能，会搜索不到</font>

如图参考

![2024-09-19-10-17-42.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=964237f2-a544-4dae-a4fc-94376b5e2652)



### idea启动

点击 Edit Configurations -> 点击 + -> 选择 Spring Boot -> 选择应用 -> 输入 main class （com.epoint.FrameEsfApplication） ->  点击 Run

如图参考，启动项使用 `com.epoint.FrameEsfApplication`

![2024-09-19-10-18-09.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=d7bcc637-0ebf-4ad9-96dc-e4559df54d32)



### 命令行启动

使用mvn clean install 打包，然后启动jar包。

启动jar包命令为 java -jar xxx.jar

## 常见问题 FAQ

### Q1: Jar包模式访问静态资源很慢怎么办？

**问题描述：**
在Fat JAR模式下，访问静态资源页面会出现明显的延迟，特别是首次访问或间隔一段时间后再次访问。

**问题原因：**
这是由于内置Tomcat在处理静态资源时，会扫描大的JAR包导致耗时。具体来说：

- Tomcat使用`JarWarResourceSet`来处理JAR包内的资源
- 默认情况下，Tomcat的`backgroundProcessorDelay`参数为10秒，每10秒会刷新一次资源缓存
- 在刷新缓存时，Tomcat会重新扫描JAR包，对于大型Fat JAR包会造成性能问题

**解决方案：**
在`application.properties`中添加以下配置：

```properties
#禁用Tomcat后台处理器的定期刷新，避免重新扫描JAR包
server.tomcat.background-processor-delay=-1
```

**配置说明：**

- `server.tomcat.background-processor-delay=-1`：设置为-1表示禁用后台处理器的定期执行
- 这样可以避免Tomcat定期重新扫描JAR包，从而提升静态资源访问性能
- 缓存将在首次访问后建立，并且不会被定期清理

**注意事项：**

1. **该配置仅对嵌入式Tomcat生效**，不会影响外部Tomcat容器的配置
2. **War包模式部署**时，该配置通常不会产生影响，因为外部Tomcat使用`server.xml`进行配置
3. **禁用后台处理器**可能会影响一些依赖定期清理的功能，但对大多数应用影响很小
4. **开发环境**建议保持默认配置，**生产环境**可以根据实际情况调整

### Q2: 这个配置对War包模式有影响吗？

**回答：**
通常没有影响。原因如下：

1. **配置作用域**：`server.tomcat.background-processor-delay`是Spring Boot特有的配置，主要作用于嵌入式Tomcat
2. **外部Tomcat配置**：War包部署到外部Tomcat时，容器配置通过`server.xml`中的`backgroundProcessorDelay`属性控制
3. **资源处理差异**：外部Tomcat处理War包资源的方式与嵌入式Tomcat处理Fat JAR的方式不同，通常不会出现同样的性能问题

**相关参考：**

- [Apache Tomcat配置参考](https://tomcat.apache.org/tomcat-9.0-doc/config/engine.html)
- [Spring Boot服务器配置](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
