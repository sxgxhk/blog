// WordPress API 封装
const WP_API = 'https://cms.fangtang.net/wp-json/wp/v2';

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WPAuthor[];
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: [WPCategory[], WPTag[]];
  };
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes: {
      medium?: { source_url: string };
      large?: { source_url: string };
      full?: { source_url: string };
    };
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

// 获取所有文章（支持分页获取全部）
export async function getAllPosts(): Promise<WPPost[]> {
  const allPosts: WPPost[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore && page <= 10) {  // 最多获取1000篇
    try {
      const res = await fetch(
        `${WP_API}/posts?per_page=100&page=${page}&_embed`
      );
      if (!res.ok) break;
      const posts = await res.json();
      if (!Array.isArray(posts) || posts.length === 0) {
        hasMore = false;
      } else {
        allPosts.push(...posts);
        page++;
        if (posts.length < 100) hasMore = false;
      }
    } catch (e) {
      console.error('Error fetching posts:', e);
      break;
    }
  }
  
  return allPosts;
}

// 获取文章（分页）
export async function getPosts(perPage = 20, page = 1): Promise<WPPost[]> {
  const res = await fetch(
    `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed`
  );
  if (!res.ok) return [];
  return await res.json();
}

// 获取文章总数
export async function getPostsTotal(): Promise<number> {
  const res = await fetch(`${WP_API}/posts?per_page=1`);
  return parseInt(res.headers.get('X-WP-Total') || '0');
}

// 获取单篇文章
export async function getPostById(id: number): Promise<WPPost | null> {
  const res = await fetch(`${WP_API}/posts/${id}?_embed`);
  if (!res.ok) return null;
  return await res.json();
}

// 获取所有分类
export async function getCategories(): Promise<WPCategory[]> {
  const allCategories: WPCategory[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const res = await fetch(`${WP_API}/categories?per_page=100&page=${page}`);
    if (!res.ok) break;
    const categories = await res.json();
    if (categories.length === 0) {
      hasMore = false;
    } else {
      allCategories.push(...categories);
      page++;
      if (categories.length < 100) hasMore = false;
    }
  }
  
  return allCategories;
}

// 获取所有标签
export async function getTags(): Promise<WPTag[]> {
  const allTags: WPTag[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const res = await fetch(`${WP_API}/tags?per_page=100&page=${page}`);
    if (!res.ok) break;
    const tags = await res.json();
    if (tags.length === 0) {
      hasMore = false;
    } else {
      allTags.push(...tags);
      page++;
      if (tags.length < 100) hasMore = false;
    }
  }
  
  return allTags;
}

// 根据分类获取文章
export async function getPostsByCategory(categoryId: number): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?categories=${categoryId}&per_page=100&_embed`
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

// 根据标签获取文章
export async function getPostsByTag(tagId: number): Promise<WPPost[]> {
  const res = await fetch(
    `${WP_API}/posts?tags=${tagId}&per_page=100&_embed`
  );
  if (!res.ok) return [];
  return await res.json();
}

// 格式化日期
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 格式化日期（短格式）
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 获取年份
export function getYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

// 获取年月
export function getYearMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// 提取slug
export function extractSlug(link: string): string {
  const match = link.match(/(?:cms\.)?fangtang\.net\/(.+)\.html/);
  if (match) {
    return match[1];
  }
  return '';
}

// 清理 HTML 标签
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

// 清理摘要中的 [...] 和 []
export function cleanExcerpt(excerpt: string): string {
  if (!excerpt) return '';
  return excerpt
    .replace(/&hellip;/g, '')
    .replace(/\[\.\.\.\]/g, '')
    .replace(/\[\]/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 获取页面
export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  link: string;
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const res = await fetch(`${WP_API}/pages?slug=${slug}`);
  if (!res.ok) return null;
  const pages = await res.json();
  return pages[0] || null;
}