下面给你一份 `README` 风格的精简版 `.md`，适合直接发给同事或放到项目文档里。

你可以保存为：

`README-Mac-Git-Gitee.md`

---

# Mac 下 Git / Gitee 配置说明（`guidemanageweb`）

## 项目信息

- 仓库地址：`https://gitee.com/zhitu-youcheng/guidemanageweb.git`
- 使用分支：`test`
- 提交用户名：`18361649187`
- 提交邮箱：`lip597907@gmail.com`

> 本文档采用 **HTTPS 方案**，并使用 **项目级配置**，不影响其他仓库。

---

## 1. 安装 Git

检查 Git 是否已安装：

```bash
git --version
```

如果未安装，执行：

```bash
xcode-select --install
```

---

## 2. 拉取项目

```bash
git clone -b test https://gitee.com/zhitu-youcheng/guidemanageweb.git
cd guidemanageweb
```

---

## 3. 配置当前项目 Git 信息

以下配置只对当前项目生效：

```bash
git config --local user.name "18361649187"
git config --local user.email "lip597907@gmail.com"
git config --local credential.helper osxkeychain
```

说明：

- `user.name` / `user.email`：提交记录身份
- `credential.helper osxkeychain`：使用 Mac 钥匙串保存 Gitee 凭证

---

## 4. 检查配置

```bash
git config --local --list
git remote -v
git branch -vv
```

确认：

- 当前分支为 `test`
- 远端为 `origin`
- 地址为 `https://gitee.com/zhitu-youcheng/guidemanageweb.git`

---

## 5. 首次拉取最新代码

```bash
git checkout test
git pull origin test
```

> 第一次执行时，可能会要求输入 Gitee 账号和密码 / token。

---

## 6. 日常开发流程

### 更新代码

```bash
git checkout test
git pull origin test
```

### 查看修改

```bash
git status
```

### 提交代码

提交全部修改：

```bash
git add .
git commit -m "提交说明"
git push origin test
```

如果只提交指定文件：

```bash
git add src/xxx
git commit -m "提交说明"
git push origin test
```

---

## 7. 认证说明

如果 `git pull` 或 `git push` 时要求登录：

- 用户名：你的 Gitee 账号
- 密码：Gitee 密码或个人访问令牌（token）

> 如果账号密码无法使用，建议在 Gitee 后台生成 token，并将 token 作为密码输入。

---

## 8. 常见问题

### 8.1 为什么要重新配置？

因为当前 Windows 机器里的 Git 本地配置不会自动同步到 Mac。  
Mac 上 clone 项目后，需要重新执行一次项目级配置。

---

### 8.2 为什么不用 `wincred`？

因为：

- `wincred` 是 Windows 的凭证管理方式
- Mac 下应使用 `osxkeychain`

---

### 8.3 如何确认配置只影响当前项目？

因为使用的是：

```bash
git config --local
```

这会把配置写入当前仓库的 `.git/config`，不会影响全局其他项目。

---

## 9. 一次性初始化命令

```bash
git clone -b test https://gitee.com/zhitu-youcheng/guidemanageweb.git
cd guidemanageweb
git config --local user.name "18361649187"
git config --local user.email "lip597907@gmail.com"
git config --local credential.helper osxkeychain
git pull origin test
```

---

## 10. 常用命令速查

### 查看本地配置

```bash
git config --local --list
```

### 查看远端地址

```bash
git remote -v
```

### 查看当前分支

```bash
git branch -vv
```

### 拉取最新代码

```bash
git checkout test
git pull origin test
```

### 提交并推送

```bash
git add .
git commit -m "提交说明"
git push origin test
```

---

如果你愿意，我还可以继续给你补一个更短的版本，比如：

- `3分钟快速上手版`
- `发群里的一段简洁说明`
- `带 token 申请步骤的 README 增强版`