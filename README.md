# 方糖博客 - AstroPaper 风格 + WordPress 无头方案

## 项目特点

- 🎨 **AstroPaper 风格主题** - 简约、响应式、支持暗色模式
- ⚡ **高性能** - 静态生成，零 JS 输出
- 🔒 **源站隔离** - WordPress 后台完全隐藏
- 💬 **Twikoo 评论** - 集成第三方评论系统
- 📱 **响应式设计** - 手机/平板/桌面完美适配
- 🔍 **SEO 友好** - 完整的 meta 标签和结构化数据

## 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | Astro 4.x |
| 样式 | TailwindCSS |
| CMS | WordPress (无头) |
| 评论 | Twikoo |
| 部署 | 静态托管 |

## 目录结构

```
/www/wwwroot/wp.iblue/
├── src/
│   ├── components/
│   │   └── Twikoo.astro      # 评论组件
│   ├── layouts/
│   │   └── Layout.astro      # 全局布局
│   ├── lib/
│   │   └── wp.ts             # WordPress API 封装
│   ├── pages/
│   │   ├── index.astro       # 首页
│   │   └── [...slug].astro   # 文章详情页
│   └── styles/
│       └── global.css        # 全局样式
├── public/
│   └── favicon.svg           # 站点图标
├── dist/                     # 构建输出
├── old/                      # 原 WordPress 备份
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── deploy.sh                 # 部署脚本
```

## 快速开始

### 安装依赖

```bash
cd /www/wwwroot/wp.iblue
npm install
```

### 本地开发

```bash
npm run dev
# 访问 http://localhost:4321
```

### 构建生产版本

```bash
npm run build
# 输出到 dist/ 目录
```

### 部署

运行一键部署脚本：

```bash
./deploy.sh
```

或手动部署：

```bash
# 复制 dist 内容到网站根目录
rsync -av --delete /www/wwwroot/wp.iblue/dist/ /www/wwwroot/wp.iblue/
```

## Nginx 配置

```nginx
server {
    listen 80;
    server_name fangtang.net;
    root /www/wwwroot/wp.iblue;
    index index.html;
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # 保护 WordPress 后台（只允许特定 IP）
    location /wp-admin {
        allow 你的 IP;
        deny all;
    }
    
    location /wp-json {
        allow 你的 IP;
        deny all;
    }
}
```

## 更新内容

当 WordPress 发布新文章后：

```bash
cd /www/wwwroot/wp.iblue
npm run build
./deploy.sh
```

## 定时构建（可选）

添加 cron 任务每天自动构建：

```bash
# 每天 6 点构建
0 6 * * * cd /www/wwwroot/wp.iblue && npm run build >> /var/log/astro-build.log 2>&1
```

## 自定义

### 修改站点信息

编辑 `src/layouts/Layout.astro`：
- 修改站点名称 "方糖博客"
- 修改导航菜单
- 修改页脚信息

### 调整颜色主题

编辑 `tailwind.config.mjs`：

```js
colors: {
  primary: '#0066cc',  // 主色调
  dark: '#0f172a',     // 暗色背景
}
```

### 修改文章数量

编辑 `src/pages/index.astro`，修改 `getPosts(20)` 中的数字。

### 自定义 Twikoo 配置

编辑 `src/components/Twikoo.astro`：

```js
twikoo.init({
  el: '#twikoo',
  envId: 'https://twikoo.iblue.eu.org',  // 你的 Twikoo 服务地址
  path: path,
  lang: 'zh-CN',
  // 更多配置参考 Twikoo 文档
});
```

## 功能特性

### ✅ 已实现

- [x] 首页文章列表（最新 20 篇）
- [x] 文章详情页
- [x] 暗色/亮色模式切换
- [x] Twikoo 评论集成
- [x] RSS 订阅
- [x] SEO 优化（meta 标签、OG 标签）
- [x] 响应式设计
- [x] 源站保护

### 🔄 可添加

- [ ] 分类/标签页面
- [ ] 全文搜索（Pagefind）
- [ ] 分页功能
- [ ] 图片本地化
- [ ] 阅读进度条
- [ ] 相关文章推荐

## 注意事项

1. **图片仍来自原站**：`<img>` 标签的 src 仍指向 fangtang.net
2. **评论路径**：每篇文章的评论路径为 `/{slug}`，与文章 URL 一致
3. **构建时间**：100 篇文章约需 20-25 秒

## 相关资源

- [Astro 文档](https://docs.astro.build/)
- [AstroPaper 主题](https://github.com/satnaing/astro-paper)
- [TailwindCSS](https://tailwindcss.com/)
- [Twikoo 评论](https://twikoo.js.org/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

---

*构建时间：2026-02-26*
*版本：1.0.0*
