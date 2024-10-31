# 开发记录

## 初始化项目

1. 添加日志文件
2. 初始化 vue 项目

```bash
# 使用 TS,
# 启用 Router、Pinia（页面跳转和状态管理功能支持）
# 引入ESLint、Prettier（校验和格式化代码）
npm create vue@latest
npm install
npm format
npm run dev
```

3. 修改配置

> [.gitignore](./.gitignore)中添加 vscode 的 history 文件夹，避免上传冗余的历史文件

```bash
# .gitignore
# Editor directories and files
# ……
.history
```

4. 删除项目初始冗余的组件和代码
