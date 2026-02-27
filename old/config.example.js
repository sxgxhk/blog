/**
 * WordPress 无头前端配置
 * 
 * 使用方法：
 * 1. 复制此文件为 config.js
 * 2. 修改配置项
 * 3. 在 app.js 中引入
 */

// 你的 WordPress 地址（必填）
export const WP_CONFIG = {
    // WordPress REST API 地址
    apiUrl: 'https://your-wordpress.com/wp-json/wp/v2',
    
    // 每页显示文章数
    postsPerPage: 12,
    
    // 文章摘要长度（字符）
    excerptLength: 150,
    
    // 是否显示加载动画
    showLoading: true,
    
    // 分类映射（slug -> 名称）
    categories: {
        'all': '全部',
        'tech': '科技',
        'news': '新闻', 
        'life': '生活',
        'uncategorized': '未分类'
    }
};
