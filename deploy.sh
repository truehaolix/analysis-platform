#!/bin/bash
set -e

echo "🚀 开始部署到 GitHub Pages..."

# 切换到项目目录
cd "$(dirname "$0")"

# 构建项目
echo "📦 构建项目..."
pnpm build

# 切换到 gh-pages 部署目录
echo "📤 准备部署文件..."
cd gh-pages-deploy

# 清理并复制新文件
rm -rf * .gitkeep
cp -r ../dist/public/* .

# 提交并推送
echo "🔄 推送到 GitHub..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages

echo "✅ 部署完成！"
echo "🌐 网站将在 1-2 分钟后更新："
echo "   https://truehaolix.github.io/analysis-platform/"
