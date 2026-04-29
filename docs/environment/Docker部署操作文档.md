---
title: Docker 部署操作文档
date: 2026-04-29
category: environment
tags:
  - Docker
  - 部署
  - Docker Compose
  - Tomcat
  - Nginx
  - MySQL
  - 容器化
  - 环境安装
description: Docker 部署全流程操作文档，包括常用命令、Docker Compose 模板、镜像构建发布、离线部署、上线发布和回滚流程
---

# Docker 部署操作文档

> 适用对象：已经安装 Docker，但还未正式使用；希望后续将公司项目通过 Docker 在本地、测试环境、生产环境部署。

---

## 1. 当前状态说明

已在本机检查 Docker 状态：

- Docker 已安装成功。
- Docker Desktop 当前可用。
- `docker` 命令可执行。
- `docker compose` 命令可执行。
- 当前还没有容器、镜像，说明尚未开始部署任何项目。

后续工作重点不是继续安装 Docker，而是将项目整理成可部署的容器化结构。

---

## 2. Docker 在公司项目中的作用

Docker 主要解决以下问题：

1. **统一运行环境**
   - 不再要求每台机器手动安装同样版本的 JDK、Tomcat、Nginx、MySQL。
   - 把运行环境固化到镜像里，减少"我电脑可以、服务器不行"的问题。

2. **快速部署和迁移**
   - 本地、测试环境、生产环境使用同一套 `docker-compose.yml` 或同一批镜像。
   - 换服务器时，只要安装 Docker、复制部署文件、拉取镜像即可恢复服务。

3. **便于回滚**
   - 每次发布使用明确的镜像版本号，例如 `project-web:1.0.3`。
   - 如果新版本异常，可以快速切回上一版镜像。

4. **便于隔离**
   - 数据库、后端、前端 Nginx 可以作为不同容器运行，互不污染本机环境。

---

## 3. 后续你要做什么

如果你只是刚安装 Docker，建议按下面顺序推进：

1. **确认 Docker Desktop 已启动**
   - macOS 上 Docker Desktop 必须运行，否则 `docker` 命令无法连接 Docker Server。

2. **跑一个测试容器，确认 Docker 可用**

   ```bash
   docker run hello-world
   ```

3. **跑一个 Nginx 测试容器，确认端口访问正常**

   ```bash
   docker run --name test-nginx -p 8088:80 -d nginx:1.24
   ```

   浏览器访问：

   ```text
   http://localhost:8088
   ```

   测试完成后删除容器：

   ```bash
   docker rm -f test-nginx
   ```

4. **确认公司项目的部署形态**

   需要明确以下信息：

   - 后端是 `war` 包部署到 Tomcat，还是 `jar` 包直接运行？
   - 前端是否是 Vue 打包后的 `dist` 静态文件？
   - 数据库使用 MySQL 5.7、MySQL 8，还是公司已有数据库？
   - 是否前后端分离？是否需要 Nginx？
   - 项目访问路径是什么，例如 `/epoint-web`？
   - 后端接口路径是什么，例如 `/epoint-web/rest`？
   - 项目配置文件是环境变量配置，还是需要挂载 `properties/yml/xml` 文件？

5. **整理部署目录**

   建议建立统一目录：

   ```text
   deploy/
   ├── docker-compose.yml
   ├── .env
   ├── backend/
   │   ├── Dockerfile
   │   └── app.war
   ├── frontend/
   │   ├── dist/
   │   └── nginx.conf
   ├── mysql/
   │   ├── conf/
   │   │   └── my.cnf
   │   └── init/
   │       └── init.sql
   └── logs/
       ├── backend/
       └── nginx/
   ```

6. **本地先用 Docker Compose 跑通**

   ```bash
   docker compose up -d
   docker compose ps
   docker compose logs -f
   ```

7. **测试无问题后，再迁移到公司测试服务器/生产服务器**

---

## 4. 常用 Docker 命令

### 4.1 查看版本

```bash
docker --version
docker compose version
```

### 4.2 查看 Docker 服务状态

```bash
docker info
```

### 4.3 查看镜像

```bash
docker images
```

### 4.4 查看容器

```bash
docker ps
```

查看全部容器：

```bash
docker ps -a
```

### 4.5 查看日志

```bash
docker logs 容器名
```

持续查看日志：

```bash
docker logs -f 容器名
```

### 4.6 进入容器

```bash
docker exec -it 容器名 sh
```

如果容器里有 bash：

```bash
docker exec -it 容器名 bash
```

### 4.7 停止容器

```bash
docker stop 容器名
```

### 4.8 删除容器

```bash
docker rm 容器名
```

强制删除运行中的容器：

```bash
docker rm -f 容器名
```

### 4.9 删除镜像

```bash
docker rmi 镜像名:版本
```

### 4.10 Docker Compose 常用命令

启动：

```bash
docker compose up -d
```

停止：

```bash
docker compose down
```

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f
```

重新构建并启动：

```bash
docker compose up -d --build
```

---

## 5. 本地 Docker 部署模板：MySQL + Tomcat 后端 + Nginx 前端

> 该模板适合传统 Java Web 项目：后端 `war` 包部署 Tomcat，前端 Vue 打包成 `dist`，Nginx 负责静态资源和接口转发。

### 5.1 目录结构

```text
deploy/
├── docker-compose.yml
├── .env
├── backend/
│   ├── Dockerfile
│   └── app.war
├── frontend/
│   ├── dist/
│   └── nginx.conf
└── mysql/
    ├── conf/
    │   └── my.cnf
    └── init/
        └── init.sql
```

### 5.2 `.env` 示例

```properties
PROJECT_NAME=epoint-demo
MYSQL_ROOT_PASSWORD=请修改成强密码
MYSQL_DATABASE=epoint_demo
MYSQL_USER=epoint
MYSQL_PASSWORD=请修改成强密码
BACKEND_CONTEXT_PATH=epoint-web
```

> 注意：`.env` 中不要提交真实生产密码到 Git 仓库。

### 5.3 MySQL 配置示例

文件：`mysql/conf/my.cnf`

```ini
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
lower_case_table_names=1
max_connections=500
default-time-zone=+8:00

[client]
default-character-set=utf8mb4
```

初始化 SQL 放到：

```text
mysql/init/init.sql
```

首次启动 MySQL 容器时，会自动执行 `mysql/init/` 目录下的 SQL 文件。

### 5.4 后端 Dockerfile：WAR 包部署 Tomcat

文件：`backend/Dockerfile`

```dockerfile
# 示例镜像，实际公司环境建议优先使用公司内部基础镜像
# 如果公司要求 Tomcat 7 + JDK 8，请使用公司镜像仓库中对应版本
FROM tomcat:7-jdk8

RUN rm -rf /usr/local/tomcat/webapps/*

COPY app.war /usr/local/tomcat/webapps/epoint-web.war

EXPOSE 8080
```

> 如果公共镜像拉取失败，或该 tag 不存在，需要改成公司内部镜像，例如：`registry.company.com/base/tomcat:7-jdk8`。

### 5.5 前端 Nginx 配置示例

文件：`frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # 后端接口代理
    location /epoint-web/rest {
        proxy_pass http://backend:8080;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 前端静态资源
    location /epoint-web {
        try_files $uri $uri/ /epoint-web/index.html;
    }
}
```

> 如果前端访问路径不是 `/epoint-web`，需要同步修改 Nginx 配置和前端构建配置。

### 5.6 `docker-compose.yml` 示例

文件：`docker-compose.yml`

```yaml
services:
  mysql:
    image: mysql:5.7
    container_name: ${PROJECT_NAME}-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      TZ: Asia/Shanghai
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_general_ci
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql/conf/my.cnf:/etc/mysql/conf.d/my.cnf:ro
      - ./mysql/init:/docker-entrypoint-initdb.d:ro
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-uroot", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: ./backend
    container_name: ${PROJECT_NAME}-backend
    restart: always
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      TZ: Asia/Shanghai
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ${MYSQL_DATABASE}
      DB_USER: ${MYSQL_USER}
      DB_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - ./logs/backend:/usr/local/tomcat/logs
    ports:
      - "8080:8080"

  frontend:
    image: nginx:1.24
    container_name: ${PROJECT_NAME}-frontend
    restart: always
    depends_on:
      - backend
    volumes:
      - ./frontend/dist:/usr/share/nginx/html/epoint-web:ro
      - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./logs/nginx:/var/log/nginx
    ports:
      - "8897:80"

volumes:
  mysql-data:
```

启动：

```bash
docker compose up -d --build
```

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f
```

访问地址：

```text
http://localhost:8897/epoint-web
```

---

## 6. Apple Silicon Mac 注意事项

你的本机 Docker 架构是 `aarch64`，也就是 Apple Silicon/ARM 架构。

公司服务器通常是 Linux `x86_64/amd64` 架构。部分老版本镜像，例如 MySQL 5.7、Tomcat 7，可能对 ARM 支持不好。

如果本地运行 MySQL 5.7 失败，可以临时在 `docker-compose.yml` 的 MySQL 服务下加：

```yaml
platform: linux/amd64
```

示例：

```yaml
mysql:
  image: mysql:5.7
  platform: linux/amd64
```

注意：

- `platform: linux/amd64` 在 Mac 上会使用模拟运行，性能会下降。
- 公司 Linux 服务器如果是 `x86_64`，一般不需要加这个配置。
- 生产环境不要因为本地 ARM 问题随意升级数据库大版本，除非项目确认兼容。

---

## 7. 如果后端是 Spring Boot JAR

如果项目不是 Tomcat WAR，而是 Spring Boot JAR，后端 Dockerfile 可以改成：

```dockerfile
FROM eclipse-temurin:8-jre

WORKDIR /app

COPY app.jar /app/app.jar

ENV TZ=Asia/Shanghai

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

如果需要指定配置文件：

```dockerfile
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=prod"]
```

也可以在 `docker-compose.yml` 中挂载外部配置：

```yaml
volumes:
  - ./config/application-prod.yml:/app/application-prod.yml:ro
```

---

## 8. 公司环境部署推荐方案

公司环境建议分为：

1. **本地开发环境**
   - 开发人员本机 Docker Desktop。
   - 主要用于快速启动 MySQL、Redis、Nginx 等依赖服务。
   - 不建议把本地 Docker 当生产环境。

2. **测试环境**
   - Linux 服务器安装 Docker Engine。
   - 使用 Docker Compose 部署整套服务。
   - 可使用测试数据库容器，也可连接公司统一测试数据库。

3. **生产环境**
   - Linux 服务器安装 Docker Engine。
   - 优先使用公司内部镜像仓库。
   - 数据库建议使用公司统一数据库服务；如必须容器化，必须做好数据卷、备份、监控和恢复方案。
   - 镜像版本必须固定，不要使用 `latest`。

---

## 9. 公司服务器部署前准备

### 9.1 服务器要求

建议：

- Linux 服务器，推荐 x86_64/amd64。
- 已安装 Docker Engine。
- 已安装 Docker Compose 插件。
- 能访问公司镜像仓库或可以离线导入镜像。
- 磁盘空间充足，建议至少预留 50GB 以上。
- 开放必要端口，例如：
  - `80` / `443`：对外 Web 访问。
  - `8897`：如果临时使用自定义端口。
  - `8080`：后端端口，生产环境一般不直接暴露。
  - `3306`：数据库端口，生产环境一般不对外暴露。

### 9.2 服务器目录建议

```text
/opt/epoint/
└── project-name/
    ├── docker-compose.yml
    ├── .env
    ├── backend/
    ├── frontend/
    ├── mysql/
    ├── logs/
    └── backup/
```

### 9.3 生产环境建议

- `.env` 文件权限设置为仅部署用户可读。
- 数据库密码、系统密钥不要写死在镜像中。
- 日志目录挂载到宿主机，便于排查问题。
- 数据目录必须使用 Docker Volume 或宿主机目录持久化。
- 生产端口统一由 Nginx 或网关暴露。
- 不要把 MySQL 端口直接开放到公网或办公网大范围访问。

---

## 10. 镜像构建和发布流程

### 10.1 本地构建镜像

以后端为例：

```bash
docker build -t project-backend:1.0.0 ./backend
```

前端如果需要打包成 Nginx 镜像，可以写 `frontend/Dockerfile`：

```dockerfile
FROM nginx:1.24
COPY dist/ /usr/share/nginx/html/epoint-web/
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

构建前端镜像：

```bash
docker build -t project-frontend:1.0.0 ./frontend
```

### 10.2 推送到公司镜像仓库

示例：

```bash
docker tag project-backend:1.0.0 registry.company.com/project/project-backend:1.0.0
docker push registry.company.com/project/project-backend:1.0.0
```

```bash
docker tag project-frontend:1.0.0 registry.company.com/project/project-frontend:1.0.0
docker push registry.company.com/project/project-frontend:1.0.0
```

### 10.3 服务器拉取镜像

```bash
docker compose pull
```

### 10.4 启动服务

```bash
docker compose up -d
```

---

## 11. 离线环境部署

如果公司服务器不能访问外网或不能访问镜像仓库，可以使用离线镜像包。

### 11.1 在有网络的机器上导出镜像

```bash
docker save -o project-backend-1.0.0.tar registry.company.com/project/project-backend:1.0.0
```

```bash
docker save -o project-frontend-1.0.0.tar registry.company.com/project/project-frontend:1.0.0
```

### 11.2 上传到服务器

把 `.tar` 文件、`docker-compose.yml`、`.env`、配置文件上传到服务器部署目录。

### 11.3 在服务器导入镜像

```bash
docker load -i project-backend-1.0.0.tar
```

```bash
docker load -i project-frontend-1.0.0.tar
```

### 11.4 启动服务

```bash
docker compose up -d
```

---

## 12. 上线发布流程

标准发布步骤：

1. 确认版本号，例如 `1.0.3`。
2. 前端打包生成 `dist`。
3. 后端打包生成 `war` 或 `jar`。
4. 构建 Docker 镜像。
5. 推送到公司镜像仓库。
6. 登录测试服务器。
7. 修改 `.env` 或 `docker-compose.yml` 中的镜像版本号。
8. 执行：

   ```bash
   docker compose pull
   docker compose up -d
   docker compose ps
   docker compose logs -f
   ```

9. 测试功能。
10. 测试无误后按同样方式发布生产环境。

---

## 13. 回滚流程

如果新版本异常：

1. 修改 `docker-compose.yml` 中镜像版本号为上一版。
2. 执行：

   ```bash
   docker compose pull
   docker compose up -d
   ```

3. 查看状态：

   ```bash
   docker compose ps
   docker compose logs -f
   ```

4. 确认业务恢复。

注意：如果新版本执行了数据库变更，回滚前必须确认数据库是否也需要回滚，避免程序版本和数据库结构不兼容。

---

## 14. 备份方案

### 14.1 数据库备份

如果 MySQL 跑在容器中：

```bash
docker exec 容器名 mysqldump -uroot -p数据库密码 数据库名 > backup.sql
```

如果使用外部数据库，以 DBA 或公司数据库平台提供的备份方式为准。

### 14.2 文件备份

建议备份：

- `docker-compose.yml`
- `.env`
- Nginx 配置
- 应用配置文件
- 数据库初始化脚本
- 上传文件目录
- 业务附件目录
- 日志目录按需备份

### 14.3 镜像备份

关键版本镜像可以导出保存：

```bash
docker save -o project-backend-1.0.0.tar project-backend:1.0.0
```

---

## 15. 常见问题

### 15.1 Docker 命令提示无法连接 Docker daemon

原因：Docker Desktop 没启动，或者 Docker 服务异常。

处理：

- macOS：打开 Docker Desktop，等状态变成 Running。
- Linux：检查 Docker 服务是否启动。

### 15.2 端口被占用

例如 `8897` 被占用，可以修改 `docker-compose.yml`：

```yaml
ports:
  - "8898:80"
```

然后访问：

```text
http://localhost:8898/epoint-web
```

### 15.3 数据库容器启动后 SQL 没有执行

原因：`docker-entrypoint-initdb.d` 下的 SQL 只会在数据库第一次初始化时执行。如果数据卷已经存在，再次启动不会重复执行初始化 SQL。

处理方式：

- 开发环境可以删除 volume 后重建。
- 生产环境不能随意删除 volume，应该手动执行变更 SQL。

### 15.4 容器能启动，但系统访问 404

重点检查：

- 前端 `dist` 是否放在正确目录。
- Nginx 的 `root` 是否正确。
- 前端访问路径 `/epoint-web` 是否和打包配置一致。
- 后端 war 包部署后的 context path 是否是 `/epoint-web`。

### 15.5 前端页面能打开，但接口报错

重点检查：

- Nginx `location /epoint-web/rest` 是否正确。
- `proxy_pass http://backend:8080;` 中的 `backend` 是否和 compose 服务名一致。
- 后端服务是否正常启动。
- 后端是否能连上数据库。

### 15.6 本地 Mac 拉取 MySQL 5.7 或 Tomcat 7 失败

可能是 ARM 架构兼容问题。

处理：

- 尝试加 `platform: linux/amd64`。
- 或使用公司内部支持 ARM/AMD64 的镜像。
- 生产环境以公司 Linux 服务器架构为准。

---

## 16. 推荐落地方式

建议按三个阶段推进：

### 阶段一：本地熟悉 Docker

目标：会启动、停止、查看日志、删除容器。

练习：

```bash
docker run hello-world
docker run --name test-nginx -p 8088:80 -d nginx:1.24
docker ps
docker logs test-nginx
docker rm -f test-nginx
```

### 阶段二：本地跑通公司项目

目标：使用 Docker Compose 一键启动项目依赖和应用。

需要准备：

- 后端 `war` 或 `jar`。
- 前端 `dist`。
- 数据库初始化 SQL。
- 应用配置文件。
- `docker-compose.yml`。
- `.env`。

### 阶段三：公司服务器部署

目标：在测试/生产服务器上用固定版本镜像发布。

推荐方式：

- CI/CD 构建镜像。
- 推送公司镜像仓库。
- 服务器只负责拉镜像和启动。
- 数据库、配置、日志、附件全部外置持久化。
- 每次发布都有明确版本号和回滚方案。

---

## 17. 最小检查清单

正式部署前请确认：

- [ ] Docker / Docker Compose 已安装。
- [ ] 服务器磁盘空间足够。
- [ ] 端口规划完成。
- [ ] 数据库地址、账号、密码确认。
- [ ] 后端包已准备。
- [ ] 前端 `dist` 已准备。
- [ ] Nginx 配置已确认。
- [ ] `.env` 已按环境修改。
- [ ] 数据卷已规划。
- [ ] 日志目录已挂载。
- [ ] 备份方案已确认。
- [ ] 回滚版本已准备。
- [ ] 测试环境已验证。
- [ ] 生产环境发布窗口已确认。
