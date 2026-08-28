---
title: WeKnora 免费云服务器部署完整指南（Oracle Cloud）
date: 2026-07-27
category: ai
tags:
  - WeKnora
  - Oracle Cloud
  - Docker
  - 部署
  - 知识库
---

# WeKnora 免费云服务器部署完整操作指南

> 本指南覆盖：云服务商选型对比 → Oracle Cloud 账户注册 → 实例创建 → 环境配置 → WeKnora 部署 → HTTPS 配置 → 运维与避坑
>
> 目标读者：想在永久免费云服务器上部署 [Tencent/WeKnora](https://github.com/Tencent/WeKnora)（LLM 知识库框架）的个人开发者
>
> 最后更新：2026-07-27

---

## 目录

- [一、前置准备](#一前置准备)
- [二、云服务商选型对比](#二云服务商选型对比)
- [三、Oracle Cloud 账户注册（详细步骤）](#三oracle-cloud-账户注册详细步骤)
- [四、创建 ARM Ampere A1 实例](#四创建-arm-ampere-a1-实例)
- [五、网络安全与防火墙配置](#五网络安全与防火墙配置)
- [六、SSH 连接与环境初始化](#六ssh-连接与环境初始化)
- [七、安装 Docker 与 Docker Compose](#七安装-docker-与-docker-compose)
- [八、部署 WeKnora](#八部署-weknora)
- [九、配置 LLM 模型 API](#九配置-llm-模型-api)
- [十、HTTPS 配置（强烈推荐）](#十https-配置强烈推荐)
- [十一、防回收与保活策略](#十一防回收与保活策略)
- [十二、数据备份与恢复](#十二数据备份与恢复)
- [十三、常见问题与避坑清单](#十三常见问题与避坑清单)
- [十四、成本与限额监控](#十四成本与限额监控)
- [附录 A：备选方案](#附录-a备选方案)
- [附录 B：关键命令速查](#附录-b关键命令速查)

---

## 一、前置准备

### 1.1 WeKnora 部署资源需求

根据 [WeKnora 官方 Issue #2](https://github.com/Tencent/WeKnora/issues/2) 维护者回复：**已在 4 核 8GB 内存下验证正常运行**，调用外部模型 API 可服务 3-4 人。

| 项目 | 最低 | 推荐 |
|---|---|---|
| CPU | 2 核 | 4 核+ |
| 内存 | 4 GB | 8-16 GB |
| 磁盘 | 20 GB | 50-100 GB SSD |
| Docker | 20.10+ | 24.0+ |
| Docker Compose | v2.0+ | v2.20+ |
| 操作系统 | Linux | Ubuntu 22.04 LTS |
| 必要组件 | Postgres + Redis + MinIO + docreader + app | + 可选 Neo4j / Ollama |

> ⚠️ **重要**：若本地跑 Ollama 推理需要 16GB+ 内存；若仅调外部 LLM API（如 DeepSeek、通义千问），4-8GB 即可。

### 1.2 必备材料清单

开始前请准备以下材料：

- [ ] 有效邮箱（Gmail / Outlook / 公司邮箱均可，**不建议使用 QQ 邮箱**，可能收不到验证邮件）
- [ ] 信用卡（Visa / Mastercard，**仅作身份验证，不会扣款**；国内双币信用卡可用）
- [ ] 手机号（用于短信验证）
- [ ] 域名（可选，配置 HTTPS 时需要，可在阿里云/Cloudflare 购买）
- [ ] SSH 客户端（macOS 自带 Terminal；Windows 推荐 WSL2 或 MobaXterm）
- [ ] LLM API Key（推荐先在 [DeepSeek 平台](https://platform.deepseek.com) 注册并充值几元）

---

## 二、云服务商选型对比

### 2.1 主流免费云服务器对比表

| 服务商 | 免费时长 | 实例规格 | 永久 | 内存 | 适合 WeKnora |
|---|---|---|---|---|---|
| **Oracle Cloud Always Free** | **永久** | Ampere A1 ARM：2 OCPU + 12GB RAM | ✅ | 12GB | ⭐⭐⭐⭐⭐ |
| AWS Free Tier（2025.7.15 后新账户） | 6 个月 | $100 信用额度，t3.micro 1GB | 部分 | 1GB | ⭐⭐ |
| AWS Free Tier（老账户） | 12 个月 | t2.micro/t3.micro 1GB | ❌ | 1GB | ⭐⭐ |
| GCP Always Free | 永久 | e2-micro 1GB（仅美国三区） | ✅ | 1GB | ⭐ |
| Azure Free | 12 个月 + $200/30 天 | B1S 1GB | 部分 | 1GB | ⭐ |
| IBM Cloud Lite | 永久 | 无免费 VM | ✅ | - | ❌ |
| Vultr / Linode | 30-60 天 | $100-300 信用 | ❌ | - | ⭐⭐ |
| Hetzner | 无免费 | €3.49/月（2vCPU 4GB） | ❌ | 4GB | ⭐⭐⭐⭐ |

### 2.2 为什么选 Oracle Cloud？

**Oracle Cloud Always Free 是部署 WeKnora 的最优选择**：

| 维度 | Oracle Cloud | AWS |
|---|---|---|
| 免费时长 | **永久** | 6 个月（新账户）/ 12 个月（老账户） |
| 实例规格 | 2 OCPU + 12GB RAM（ARM） | t3.micro 1 vCPU + 1GB RAM |
| 存储 | 200GB 块存储 | 30GB EBS |
| 出站流量 | 10TB/月 | 100GB/月 |
| 信用卡 | 仅验证 | 仅验证 |
| 内存充裕度 | ✅ 远超 8GB 最低要求 | ❌ 1GB 严重不足 |
| 风险 | 容量紧张需重试 | 超额即按需计费 |

### 2.3 ⚠️ 2026 年 6 月 Oracle 政策变化

Oracle 已将 Always Free 的 ARM 配额从 **4 OCPU + 24GB RAM 砍半至 2 OCPU + 12GB RAM**（[官方文档](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) 已更新）。

**2 OCPU + 12GB RAM 仍然足够部署 WeKnora + 外部 LLM API 模式**，但已不够同时跑本地 Ollama。

---

## 三、Oracle Cloud 账户注册（详细步骤）

### 3.1 访问注册页面

1. 打开 https://www.oracle.com/cloud/free/
2. 点击右上角 **Start for free**

### 3.2 填写账户信息

#### 步骤 1：邮箱验证

- 输入邮箱地址（**强烈建议 Gmail，不要用 QQ 邮箱**）
- 输入国家/地区（**中国大陆**）
- 输入姓名（**必须与信用卡账单完全一致**，否则验证失败）
- 点击 **Verify email**
- 收到 6 位验证码邮件，填入验证

#### 步骤 2：设置密码

- 至少 8 位，包含大写、小写、数字、特殊字符
- 建议用密码管理器生成并保存

#### 步骤 3：选择账户类型

- 选择 **Free Tier**（不要选 Paid Account）

#### 步骤 4：填写公司信息

- 个人用户：可选 "Personal Account"
- 公司名可填个人姓名拼音
- 地址需与信用卡账单地址一致

### 3.3 选择 Home Region（关键决策）

> ⚠️ **Region 一旦选定无法更改**，Always Free 资源只能创建在 Home Region。

**推荐选择顺序**（综合考虑容量紧张度 + 国内访问速度）：

1. **Singapore**（新加坡）- 国内访问较快，但容量紧张
2. **Tokyo**（东京）- 国内访问较快，容量相对宽松
3. **Osaka**（大阪）- 备选
4. **Mumbai**（孟买）- 容量宽松，但延迟较高
5. **Seoul**（首尔）- 备选

> 💡 **建议**：首选 Tokyo，容量相对宽松，对国内延迟 50-80ms 可接受。

### 3.4 设置密码并同意条款

- 勾选同意条款
- 点击 **Start my free trial**

### 3.5 添加支付方式

- 选择信用卡类型（Visa / Mastercard / JCB 等）
- 输入卡号、有效期、CVV
- 输入账单地址（**必须与银行记录一致**）
- Oracle 会进行 **$1 临时授权**（不会实际扣款，7-14 天自动解除）

> ⚠️ **避坑**：
> - 国内信用卡（招行、中信、工行双币卡）通常可用
> - **不建议使用虚拟信用卡**（如 Depay），Oracle 会拒绝
> - 若信用卡被拒，可尝试换一张卡，或联系发卡行开通国际支付
> - 必须有 **至少 $1 可用额度** 用于授权验证

### 3.6 短信验证

- 输入手机号（+86 开头）
- 选择 **Send code via SMS**
- 输入收到的 6 位验证码
- 点击 **Verify**

> ⚠️ **避坑**：若收不到短信，可尝试：
> - 等待 5-10 分钟
> - 切换为 **Voice call** 接收
> - 换一个手机号（朋友的也可以）

### 3.7 完成注册

- 看到 "Your account is being provisioned" 提示
- 通常 **5-30 分钟** 内会收到激活邮件
- 激活后即可登录 Oracle Cloud Console

> ⚠️ **避坑**：少数情况下审核可能需要 1-3 天。若超过 24 小时未激活，可提交 Support Request 咨询。

---

## 四、创建 ARM Ampere A1 实例

### 4.1 进入实例创建页面

1. 登录 https://cloud.oracle.com
2. 左上角汉堡菜单 → **Compute → Instances**
3. 点击 **Create Instance**

### 4.2 配置实例

#### 4.2.1 基本信息

- **Name**: `weknora`
- **Compartment**: 默认（root compartment）

#### 4.2.2 镜像选择

- 点击 **Edit**（Image and Shape 区域）
- **Image**: 选择 **Canonical Ubuntu 22.04** （必须确认是 **aarch64** 架构）
- 不要选 Oracle Linux（兼容性不如 Ubuntu）

#### 4.2.3 Shape 选择（关键）

- 点击 **Change shape**
- 选择 **Ampere** 标签页
- 选择 **VM.Standard.A1.Flex**
- 配置：
  - **Number of OCPUs**: `2`
  - **Amount of Memory (GB)**: `12`

> ⚠️ **避坑**：
> - 不要选 AMD 的 `VM.Standard.E2.1.Micro`，只有 1GB 内存不够用
> - ARM Shape 必须在 Home Region 创建

#### 4.2.4 网络配置

- **Primary network**: 选 **Create new virtual cloud network**
- **Subnet**: 选 **Create new public subnet**
- 勾选 **Assign a public IPv4 address**（必须勾选，否则无法 SSH）

#### 4.2.5 SSH 密钥（关键，不可丢失）

- 选择 **Save private key** → 下载私钥文件（`ssh-key-*.key`）
- 选择 **Save public key** → 下载公钥文件

> ⚠️ **重要警告**：
> - 私钥**只能下载一次**，丢失后无法找回，只能重建实例
> - 务必备份到多个位置（如 1Password、iCloud、本地加密目录）
> - 不要上传到 GitHub 等公开仓库

#### 4.2.6 启动卷配置

- 展开 **Boot volume** 高级选项
- **Boot volume size (GB)**: 建议改为 `100`（默认 47GB，WeKnora + 数据库可能不够）
- **In-transit encryption**: 勾选

### 4.3 创建实例

- 点击 **Create**
- 等待 1-3 分钟，状态变为 **Running** 即可
- 记录 **Public IP Address**

### 4.4 ⚠️ "Out of host capacity" 问题处理

若创建时报错 **"Out of host capacity"**：

**方法 1：切换可用域**
- 编辑实例配置，选择不同的 Availability Domain 重试

**方法 2：不同时段重试**
- 凌晨 2-6 点（北京时间）容量相对宽松

**方法 3：使用循环脚本**
GitHub 上有开源工具可循环尝试创建：
- https://github.com/hitrov/oci-arm-host-capacity

**方法 4：换 Region**
- 若 Tokyo 始终抢不到，注销账户重新注册选 Mumbai / Singapore

> ⚠️ **避坑**：不要为了抢容量去升级到 Paid Account，会失去 Always Free 资格。

---

## 五、网络安全与防火墙配置

Oracle Cloud 有**两层防火墙**，必须同时配置：

### 5.1 配置 Security List（云端层）

1. Console → **Networking → Virtual Cloud Networks**
2. 点击你创建的 VCN
3. 点击 **Security Lists → Default Security List**
4. 点击 **Add Ingress Rules**，逐条添加：

| Source CIDR | Protocol | Dest Port | Description |
|---|---|---|---|
| 0.0.0.0/0 | TCP | 22 | SSH |
| 0.0.0.0/0 | TCP | 80 | HTTP (WeKnora 前端) |
| 0.0.0.0/0 | TCP | 443 | HTTPS |
| 0.0.0.0/0 | TCP | 8080 | WeKnora API（可选） |

> ⚠️ **安全建议**：生产环境建议将 22 端口 Source 改为你自己的 IP（如 `1.2.3.4/32`），不开放公网 SSH。

### 5.2 配置实例防火墙（系统层）

SSH 登录后执行（见下一节）。

---

## 六、SSH 连接与环境初始化

### 6.1 修改私钥权限

```bash
# macOS / Linux
chmod 400 ~/Downloads/ssh-key-*.key

# Windows WSL
chmod 400 /mnt/c/Users/<你的用户名>/Downloads/ssh-key-*.key
```

### 6.2 SSH 登录

```bash
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<INSTANCE_PUBLIC_IP>
```

> ⚠️ **避坑**：
> - 首次登录会问 `Are you sure you want to continue connecting`，输入 `yes`
> - 用户名必须是 `ubuntu`（Ubuntu 镜像默认）
> - 若用 root 登录会被拒绝

### 6.3 系统初始化

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git vim ufw htop ca-certificates gnupg lsb-release apt-transport-https software-properties-common

# 设置时区
sudo timedatectl set-timezone Asia/Shanghai

# 验证
date
```

### 6.4 配置实例防火墙（ufw）

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable
sudo ufw status verbose
```

### 6.5 创建 Swap（防止内存不足）

即使有 12GB 内存，也建议加 4GB swap 作为保险：

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 优化 swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 验证
free -h
```

---

## 七、安装 Docker 与 Docker Compose

### 7.1 安装 Docker（ARM64）

```bash
# 添加 Docker 官方 GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 将 ubuntu 用户加入 docker 组（免 sudo）
sudo usermod -aG docker ubuntu

# 让组权限立即生效（或重新登录）
newgrp docker
```

### 7.2 验证安装

```bash
docker --version
# Docker version 24.0.x 或更高

docker compose version
# Docker Compose version v2.20.x 或更高
```

### 7.3 配置 Docker 镜像加速（国内服务器必做）

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://docker.nju.edu.cn"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

> ⚠️ **避坑**：
> - Oracle Tokyo/Singapore 节点拉 Docker Hub 通常无需加速，但配置上备用更稳妥
> - 若 daocloud 镜像失效，可在 https://github.com/dao-opensource/daocloud-docs 查询最新地址

### 7.4 设置 Docker 开机自启

```bash
sudo systemctl enable docker
```

---

## 八、部署 WeKnora

### 8.1 克隆代码仓库

```bash
cd ~
git clone https://github.com/Tencent/WeKnora.git
cd WeKnora

# 查看当前版本
cat VERSION
```

> 💡 **加速**：若 GitHub 拉取慢，可用镜像：
> ```bash
> git clone https://ghproxy.com/https://github.com/Tencent/WeKnora.git
> # 或
> git clone https://mirror.ghproxy.com/https://github.com/Tencent/WeKnora.git
> ```

### 8.2 配置环境变量

```bash
# 复制示例配置
cp .env.example .env

# 生成强随机密码（记录下来）
echo "POSTGRES_PASSWORD: $(openssl rand -hex 16)"
echo "MINIO_SECRET_KEY: $(openssl rand -hex 16)"

# 编辑配置
nano .env
```

`.env` 文件关键配置（**调用外部 LLM API 模式**）：

```env
# ============ 数据库配置 ============
DB_DRIVER=postgres
DB_HOST=postgres
DB_PORT=5432
DB_USER=weknora
DB_PASSWORD=<替换为上面生成的随机密码>
DB_NAME=weknora

# ============ 应用端口 ============
APP_PORT=8080
FRONTEND_PORT=80
GIN_MODE=release

# ============ 存储配置 ============
STORAGE_TYPE=minio
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=weknora_minio
MINIO_SECRET_KEY=<替换为上面生成的随机密码>

# ============ Redis ============
REDIS_HOST=redis
REDIS_PORT=6379
```

> ⚠️ **避坑**：
> - 不要用默认密码，否则实例暴露公网后极易被勒索
> - LLM API Key 不要写在 .env 里，启动后在管理界面配置

### 8.3 启动服务

```bash
# 拉取镜像并启动（首次约 5-15 分钟，取决于网速）
docker compose up -d

# 查看启动状态
docker compose ps

# 持续查看日志（按 Ctrl+C 退出）
docker compose logs -f app
```

### 8.4 验证部署

```bash
# 等待 30-60 秒，健康检查
curl http://localhost:8080/api/health

# 期望返回 {"status":"ok"} 之类
```

### 8.5 初始化管理员账户

首次访问 Web 界面：

1. 浏览器打开 `http://<INSTANCE_PUBLIC_IP>`
2. 跟随引导创建管理员账户
3. 邮箱可填 `admin@example.com`
4. 设置强密码（记录好）

### 8.6 检查各服务状态

```bash
# 查看所有容器
docker compose ps

# 应该看到以下服务都是 running 状态：
# weknora-app-1        (8080)
# weknora-frontend-1   (80)
# weknora-postgres-1   (5432)
# weknora-redis-1      (6379)
# weknora-minio-1      (9000, 9001)
# weknora-docreader-1  (50051)
```

---

## 九、配置 LLM 模型 API

WeKnora 启动后，需要配置 LLM 才能使用。

### 9.1 推荐 LLM 供应商

| 供应商 | 模型 | 价格 | 注册地 | 备注 |
|---|---|---|---|---|
| **DeepSeek** | deepseek-chat (V3) | ¥1/百万 token | 国内 | 推荐，便宜效果好 |
| **阿里云百炼** | qwen-plus | ¥0.8/百万 token | 国内 | 中文表现优秀 |
| **智谱 AI** | glm-4-flash | 免费额度 | 国内 | 免费试用 |
| OpenAI | gpt-4o-mini | $0.15/百万 token | 海外 | 需科学上网 |
| Anthropic | claude-3-5-haiku | $1/百万 token | 海外 | 需科学上网 |

### 9.2 在 WeKnora 中配置 LLM

1. 登录 WeKnora → **设置 → 模型管理**
2. 点击 **新增模型**
3. 配置：
   - **供应商**: DeepSeek / OpenAI Compatible
   - **Base URL**: `https://api.deepseek.com/v1`
   - **API Key**: 你的 sk-xxx
   - **模型名**: `deepseek-chat`
4. 点击 **测试连接**
5. 测试通过后 **设为默认**

### 9.3 配置 Embedding 模型

1. **设置 → 模型管理 → Embedding**
2. 推荐：
   - 国内：阿里云 text-embedding-v3（在百炼控制台开通）
   - 海外：OpenAI text-embedding-3-small

---

## 十、HTTPS 配置（强烈推荐）

> ⚠️ **强烈推荐**：HTTP 明文传输会导致 API Key、Cookie 泄露，必须配置 HTTPS。

### 10.1 准备域名

1. 在阿里云 / Cloudflare / Namecheap 购买域名
2. 添加 A 记录指向实例公网 IP：
   ```
   weknora.yourdomain.com → <INSTANCE_PUBLIC_IP>
   ```
3. 等待 DNS 生效（5-30 分钟）：
   ```bash
   dig weknora.yourdomain.com
   # 或
   nslookup weknora.yourdomain.com
   ```

### 10.2 用 Caddy 自动配置 HTTPS

在 WeKnora 目录下创建 `docker-compose.override.yml`：

```bash
cd ~/WeKnora
nano docker-compose.override.yml
```

内容：

```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: weknora-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app
    networks:
      - default

volumes:
  caddy_data:
  caddy_config:
```

创建 `Caddyfile`：

```bash
nano Caddyfile
```

内容（替换 `weknora.yourdomain.com`）：

```
weknora.yourdomain.com {
    reverse_proxy app:8080
}
```

### 10.3 修改 WeKnora 端口避免冲突

由于 Caddy 占用了 80 端口，需要修改 `.env`：

```bash
nano .env
```

修改：

```env
# 改为非 80 端口，避免与 Caddy 冲突
FRONTEND_PORT=8081
APP_PORT=8080
```

### 10.4 启动 Caddy

```bash
docker compose up -d caddy
docker compose logs -f caddy
# 看到 "certificate obtained successfully" 即 HTTPS 已生效
```

### 10.5 验证 HTTPS

浏览器访问：`https://weknora.yourdomain.com`

> ⚠️ **避坑**：
> - Caddy 自动申请 Let's Encrypt 证书，第一次启动可能需 1-2 分钟
> - 若证书申请失败，检查 80/443 端口是否都对外开放（Let's Encrypt 需要 80 端口验证）
> - 一个域名一周最多申请 5 次证书，不要频繁删除重建

---

## 十一、防回收与保活策略

> ⚠️ **重要**：Oracle Cloud 会对 Always Free 实例执行回收策略，**实例停机 7 天** 或 **长时间无网络流量** 可能被回收。

### 11.1 保活策略 1：定时任务

```bash
crontab -e
```

添加以下内容（每 5 分钟 ping 自己一次，保持网络流量）：

```
*/5 * * * * curl -s http://localhost:8080/api/health > /dev/null
```

### 11.2 保活策略 2：CPU 占用

Oracle 可能回收"完全闲置"的实例。添加一个低强度的 CPU 占用：

```bash
# 创建保活脚本
cat > ~/keepalive.sh <<'EOF'
#!/bin/bash
# 每 4 小时跑 1 分钟的轻量计算
while true; do
  sleep 14400
  timeout 60 sha1sum /dev/urandom > /dev/null 2>&1
done
EOF

chmod +x ~/keepalive.sh
nohup ~/keepalive.sh > /dev/null 2>&1 &
```

### 11.3 保活策略 3：监控脚本

设置监控，发现实例异常自动通知：

```bash
# 安装 telegram-send（可选，用于推送通知）
pip3 install telegram-send

# 创建监控脚本
cat > ~/monitor.sh <<'EOF'
#!/bin/bash
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
if [ "$HEALTH" != "200" ]; then
  echo "WeKnora 异常，状态码: $HEALTH" >> ~/monitor.log
  docker compose -f ~/WeKnora/docker-compose.yml restart app
fi
EOF

chmod +x ~/monitor.sh
crontab -e
# 添加：
# */10 * * * * /home/ubuntu/monitor.sh
```

### 11.4 永远不要做的事

- ❌ 不要升级到 Paid Account（会失去 Always Free 资格）
- ❌ 不要在 Always Free 实例上跑高负载业务（如挖矿、视频转码）
- ❌ 不要超过 Always Free 配额（如多开 ARM 实例）
- ❌ 不要长时间关机

---

## 十二、数据备份与恢复

### 12.1 手动备份

```bash
cd ~/WeKnora

# 备份 Postgres
docker compose exec -T postgres pg_dump -U weknora weknora > backups/postgres_$(date +%F).sql

# 备份 MinIO（使用 mc 客户端）
docker run --rm \
  -v $(pwd)/minio-data:/data \
  -v $(pwd)/backups:/backups \
  --entrypoint sh \
  minio/mc:latest \
  -c "mc alias set local /data <MINIO_ACCESS_KEY> <MINIO_SECRET_KEY> && mc mirror local/ /backups/minio/"
```

### 12.2 自动备份脚本

```bash
mkdir -p ~/backups

cat > ~/backup.sh <<'EOF'
#!/bin/bash
set -e

BACKUP_DIR=~/backups
DATE=$(date +%F_%H%M%S)
mkdir -p $BACKUP_DIR/$DATE

# 备份 Postgres
docker compose -f ~/WeKnora/docker-compose.yml exec -T postgres \
  pg_dump -U weknora weknora > $BACKUP_DIR/$DATE/postgres.sql

# 备份 .env 配置
cp ~/WeKnora/.env $BACKUP_DIR/$DATE/env

# 备份 docker-compose.override.yml
cp ~/WeKnora/docker-compose.override.yml $BACKUP_DIR/$DATE/ 2>/dev/null || true

# 压缩
tar -czf $BACKUP_DIR/weknora_backup_$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# 保留最近 30 天
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "[$(date)] 备份完成: $BACKUP_DIR/weknora_backup_$DATE.tar.gz"
EOF

chmod +x ~/backup.sh

# 设置每天凌晨 3 点自动备份
crontab -e
# 添加：
# 0 3 * * * /home/ubuntu/backup.sh >> /home/ubuntu/backup.log 2>&1
```

### 12.3 恢复备份

```bash
cd ~/WeKnora

# 停止应用
docker compose stop app

# 恢复 Postgres
cat backups/postgres_2026-XX-XX.sql | \
  docker compose exec -T postgres psql -U weknora -d weknora

# 启动应用
docker compose start app
```

### 12.4 异地备份（推荐）

为防止 Oracle 实例丢失导致备份一起丢失，建议将备份同步到其他云：

```bash
# 安装 rclone
curl https://rclone.org/install.sh | sudo bash

# 配置（按提示操作）
rclone config

# 同步备份到远程
rclone sync ~/backups remote:weknora-backups
```

可选项：
- Cloudflare R2（10GB 免费，零出站费用）
- Backblaze B2（10GB 免费）
- 阿里云 OSS（少量付费）

---

## 十三、常见问题与避坑清单

### 13.1 注册阶段坑点

| 问题 | 原因 | 解决方案 |
|---|---|---|
| 收不到验证邮件 | QQ 邮箱被屏蔽 | 换 Gmail / Outlook |
| 信用卡验证失败 | 账单地址不一致 | 用银行账单上的地址 |
| 短信收不到 | 运营商屏蔽 | 切换语音验证 |
| 账户审核超过 24 小时 | 系统排队 | 提交 Support Request |
| 提示 "Country not supported" | 用了 VPN | 关闭 VPN 后重试 |

### 13.2 实例创建坑点

| 问题 | 原因 | 解决方案 |
|---|---|---|
| Out of host capacity | ARM 容量紧张 | 换可用域 / 不同时段重试 |
| 实例创建后无法 SSH | Security List 没开 22 端口 | 见 [5.1](#51-配置-security-list云端层) |
| SSH 提示 Permission denied | 私钥权限不对 | `chmod 400 xxx.key` |
| 公网 IP 访问超时 | ufw 没开端口 | `sudo ufw allow 80/tcp` |

### 13.3 Docker 部署坑点

| 问题 | 原因 | 解决方案 |
|---|---|---|
| 拉取镜像超时 | 网络问题 | 配置镜像加速（见 [7.3](#73-配置-docker-镜像加速国内服务器必做)） |
| ARM 镜像不可用 | 用了 x86 镜像 | 检查 image 是否支持 arm64 |
| 端口被占用 | 端口冲突 | 修改 .env 中的 PORT |
| 容器启动失败 | 内存不足 | 检查 `free -h`，添加 swap |
| 数据库连接失败 | Postgres 未就绪 | 等待 30 秒后重试 |

### 13.4 WeKnora 运行坑点

| 问题 | 原因 | 解决方案 |
|---|---|---|
| 上传文档后无响应 | docreader 服务异常 | `docker compose logs docreader` |
| 向量检索慢 | embedding 模型慢 | 换更快的 embedding |
| LLM 回答超时 | API 限流 | 检查 API 配额 |
| 前端白屏 | 前端构建未完成 | 等待 5 分钟后刷新 |
| Wiki 模式不可用 | Neo4j 未启动 | 检查 docker-compose 配置 |

### 13.5 HTTPS 配置坑点

| 问题 | 原因 | 解决方案 |
|---|---|---|
| 证书申请失败 | 80 端口未开放 | 检查 Security List 和 ufw |
| 证书申请失败 | DNS 未生效 | 等待 DNS 传播完成 |
| 一周申请超过 5 次 | Let's Encrypt 限制 | 等待 7 天后重试 |
| Caddy 无法启动 | 80 端口被占用 | 修改 FRONTEND_PORT |

---

## 十四、成本与限额监控

### 14.1 Oracle Cloud 资源监控

1. Console → **Billing & Cost Management → Cost Analysis**
2. 查看本月消费（应为 $0）
3. 设置 **Budget Alert**：
   - 月预算：$1
   - 实际消费超过 $0.5 时邮件通知
   - 预测超过 $1 时邮件通知

### 14.2 资源使用监控

```bash
# 实时查看 CPU / 内存 / 磁盘
htop
df -h
free -h

# 查看各容器资源占用
docker stats
```

### 14.3 配置告警（可选）

Oracle Cloud 支持免费配额告警：

1. Console → **Observability & Management → Alarms**
2. 创建告警：
   - **Metric namespace**: oci_computeagent
   - **Metric name**: MemoryUtilization
   - **Threshold**: > 80%
   - **Notification**: 邮件

---

## 附录 A：备选方案

### A.1 AWS 免费方案（不推荐，仅参考）

若 Oracle Cloud 始终抢不到容量，可考虑 AWS：

1. 注册：https://aws.amazon.com/free/
2. 注意：2025.7.15 后新账户免费期 **只有 6 个月**，不是 12 个月
3. 12GB 内存需求不满足，建议：
   - 升级 t3.small（2GB，月费约 $15）
   - 或使用 Lightsail $5/月套餐（1GB，不够用）
4. **不推荐用 AWS 部署 WeKnora**

### A.2 Hetzner Cloud（性价比方案）

若不愿折腾 Oracle 容量：

1. 注册：https://www.hetzner.com/cloud
2. 选择 **CX23**（2 vCPU, 4GB RAM）：€3.49/月
3. 选择 **CX32**（4 vCPU, 8GB RAM）：€6.49/月（推荐）
4. 数据中心：德国 / 芬兰（国内访问尚可）
5. 部署步骤与本文档基本一致

### A.3 自建 NAS / 树莓派

若已有硬件：

- 树莓派 5（8GB）：约 ¥600
- 群晖 NAS：可跑 Docker
- 旧电脑：装 Ubuntu Server

**优点**：一次性投入，无月费
**缺点**：需公网 IP（电信用户可申请动态 DNS），电费自付

---

## 附录 B：关键命令速查

```bash
# ============ SSH 登录 ============
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<INSTANCE_PUBLIC_IP>

# ============ Docker 操作 ============
cd ~/WeKnora
docker compose up -d          # 启动
docker compose down           # 停止
docker compose restart        # 重启
docker compose ps             # 查看状态
docker compose logs -f app    # 查看日志
docker compose pull           # 更新镜像
docker compose up -d          # 应用更新

# ============ 系统监控 ============
htop                          # CPU/内存
df -h                         # 磁盘
docker stats                  # 容器资源
free -h                       # 内存

# ============ 网络检查 ============
sudo ufw status               # 防火墙
curl http://localhost:8080/api/health  # 健康检查
ss -tlnp                      # 端口占用

# ============ 备份恢复 ============
./backup.sh                   # 手动备份
ls ~/backups/                 # 查看备份
docker compose exec -T postgres pg_dump -U weknora weknora > backup.sql  # 单独备份DB

# ============ 故障排查 ============
docker compose logs --tail=100 app
docker compose logs --tail=100 postgres
docker compose logs --tail=100 redis
docker compose exec app ls /app
```

---

## 验收清单

完成本指南后，请逐项确认：

- [ ] Oracle Cloud 账户已注册并激活
- [ ] ARM Ampere A1 实例（2 OCPU + 12GB RAM）已创建并 Running
- [ ] 公网 IP 可访问，SSH 可登录
- [ ] Security List 已开放 22/80/443 端口
- [ ] ufw 防火墙已配置
- [ ] Docker 与 Docker Compose 已安装
- [ ] Docker 镜像加速已配置
- [ ] Swap 已创建（4GB）
- [ ] WeKnora 代码已克隆
- [ ] .env 已配置强密码
- [ ] `docker compose up -d` 成功启动
- [ ] `curl http://localhost:8080/api/health` 返回 200
- [ ] 浏览器可访问 `http://<INSTANCE_PUBLIC_IP>`
- [ ] 管理员账户已创建
- [ ] LLM API 已配置并可测试通过
- [ ] Embedding 模型已配置
- [ ] 域名 A 记录已生效（如使用 HTTPS）
- [ ] Caddy 已启动，HTTPS 证书已申请
- [ ] `https://weknora.yourdomain.com` 可访问
- [ ] crontab 保活任务已设置
- [ ] 自动备份脚本已配置
- [ ] Oracle Cost Budget Alert 已设置

---

## 参考资料

- [WeKnora GitHub 仓库](https://github.com/Tencent/WeKnora)
- [WeKnora Issue #2 - 最低硬件要求](https://github.com/Tencent/WeKnora/issues/2)
- [Oracle Cloud Always Free 官方文档](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
- [Oracle Cloud Free Tier 注册页](https://www.oracle.com/cloud/free/)
- [Oracle 2026 年 6 月政策变化分析](https://terminalbytes.com/oracle-cloud-free-tier-changes-2026/)
- [Docker 官方文档](https://docs.docker.com/)
- [Caddy 官方文档](https://caddyserver.com/docs/)

---

**祝部署顺利！如遇到本指南未覆盖的问题，建议查阅 WeKnora 的 [GitHub Issues](https://github.com/Tencent/WeKnora/issues) 或 [Discussions](https://github.com/Tencent/WeKnora/discussions)。**
