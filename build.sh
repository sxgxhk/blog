#!/bin/bash

# 方糖博客 - 一键构建脚本

cd /www/wwwroot/wp.iblue
npm run build

echo ""
echo "✅ 构建完成！"
echo "📁 文件位置: /www/wwwroot/wp.iblue/dist/"
echo ""
