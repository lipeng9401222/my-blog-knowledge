---
title: rest接口开发
sidebar: auto
collapsable: true
---

# rest接口开发



|| 时间 | 作者 | 备注 |
|| :-----: | :-----:| :------: |
|| 2024-12-6  | 张剑峰 | 初稿 |
|| 2025-01-12  |陆祎炜| 新增编码模型开发方式 |

- 本文讲述的是rest接口的基础开发内容，如果想要了解更为详细的rest接口技术，可以前往[[rest接口](https://fdoc.epoint.com.cn/onlinedoc/rest/d/Vf6bYj "rest接口")](?file=015-核心框架/050-通用技术/022-rest接口/020-开发指南/020-开发指南)查阅；
- rest接口主要的应用场景有如下几个：一个是提供给移动端使用，一个是和三方厂商做对接，还有一个是不同技术框架版本的系统之间要进行数据交互（比如F9.1的系统要和F9.5的系统进行数据交互）；
- 在开发之前，需要确保[[环境安装](https://fdoc.epoint.com.cn/onlinedoc/rest/d/A3YRVf "环境安装")](?file=012-快速入门/001-安装环境)都到位了。


## 传统接口开发

- 在epoint-web工程的src/main/java下新建一个Java类TestService，继承基类**ApiBaseController**，基类中提供了一些通用的方法可以简化开发过程。
- 接口代码示例

```java
package com.epoint.test.api;

import com.epoint.api.manage.annotation.ApiDescription;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.epoint.basic.api.common.ApiBaseController;

/**
 * 服务提供者接口
 */
@RestController
@RequestMapping("/testservice")
@ApiDescription({"测试服务","新点内部测试服务"})
public class TestService extends ApiBaseController {

    @PostMapping("/hello")
    @ApiDescription("helloworld")
    public String hello(@ApiDescription("参数")@RequestParam(value = "params", required = true) String params){
      //do something.......
      return "hello world";
    }
}
```

## 新型编码模型开发模式

从F10.0版本开始，框架支持一种新的开发模式——编码模型（FDD），这是一种基于标准RESTful接口的开发模式，主要用于表单页面开发（vue页面+rest接口开发的形式）。编码模型提供了一套标准化的开发规范，能够更好地支持动态搜索、动态展示列等在线个性化功能。

### 编码模型特点

- 使用标准的RESTful接口进行服务端调用
- 采用`application/json`作为默认的contentType
- 提供了标准的请求和响应模型（CommonRequest、CommonContext等）
- 支持安全注解，可参考[[相关安全注解说明](https://fdoc.epoint.com.cn/onlinedoc/rest/d/UjeAju "相关安全注解说明")](?file=020-框架组件/180-接口管理/068-VUE安全/006-注解使用/000-必填和必填弱校验)

### 编码模型接口示例

```java
package com.epoint.test.controller;

import com.epoint.core.dto.restmodel.RestResult;
import com.epoint.core.dto.restmodel.context.CommonContext;
import com.epoint.core.dto.restmodel.context.RequestContextConverter;
import com.epoint.core.dto.restmodel.request.CommonRequest;
import com.epoint.test.api.ITestService;
import com.epoint.test.entity.TestEntity;
import com.epoint.workflow.controller.restmodel.WorkflowBaseModelController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 编码模型示例接口
 * 继承BaseModelController以使用通用能力
 */
@RestController
@RequestMapping("/api/v1/test")
public class TestController extends WorkflowBaseModelController {

    @Autowired
    ITestService testService;

    /**
     * 查询接口示例
     */
    @RequestMapping("/getTest")
    public RestResult<TestEntity> getTest(@RequestBody CommonRequest<TestEntity> request) {
        CommonContext context = RequestContextConverter.convertToContext(request, TestEntity.class, CommonContext.class);
        TestEntity result = testService.getTest(context);
        return RestResult.success(result);
    }

    /**
     * 保存接口示例
     */
    @RequestMapping("/save")
    public RestResult<Boolean> save(@RequestBody CommonRequest<TestEntity> request) {
        this.authorize(null);
        CommonContext context = RequestContextConverter.convertToContext(request, TestEntity.class, CommonContext.class);
        testService.saveTest(context);
        return RestResult.success(true);
    }
}
```

### 详细开发指南

关于编码模型的详细开发规范，请参考[[编码模型章节](https://fdoc.epoint.com.cn/onlinedoc/rest/d/NnE7rq "编码模型章节")](?file=015-核心框架/015-FDD/009-编码模型/010-编码规范/010-基础规范)和[[开发指南](https://fdoc.epoint.com.cn/onlinedoc/rest/d/ZzqY7j "开发指南")](?file=015-核心框架/015-FDD/009-编码模型/020-开发指南/010-开发指南)。

## 接口调用
- 1、因为默认所有的服务接口都需要进行身份鉴权才能访问，为了测试简单，我们将开发的服务接口配置成匿名。打开epoint-web工程中的EpointSSOClient.properties配置文件，在其中配置NoNeedAuthActions=testservice/hello

- 2、启动epoint-web工程，然后就可以通过postman，或者自己写一个main方法，通过框架内置的HttpUtil工具类进行测试了
