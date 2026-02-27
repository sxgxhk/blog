#!/bin/bash

# 方糖博客 - Astro 构建脚本
# 生成的文件在 dist/ 目录，用户可配置 Nginx 指向该目录

set -e

PROJECT_DIR="/www/wwwroot/wp.iblue"
DIST_DIR="$PROJECT_DIR/dist"

echo "🚀 开始构建方糖博客..."
echo ""

cd "$PROJECT_DIR"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，安装依赖..."
    npm install
fi

# 构建
echo "🔨 构建中..."
npm run build

# 检查构建结果
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

# 统计
PAGE_COUNT=$(find "$DIST_DIR" -name "*.html" | wc -l)
BUILD_SIZE=$(du -sh "$DIST_DIR" | cut -f1)

echo ""
echo "✅ 构建完成！"
echo ""
echo "📊 构建统计："
echo "   📄 页面数量：$PAGE_COUNT"
echo "   📦 构建大小：$BUILD_SIZE"
echo ""
echo "📁 生成的文件位于：$DIST_DIR"
echo ""
echo "🔧 Nginx 配置示例："
echo ""
echo "   server {"
echo "       listen 80;"
echo "       server_name fangtang.net;"
echo "       root /www/wwwroot/wp.iblue/dist;  # 指向 dist 目录"
echo "       index index.html;"
echo ""
echo "       # 静态资源缓存"
echo "       location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|webp)\$ {"
echo "           expires 30d;"
echo "           add_header Cache-Control \"public, immutable\";"
echo "       }"
echo ""
echo "       # 保护 WordPress 后台"
echo "       location /wp-admin {"
echo "           allow 你的IP;"
echo "           deny all;"
echo "       }"
echo "       location /wp-json {"
echo "           allow 你的IP;"
echo "           deny all;"
echo "       }"
echo "   }"
echo ""

# --- FTP 上传配置 ---
FTP_HOST="103.106.189.9"
FTP_PORT="57521"
FTP_USER="blog"
FTP_PASS="i35KKNN6Kh9c"
FTP_REMOTE_DIR="/" # 如果需要上传到子目录，请修改此处

echo "📤 开始上传到 FTP..."
if command -v lftp >/dev/null 2>&1; then
    lftp -c "set ftp:ssl-allow no; open -u $FTP_USER,$FTP_PASS -p $FTP_PORT $FTP_HOST; mirror -R $DIST_DIR $FTP_REMOTE_DIR"
    echo "✅ FTP 上传完成！"
else
    echo "❌ 错误: 未安装 lftp，无法自动上传。"
    exit 1
fi

echo "✨ 完成！"
