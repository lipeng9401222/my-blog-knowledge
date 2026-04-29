---
title: vue部署
sidebar: auto
collapsable: true
---

# vue部署



| 时间 | 作者 | 备注 |
| :-----: | :-----:| :------: |
| 2024-10-24  | 樊志君 | 初稿 |
| 2024-11-28  | 樊志君 | 更新部署说明 |
| 2025-05-16  | 樊志君 | 更新场景描述,前后分离部署标准模式下需要将mini一起代理 |

- 目前涉及F9和Vue 这套技术栈开发的页面，本文基于这2类资源来说明部署模式指南。
- 本文已假设已经拿到vue资源包，如果需要对vue进行打包，请参考[[如何打包-前端打包](https://fdoc.epoint.com.cn/onlinedoc/rest/d/QbMFBn "如何打包-前端打包")](?file=012-快速入门/090-部署调试/011-打包发布#前端打包发布)

## 前后分离部署
- 前后分离模式下，前端和后端独立启动，后端启动不再赘述
- 针对需要完全前后分离的场景，需将vue页面和mini页面一起通过nginx代理(本文按nginx讲解)


### 步骤1：基于源码打包得到部署文件(如已拿到dist部署包，请跳过此步骤)
- 此步骤请参考：[[如何打包-前端打包](https://fdoc.epoint.com.cn/onlinedoc/rest/d/QbMFBn "如何打包-前端打包")](?file=012-快速入门/090-部署调试/011-打包发布#前端打包发布)

### 步骤2: nginx挂载运行(配置不唯一，仅供参考)

#### 带项目路径
- 请确保实际资源的父目录为实际的`RootPath`配置,例如：拿到的包对应根路径为`epoint-web`
- 从F10开始，打出的vue包为多主题，会有的vue工程目录，但都会在根路径`epoint-web`下<br>
![033-1761035626067.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=f79fdc03-3b95-46ef-8847-cd7dc908426c)
- 按此路径的nginx配置如下：
 - <font style="color:red">http</font>节点
```nginx
    upstream epoint-web {
        # 指向到真实的后端地址
        server 127.0.0.1:8080;
    }
```
 - 添加一个<font style="color:red">server</font>节点：<br>

```nginx
server{
    listen 8895;
    server_name localhost;
    root E:/htmlbase;

    # cssboot是后端写的，因此直接路由到后端
    location /epoint-web/frame/fui/js/cssboot.js {
        # 代理到后端服务
        proxy_pass http://epoint-web;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 新增 /soa 重定向规则 (放在其他 location 之前)
    # 由于F10采用多主题，因此默认主题指向到home
    location = /epoint-web {
        return 301 /epoint-web/home;
    }

    location /epoint-web/home {
        alias  E:/htmlbase/epoint-web/home;
        index index.html;
        try_files $uri $uri/ /epoint-web/home/index.html;
    }

    location /epoint-web/admin {
        alias  E:/htmlbase/epoint-web/admin;
        index index.html;
        try_files $uri $uri/ /epoint-web/admin/index.html;
    }

	location /epoint-web/egoapp {
		alias  E:/htmlbase/epoint-web/egoapp;
		index index.html;
		try_files $uri $uri/ /epoint-web/egoapp/index.html;
    }

    location /epoint-web/mobile {
        alias  E:/htmlbase/epoint-web/mobile;
        index index.html;
        try_files $uri $uri/ /epoint-web/mobile/index.html;
    }

    # 新增：处理 /epoint-web/epointtemp 路径的请求
    location ^~ /epoint-web/epointtemp {
        # 代理到后端服务
        proxy_pass http://epoint-web;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 接口路由到后端
    location /epoint-web/rest {
      proxy_pass http://epoint-web;
      proxy_set_header    Host             $http_host;
      proxy_set_header   X-Real-IP         $remote_addr; 
      proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto $scheme;
    }
   }
```

- 按照上述配置，可通过`http://localhost:8895/epoint-web`访问系统
- 如果不带项目路径，请确保dist资源包是按照无项目路径打包的，然后nginx配置参考上述去掉epoint-web的目录即可


### 步骤3：mini页面资源拷贝到vue资源目录中
- 合并完成后，目录情况如下<br>
![033-1761035788902.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=71426694-ce6f-49ca-8330-9c47ca8e5ce9)


附：快速导出war中所有jar的`/META-INF/resources`资源的工具，[[点击下载](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=019fb7d1-c05c-44b7-89d9-098ba10aa12a)](assets/013/099/030/exportF9resources.zip)

### 步骤4：nginx追加mini页面代理配置
- 在配置开启前，需要删除mini资源中的登录页面，包括产品自己的老的mini登录页面，否则可能与vue的登录页面产生冲突。
 - 例如，删除<font style="color:red">`frame/pages/login/login.html`</font><br>
 ![005-1732777439480.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=7d95d59c-32d3-4b87-a2be-876591f9323f)
- nginx的server节点配置 里增加mini页面的路由处理，支持mini页面的国际化，后端project,product路由的适配
- 完整示例如下：<br>

```nginx
server{
    listen 8895;
    server_name localhost;
    root E:/htmlbase;

    #mini页面国际化路由识别
    # 设置默认后缀（当Cookie不存在时使用）
    set $lang_suffix "";

    # 如果存在 epoint_local Cookie，则使用其值作为后缀
    if ($cookie_epoint_local) {
        set $lang_suffix "_$cookie_epoint_local";
    }

    # mini页面支持后端的projectPath,productPath路由
    # 获取URI的第一部分（模块名）和剩余部分
    set $module "";
    set $rest_uri "";
    if ($uri ~ "^/([^/]+)(/.*)$") {
        set $module $1;
        set $rest_uri $2;
    }

    # 如果URI只有模块名，没有后续路径
    if ($uri ~ "^/([^/]+)$") {
        set $module $1;
        set $rest_uri "";
    }

    # cssboot是后端写的，因此直接路由到后端
    location /epoint-web/frame/fui/js/cssboot.js {
        # 代理到后端服务
        proxy_pass http://epoint-web;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }


    location / {
        # 请按照实际后端projectPath生效顺序填写，有多少个路由，就写多少组，在不支持Lua的情况只能这么做
        # 尝试个性化路径test2
        if (-f $document_root/$module/test4$rest_uri$lang_suffix.html) {
            rewrite ^ /$module/test4$rest_uri$lang_suffix.html break;
        }
        if (-f $document_root/$module/test4$rest_uri.html) {
            rewrite ^ /$module/test4$rest_uri.html break;
        }

        # 尝试个性化路径test1
        if (-f $document_root/$module/test1$rest_uri$lang_suffix.html) {
            rewrite ^ /$module/test1$rest_uri$lang_suffix.html break;
        }
        if (-f $document_root/$module/test1$rest_uri.html) {
            rewrite ^ /$module/test1$rest_uri.html break;
        }

        # 如果个性化路由没有命中，则按原路由适配国际化
        # 1. 先尝试带语言后缀的版本
        if (-f $document_root$uri$lang_suffix.html) {
            rewrite (.*) $uri$lang_suffix.html break;
        }

        # 2. 如果语言文件不存在，回退到默认版本
        if (-f $document_root$uri.html) {
            rewrite (.*) $uri.html break;
        }

        # 声明响应随Cookie变化
        add_header Vary Cookie;
        try_files $uri $uri/ =404;
    }

    # 新增 /soa 重定向规则 (放在其他 location 之前)
    # 由于F10采用多主题，因此默认主题指向到home
    location = /epoint-web {
        return 301 /epoint-web/home;
    }

    location /epoint-web/home {
        alias  E:/htmlbase/epoint-web/home;
        index index.html;
        try_files $uri $uri/ /epoint-web/home/index.html;
    }

    location /epoint-web/admin {
        alias  E:/htmlbase/epoint-web/admin;
        index index.html;
        try_files $uri $uri/ /epoint-web/admin/index.html;
    }

	location /epoint-web/egoapp {
		alias  E:/htmlbase/epoint-web/egoapp;
		index index.html;
		try_files $uri $uri/ /epoint-web/egoapp/index.html;
    }

    location /epoint-web/mobile {
        alias  E:/htmlbase/epoint-web/mobile;
        index index.html;
        try_files $uri $uri/ /epoint-web/mobile/index.html;
    }

    # 新增：处理 /epoint-web/epointtemp 路径的请求
    location ^~ /epoint-web/epointtemp {
        # 代理到后端服务
        proxy_pass http://epoint-web;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 接口路由到后端
    location /epoint-web/rest {
      proxy_pass http://epoint-web;
      proxy_set_header    Host             $http_host;
      proxy_set_header   X-Real-IP         $remote_addr; 
      proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto $scheme;
    }
   }
```

## 合并到后端部署
- 如果希望vue页面开发好后放到后端tomcat来启动，可以参考下文进行。

### 基于源码打包得到部署文件(如已拿到dist部署包，请跳过此步骤)
- 此步骤请参考：[[如何打包-前端打包](https://fdoc.epoint.com.cn/onlinedoc/rest/d/QbMFBn "如何打包-前端打包")](?file=012-快速入门/090-部署调试/010-如何打包)

### 将资源文件拷贝后端
- 检查拿到的资源包，找到带`epoint-web`的应用那层目录，拷贝这一层的所有文件到后端的`webapp`目录下
- 确保资源文件是直接放在webapp下的，<font style="color:red">不能直接dist整个丢进webapp下，参考下图，实际拷贝进去的就这4个框出来的目录或文件</font>
- 确保打包的时候应用路径就是后端的访问contextPath,例如：后端通过`/epoint-web`访问，那vue的<font style="color:red">`BASEPATH`</font>、<font style="color:red">`ROOTPATH`</font> 配置值里的应用目录段都是<font style="color:red">`/epoint-web`</font>
- 确保`.project-info.json`在各自的vue目录内存在，否则启动后页面刷新会出现问题。<br>
![033-1761036030966.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=b48ff04d-51e6-4ca0-b283-22260dbc8b0b)



## 如何通过jenkins一步实现融合构建

### 创建流水线
![](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=93991d0b-05c0-4340-9d09-0cc0ab10ecce)


1、代码仓库选择**后端的代码仓库**

2、模板选择
![](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=9dfe4605-f2ff-463a-9a34-3fafb196f447)



### 如何修改流水线

####1、 修改环境变量
填写VUE的对应仓库信息
![](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=e18ad0a5-c46b-4513-a4df-4bf98cc22df6)

####2、vue工程拉取与打包  【蓝色部分按实际要求进行修改】
#####①：默认为git工程，如仓库为svn，则需修改。仓库地址取上述环境变量内容，不可修改变量名
#####②：打包vue工程，给出模板。
<font style="color:red">打包脚本如需进一步修改，请参考[如何打包-前端打包](?file=012-快速入门/090-部署调试/011-打包发布#前端打包发布)</font>
![](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=5b4ca378-daaf-4512-99c0-585b385c5305)

#####③ 拉取后端代码
#####④ 把dist文件夹内的内容，移到后端工程的webapp下；.project-info.json移到resource下。
**<font style="color:red">.project-info.json内容，自行与前端进行约定。</font>**
![](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=a16b7251-37fa-4c02-8fab-57b38e123ad6)

#####⑤打包构建镜像
![](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=0747b296-b74c-4365-a753-5858610e4ca3)
