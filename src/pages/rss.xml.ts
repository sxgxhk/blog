import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/wp';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  
  return rss({
    title: '方糖博客',
    description: '方糖博客 - 记录生活与技术',
    site: 'https://cms.fangtang.net',
    items: posts.map((post) => ({
      title: post.title.rendered,
      pubDate: new Date(post.date),
      link: `/${post.link.match(/(?:cms\.)?fangtang\.net\/(.+)\.html/)?.[1]}.html`,
      description: post.excerpt.rendered,
    })),
    customData: `<language>zh-CN</language>`,
  });
};
