#!/bin/bash

# OAuth配置更新脚本
# 用于更新Gitalk的OAuth配置

echo "🔧 Gitalk OAuth配置更新脚本"
echo "================================"

# 检查参数
if [ $# -ne 2 ]; then
    echo "❌ 使用方法: $0 <CLIENT_ID> <CLIENT_SECRET>"
    echo ""
    echo "📋 步骤说明:"
    echo "1. 访问 https://github.com/settings/applications/new"
    echo "2. 创建新的OAuth应用，填写以下信息:"
    echo "   - Application name: Lanniny Blog Comments"
    echo "   - Homepage URL: https://lanniny-blog.netlify.app"
    echo "   - Authorization callback URL: https://lanniny-blog.netlify.app/"
    echo "3. 复制Client ID和Client Secret"
    echo "4. 运行: $0 <CLIENT_ID> <CLIENT_SECRET>"
    echo ""
    echo "🔒 安全提示:"
    echo "- 确保my_blog_source仓库是公开的"
    echo "- 不要在公开场所分享Client Secret"
    exit 1
fi

CLIENT_ID="$1"
CLIENT_SECRET="$2"

echo "📝 更新配置文件..."

# 备份原配置
cp hugo.yaml hugo.yaml.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ 已备份原配置文件"

# 更新Client ID
sed -i.tmp "s/clientID: \".*\"/clientID: \"$CLIENT_ID\"/" hugo.yaml
echo "✅ 已更新Client ID"

# 更新Client Secret
sed -i.tmp "s/clientSecret: \".*\"/clientSecret: \"$CLIENT_SECRET\"/" hugo.yaml
echo "✅ 已更新Client Secret"

# 清理临时文件
rm -f hugo.yaml.tmp

echo ""
echo "🎉 配置更新完成！"
echo ""
echo "📋 下一步操作:"
echo "1. 检查配置: cat hugo.yaml | grep -A 5 gitalk"
echo "2. 提交更改: git add hugo.yaml && git commit -m 'update: OAuth配置更新'"
echo "3. 推送部署: git push origin main"
echo "4. 测试评论: 访问博客文章页面测试评论功能"
echo ""
echo "🔍 故障排除:"
echo "- 如果仍有403错误，检查仓库是否为公开"
echo "- 确认回调URL完全匹配: https://lanniny-blog.netlify.app/"
echo "- 检查OAuth应用的权限范围"
echo ""
echo "📞 需要帮助？查看配置指南: /page/gitalk-setup-guide/"
