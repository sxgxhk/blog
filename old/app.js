(function() {
    // 配置
    var USE_PROXY = true;
    var TWIKOO_ENV = 'twikoo.iblue.eu.org';
    
    // API URL 构造
    function getApiUrl(endpoint, params) {
        var url = USE_PROXY ? 'api.php?endpoint=' + endpoint : 'https://fangtang.net/wp-json/wp/v2/' + endpoint;
        var arr = [];
        for (var k in (params || {})) {
            arr.push(k + '=' + encodeURIComponent(params[k]));
        }
        return url + (arr.length ? '?' + arr.join('&') : '');
    }
    
    // 状态
    var state = {
        page: 1,
        category: 'all',
        totalPages: 1,
        currentView: 'list' // list, archives, detail
    };
    
    // DOM 元素
    var els = {
        loading: document.getElementById('loading'),
        newsList: document.getElementById('newsList'),
        archivesList: document.getElementById('archivesList'),
        pagination: document.getElementById('pagination'),
        articleModal: document.getElementById('articleModal'),
        articleContent: document.getElementById('articleContent')
    };
    
    // 初始化
    function init() {
        bindEvents();
        loadPosts();
        checkUrl();
    }
    
    // 绑定事件
    function bindEvents() {
        var navLinks = document.querySelectorAll('.nav-link');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', handleNavClick);
        }
        
        // 点击背景关闭弹窗
        els.articleModal.addEventListener('click', function(e) {
            if (e.target === els.articleModal) {
                closeModal();
            }
        });
        
        // ESC 关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }
    
    // 处理导航点击
    function handleNavClick(e) {
        e.preventDefault();
        var link = e.currentTarget;
        var category = link.getAttribute('data-category');
        var page = link.getAttribute('data-page');
        
        // 更新选中状态
        var navLinks = document.querySelectorAll('.nav-link');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('active');
        }
        link.classList.add('active');
        
        if (page === 'archives') {
            loadArchives();
        } else if (category) {
            state.category = category;
            state.page = 1;
            state.currentView = 'list';
            els.newsList.style.display = 'block';
            els.archivesList.style.display = 'none';
            loadPosts();
        }
    }
    
    // 检查 URL 参数
    function checkUrl() {
        var params = new URLSearchParams(window.location.search);
        var id = params.get('id');
        if (id) {
            loadArticleDetail(id);
        }
    }
    
    // 加载文章列表
    function loadPosts() {
        showLoading();
        
        var url = getApiUrl('posts', {
            _embed: true,
            per_page: 15,
            page: state.page
        });
        
        // 如果有分类筛选
        if (state.category !== 'all') {
            getCategoryId(state.category, function(catId) {
                if (catId) {
                    url = getApiUrl('posts', {
                        _embed: true,
                        per_page: 15,
                        page: state.page,
                        categories: catId
                    });
                }
                fetchPosts(url);
            });
        } else {
            fetchPosts(url);
        }
    }
    
    // 获取分类 ID
    function getCategoryId(slug, callback) {
        fetch(getApiUrl('categories', { slug: slug }))
            .then(function(r) { return r.json(); })
            .then(function(cats) {
                callback(cats.length > 0 ? cats[0].id : null);
            })
            .catch(function() { callback(null); });
    }
    
    // 获取文章列表
    function fetchPosts(url) {
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(posts) {
                // 计算总页数
                state.totalPages = Math.ceil(posts.length / 15) || 1;
                renderPosts(posts);
                renderPagination();
                hideLoading();
            })
            .catch(function(err) {
                console.error(err);
                els.newsList.innerHTML = '<p style="text-align:center;padding:2rem;">加载失败</p>';
                hideLoading();
            });
    }
    
    // 渲染文章列表
    function renderPosts(posts) {
        if (!posts || posts.length === 0) {
            els.newsList.innerHTML = '<p style="text-align:center;padding:2rem;color:#666;">暂无文章</p>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < posts.length; i++) {
            var post = posts[i];
            var category = '';
            try {
                category = post._embedded['wp:term'][0][0].name;
            } catch(e) {}
            
            var date = new Date(post.date);
            var dateStr = date.getFullYear() + '-' + 
                String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                String(date.getDate()).padStart(2, '0');
            
            // 摘要
            var excerpt = '';
            try {
                excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 120);
            } catch(e) {}
            
            html += '<article class="news-card" onclick="openArticle(' + post.id + ')">';
            html += '<div class="news-card-content">';
            html += '<span class="news-card-category">' + (category || '未分类') + '</span>';
            html += '<h2 class="news-card-title">' + post.title.rendered + '</h2>';
            if (excerpt) {
                html += '<p class="news-card-excerpt">' + excerpt + '...</p>';
            }
            html += '<div class="news-card-meta">';
            html += '<span>📅 ' + dateStr + '</span>';
            html += '</div></div></article>';
        }
        
        els.newsList.innerHTML = html;
    }
    
    // 渲染分页
    function renderPagination() {
        if (state.totalPages <= 1) {
            els.pagination.innerHTML = '';
            return;
        }
        
        var html = '';
        
        if (state.page > 1) {
            html += '<button class="page-btn" onclick="goToPage(' + (state.page - 1) + ')">上一页</button>';
        }
        
        for (var i = 1; i <= state.totalPages; i++) {
            if (i === 1 || i === state.totalPages || (i >= state.page - 1 && i <= state.page + 1)) {
                html += '<button class="page-btn ' + (i === state.page ? 'active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
            }
        }
        
        if (state.page < state.totalPages) {
            html += '<button class="page-btn" onclick="goToPage(' + (state.page + 1) + ')">下一页</button>';
        }
        
        els.pagination.innerHTML = html;
    }
    
    // 加载归档
    function loadArchives() {
        state.currentView = 'archives';
        showLoading();
        
        els.newsList.style.display = 'none';
        els.archivesList.style.display = 'block';
        
        fetch(getApiUrl('posts', { _embed: true, per_page: 100 }))
            .then(function(r) { return r.json(); })
            .then(function(posts) {
                // 按年份分组
                var archives = {};
                for (var i = 0; i < posts.length; i++) {
                    var year = new Date(posts[i].date).getFullYear();
                    if (!archives[year]) archives[year] = [];
                    archives[year].push(posts[i]);
                }
                
                // 渲染
                var html = '';
                var years = Object.keys(archives).sort(function(a, b) { return b - a; });
                
                for (var j = 0; j < years.length; j++) {
                    var year = years[j];
                    html += '<div class="archives-year">';
                    html += '<h3>' + year + ' 年</h3>';
                    html += '<div class="archives-posts">';
                    
                    var yearPosts = archives[year];
                    for (var k = 0; k < yearPosts.length; k++) {
                        var post = yearPosts[k];
                        var date = new Date(post.date);
                        var monthDay = String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                                       String(date.getDate()).padStart(2, '0');
                        
                        html += '<div class="archive-item" onclick="openArticle(' + post.id + ')">';
                        html += '<span class="archive-date">' + monthDay + '</span>';
                        html += '<span class="archive-title">' + post.title.rendered + '</span>';
                        html += '</div>';
                    }
                    
                    html += '</div></div>';
                }
                
                els.archivesList.innerHTML = html;
                els.pagination.innerHTML = '';
                hideLoading();
            })
            .catch(function() {
                els.archivesList.innerHTML = '<p style="text-align:center;padding:2rem;">加载失败</p>';
                hideLoading();
            });
    }
    
    // 打开文章详情
    window.openArticle = function(id) {
        showLoading();
        
        fetch(getApiUrl('posts/' + id, { _embed: true }))
            .then(function(r) { return r.json(); })
            .then(function(post) {
                var category = '';
                try {
                    category = post._embedded['wp:term'][0][0].name;
                } catch(e) {}
                
                var date = new Date(post.date);
                var dateStr = date.getFullYear() + '-' + 
                    String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(date.getDate()).padStart(2, '0');
                
                var html = '<div class="article-cover"></div>';
                html += '<span class="article-category">' + (category || '未分类') + '</span>';
                html += '<h1 class="article-title">' + post.title.rendered + '</h1>';
                html += '<div class="article-meta">';
                html += '<span>📰 ' + post.source + '</span>';
                html += '<span>📅 ' + dateStr + '</span>';
                html += '</div>';
                html += '<div class="article-body">' + post.content.rendered + '</div>';
                html += '<div class="source-link">';
                html += '📎 原文: <a href="' + post.link + '" target="_blank">' + post.link + '</a>';
                html += '</div>';
                
                els.articleContent.innerHTML = html;
                els.articleModal.classList.add('show');
                hideLoading();
                
                // 初始化 Twikoo
                if (window.twikoo) {
                    twikoo.init({
                        envId: TWIKOO_ENV,
                        el: '#twikoo',
                        path: 'wp-' + id
                    });
                }
            })
            .catch(function() {
                els.articleContent.innerHTML = '<p style="text-align:center;padding:2rem;">加载失败</p>';
                hideLoading();
            });
    };
    
    // 关闭弹窗
    window.closeModal = function() {
        els.articleModal.classList.remove('show');
    };
    
    // 分页跳转
    window.goToPage = function(page) {
        state.page = page;
        loadPosts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 显示/隐藏加载状态
    function showLoading() {
        els.loading.style.display = 'block';
    }
    
    function hideLoading() {
        els.loading.style.display = 'none';
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
