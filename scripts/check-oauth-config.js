#!/usr/bin/env node

/**
 * Gitalk OAuth配置检查脚本
 * 检查OAuth配置的正确性和仓库权限
 */

const https = require('https');
const fs = require('fs');
const yaml = require('js-yaml');

console.log('🔍 Gitalk OAuth配置检查工具');
console.log('================================\n');

// 读取配置文件
let config;
try {
    const fileContents = fs.readFileSync('hugo.yaml', 'utf8');
    config = yaml.load(fileContents);
    console.log('✅ 成功读取配置文件');
} catch (error) {
    console.error('❌ 无法读取配置文件:', error.message);
    process.exit(1);
}

// 提取Gitalk配置
const gitalkConfig = config.params?.comments?.gitalk;
if (!gitalkConfig) {
    console.error('❌ 未找到Gitalk配置');
    process.exit(1);
}

console.log('📋 当前配置:');
console.log(`   Owner: ${gitalkConfig.owner}`);
console.log(`   Repo: ${gitalkConfig.repo}`);
console.log(`   Client ID: ${gitalkConfig.clientID}`);
console.log(`   Client Secret: ${gitalkConfig.clientSecret ? '***已设置***' : '❌未设置'}`);
console.log('');

// 检查配置完整性
const checks = [
    {
        name: 'Owner配置',
        check: () => gitalkConfig.owner && gitalkConfig.owner.trim().length > 0,
        fix: '设置正确的GitHub用户名'
    },
    {
        name: 'Repo配置', 
        check: () => gitalkConfig.repo && gitalkConfig.repo.trim().length > 0,
        fix: '设置正确的GitHub仓库名'
    },
    {
        name: 'Client ID配置',
        check: () => gitalkConfig.clientID && gitalkConfig.clientID.trim().length > 0,
        fix: '从GitHub OAuth应用获取Client ID'
    },
    {
        name: 'Client Secret配置',
        check: () => gitalkConfig.clientSecret && gitalkConfig.clientSecret.trim().length > 0,
        fix: '从GitHub OAuth应用获取Client Secret'
    },
    {
        name: 'Client ID格式',
        check: () => gitalkConfig.clientID && gitalkConfig.clientID.startsWith('Ov'),
        fix: 'Client ID应该以"Ov"开头'
    }
];

console.log('🔍 配置检查结果:');
let allPassed = true;

checks.forEach(check => {
    const passed = check.check();
    console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
    if (!passed) {
        console.log(`      修复建议: ${check.fix}`);
        allPassed = false;
    }
});

console.log('');

// 检查仓库状态
function checkRepository() {
    return new Promise((resolve) => {
        const url = `https://api.github.com/repos/${gitalkConfig.owner}/${gitalkConfig.repo}`;
        
        https.get(url, {
            headers: {
                'User-Agent': 'Gitalk-Config-Checker'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const repo = JSON.parse(data);
                    resolve({
                        exists: res.statusCode === 200,
                        private: repo.private,
                        hasIssues: repo.has_issues,
                        statusCode: res.statusCode,
                        error: null
                    });
                } catch (error) {
                    resolve({
                        exists: false,
                        error: `解析响应失败: ${error.message}`,
                        statusCode: res.statusCode
                    });
                }
            });
        }).on('error', (error) => {
            resolve({
                exists: false,
                error: `网络请求失败: ${error.message}`,
                statusCode: null
            });
        });
    });
}

// 异步检查仓库
(async () => {
    console.log('🔍 检查GitHub仓库状态...');
    const repoStatus = await checkRepository();
    
    if (repoStatus.exists) {
        console.log('✅ 仓库存在');
        console.log(`   可见性: ${repoStatus.private ? '🔒 私有' : '🌍 公开'}`);
        console.log(`   Issues功能: ${repoStatus.hasIssues ? '✅ 已启用' : '❌ 未启用'}`);
        
        if (repoStatus.private) {
            console.log('⚠️  警告: 私有仓库需要更高的OAuth权限');
            console.log('   建议: 将仓库设为公开，或确保OAuth应用有repo权限');
        }
        
        if (!repoStatus.hasIssues) {
            console.log('❌ Issues功能未启用，Gitalk无法工作');
            console.log('   修复: 在仓库设置中启用Issues功能');
            allPassed = false;
        }
    } else {
        console.log('❌ 仓库不存在或无法访问');
        console.log(`   状态码: ${repoStatus.statusCode}`);
        if (repoStatus.error) {
            console.log(`   错误: ${repoStatus.error}`);
        }
        allPassed = false;
    }
    
    console.log('');
    
    // 最终结果
    if (allPassed) {
        console.log('🎉 所有检查通过！');
        console.log('');
        console.log('📋 下一步:');
        console.log('1. 确保OAuth应用的回调URL为: https://lanniny-blog.netlify.app/');
        console.log('2. 部署博客并测试评论功能');
        console.log('3. 如果仍有问题，检查浏览器控制台错误信息');
    } else {
        console.log('❌ 发现配置问题，请根据上述建议进行修复');
        console.log('');
        console.log('🔧 快速修复步骤:');
        console.log('1. 访问 https://github.com/settings/applications/new');
        console.log('2. 创建新的OAuth应用');
        console.log('3. 运行: ./scripts/update-oauth-config.sh <CLIENT_ID> <CLIENT_SECRET>');
        console.log('4. 重新运行此检查脚本');
    }
    
    console.log('');
    console.log('📞 需要帮助？查看详细指南: /page/gitalk-setup-guide/');
})();
