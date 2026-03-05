# 部署指南

本文档将指导你完成博客系统的完整部署流程。

## 📋 前置准备

- GitHub 账号
- Cloudflare 账号（免费）
- Node.js 18+ 环境

## 🚀 部署步骤

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 创建新仓库（例如：`frontend-knowledge-base`）
3. 将本地代码推送到仓库：

```bash
git init
git add .
git commit -m "初始化博客系统"
git branch -M main
git remote add origin https://github.com/你的用户名/frontend-knowledge-base.git
git push -u origin main
```

### 2. 配置 Giscus 评论系统

1. 访问 https://giscus.app
2. 输入你的仓库地址（例如：`username/frontend-knowledge-base`）
3. 确保仓库满足以下条件：
   - 仓库是公开的
   - 已安装 [giscus app](https://github.com/apps/giscus)
   - 已启用 Discussions 功能（在仓库 Settings → Features 中开启）
4. 选择配置：
   - 页面 ↔️ discussion 映射关系：选择 `pathname`
   - Discussion 分类：选择 `General` 或创建新分类
   - 主题：选择 `preferred_color_scheme`
5. 复制生成的配置代码中的以下参数：
   - `data-repo`
   - `data-repo-id`
   - `data-category`
   - `data-category-id`
6. 编辑 `.vitepress/theme/MyLayout.vue`，替换对应的值：

```vue
<component :is="'script'"
  src="https://giscus.app/client.js"
  data-repo="你的用户名/你的仓库名"
  data-repo-id="你的仓库ID"
  data-category="General"
  data-category-id="你的分类ID"
  ...
```

7. 提交更改：

```bash
git add .vitepress/theme/MyLayout.vue
git commit -m "配置 Giscus 评论系统"
git push
```

### 3. 配置 Cloudflare Pages

#### 3.1 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 `Workers & Pages` → `Pages`
3. 点击 `Create application` → `Connect to Git`
4. 授权 GitHub 并选择你的仓库
5. 配置构建设置：
   - **项目名称**：`frontend-knowledge-base`（或自定义）
   - **生产分支**：`main`
   - **构建命令**：`npm run build`
   - **构建输出目录**：`.vitepress/dist`
6. 点击 `Save and Deploy`

#### 3.2 获取 Cloudflare API 凭证

1. 在 Cloudflare Dashboard 右上角点击头像
2. 进入 `My Profile` → `API Tokens`
3. 点击 `Create Token`
4. 选择 `Edit Cloudflare Workers` 模板
5. 配置权限：
   - Account Resources: `Include` → 选择你的账号
   - Zone Resources: `Include` → `All zones`
6. 点击 `Continue to summary` → `Create Token`
7. 复制生成的 Token（只显示一次，请妥善保存）

#### 3.3 获取 Account ID

1. 在 Cloudflare Dashboard 中
2. 进入 `Workers & Pages`
3. 右侧可以看到 `Account ID`，复制它

#### 3.4 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`
4. 添加以下两个 secrets：

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: 粘贴你在步骤 3.2 中获取的 API Token

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: 粘贴你在步骤 3.3 中获取的 Account ID

### 4. 测试自动部署

1. 修改任意文件（例如 `README.md`）
2. 提交并推送：

```bash
git add .
git commit -m "测试自动部署"
git push
```

3. 访问 GitHub 仓库的 `Actions` 标签页
4. 查看部署进度
5. 部署成功后，访问 Cloudflare Pages 提供的域名

## 🎯 验证部署

访问你的博客地址，检查以下功能：

- ✅ 首页正常显示
- ✅ 导航栏可以切换分类
- ✅ 侧边栏显示文章列表
- ✅ 文章页面正常渲染
- ✅ 搜索功能可用
- ✅ 评论系统正常工作
- ✅ 暗黑模式切换正常

## 🔧 自定义域名（可选）

### 在 Cloudflare Pages 中配置

1. 进入你的 Pages 项目
2. 点击 `Custom domains`
3. 点击 `Set up a custom domain`
4. 输入你的域名（例如：`blog.example.com`）
5. 按照提示添加 DNS 记录
6. 等待 DNS 生效（通常几分钟到几小时）

## 📝 日常使用

### 发布新文章

**方式一：智能归档（推荐）**

```bash
npm run archive
# 粘贴文章内容，系统自动分类和创建
```

**方式二：手动创建**

```bash
npm run new javascript/promise
# 编辑生成的文件
```

### 推送到线上

```bash
npm run publish
# 或者
git add .
git commit -m "新增文章"
git push
```

GitHub Actions 会自动构建并部署到 Cloudflare Pages。

## ⚠️ 常见问题

### 1. GitHub Actions 部署失败

检查：
- Secrets 是否正确配置
- API Token 权限是否足够
- Account ID 是否正确

### 2. 评论系统不显示

检查：
- 仓库是否公开
- 是否安装了 giscus app
- 是否启用了 Discussions
- 配置参数是否正确

### 3. 搜索功能不可用

确保：
- 执行了 `npm run build`
- Pagefind 索引已生成
- 部署了完整的 dist 目录

### 4. 样式显示异常

清除缓存：
- 浏览器缓存
- Cloudflare 缓存（在 Pages 项目中点击 `Purge cache`）

## 🎉 完成

恭喜！你的博客系统已经成功部署。现在可以开始写作了！

记住核心命令：
```bash
npm run archive  # 智能归档文章
npm run publish  # 发布到线上
```

享受写作的乐趣吧！ 📝
