# WordPress 无头方案 (Headless WordPress)

## 快速开始

### 1. 安装 WordPress
在服务器上安装 WordPress，可以选择：
- 手动安装: https://wordpress.org/download/
- 使用宝塔面板
- 使用 Docker

### 2. 配置 WordPress REST API
确保 WordPress 已启用 REST API（默认已启用）

安装 REST API 插件增强功能（可选）:
- "WP REST API Controller" - 控制API输出字段
- "ACF to REST API" - 暴露 ACF 字段

### 3. 配置前端
编辑 `app.js`，修改以下配置：

```javascript
// 改为你的 WordPress 地址
const WP_API_URL = 'https://your-wordpress.com/wp-json/wp/v2';
```

### 4. 部署
将整个目录上传到你的服务器，例如：
- `/home/www/wordpress-headless/`

### 5. 配置 Nginx
```nginx
server {
    listen 80;
    server_name wp-news.yourdomain.com;
    
    root /home/www/wordpress-headless;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 功能特性

- ✅ REST API 获取文章
- ✅ 文章分类筛选
- ✅ 分页加载
- ✅ 文章详情弹窗
- ✅ 响应式设计
- ✅ 风格参照 botnews

## 自定义

### 修改分类
在 `index.html` 中修改导航链接的 data-category：
```html
<a href="#" data-category="tech">科技</a>
<a href="#" data-category="news">新闻</a>
```

### 修改颜色
在 `styles.css` 中修改 CSS 变量：
```css
:root {
    --primary: #2563eb;  /* 主色调 */
}
```

## 文件结构
```
wordpress-headless/
├── index.html      # 主页面
├── styles.css     # 样式文件
├── app.js         # JavaScript
├── README.md      # 说明文档
```
