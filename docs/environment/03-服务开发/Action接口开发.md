---
title: Action接口开发
sidebar: auto
collapsable: true
---

# Action接口开发



| 时间 | 作者 | 备注 |
| :-----: | :-----:| :------|
| 2024-12-6  | 张剑峰 | 初稿 |

- 本文讲述的是Action接口的基础开发内容，如果想要了解如何与页面对接整合，可以前往[[页面开发](https://fdoc.epoint.com.cn/onlinedoc/rest/d/jyUJnm "页面开发")](?file=012-快速入门/011-页面开发/010-页面开发[miniui])查阅；
- Action接口主要用于前端页面对接，不仅可以与PC浏览器页面对接，也可以与移动H5页面对接，相当于控制层；
- 在开发之前，需要确保[[环境安装](https://fdoc.epoint.com.cn/onlinedoc/rest/d/A3YRVf "环境安装")](?file=012-快速入门/001-安装环境)都到位了。

## 接口开发

- 在epoint-web工程的src/main/java下新建一个Java类TestAction，继承基类**BaseController**，基类中提供了一些通用的方法可以简化开发过程。
- 接口代码示例


```java
package com.epoint.orga.action;

import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RestController;

import com.epoint.api.manage.annotation.ApiDescription;
import com.epoint.basic.controller.BaseController;

@ApiDescription({"测试服务", "新点内部测试服务" })
@RestController("testaction")
@Scope("request")
public class TestAction extends BaseController
{

    public void pageLoad() {

    }

    @ApiDescription("helloworld")
    public String hello(@ApiDescription("参数")
    String params) {
        // do something.......
        return "hello world";
    }
}


```

## 接口调用
- 1、因为默认所有的服务接口都需要进行身份鉴权才能访问，为了测试简单，我们将开发的服务接口配置成匿名。打开epoint-web工程中的EpointSSOClient.properties配置文件，在其中配置NoNeedAuthActions=testaction/hello

- 2、启动epoint-web工程，然后就可以通过postman，或者自己写一个main方法，通过框架内置的HttpUtil工具类进行测试了
