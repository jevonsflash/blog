/**
 * Register the Hexo generator for generating the <code>/categories/</code> page.
 * @module hexo/generator/categories
 */

/**
 * Register the Hexo generator for generating the <code>/categories/</code> page.
 * <p>
 * A <code>__categories: true</code> property will be attached to the page local
 * variables.
 *
 * @param {Hexo} hexo The Hexo instance.
 */

'use strict';

const pagination = require('hexo-pagination');

module.exports = function (hexo) {
  const config = hexo.config;

  hexo.extend.generator.register('repost-index', (locals) => {
    const posts = locals.posts
    .filter((c) => c.categories.some(obj => obj.name === '转载'))
    .sort(config.index_generator.order_by);
  
    posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));
  
    const paginationDir = config.pagination_dir || 'page';
    const path = (config.index_generator.path || '')+'repost/';

    return pagination(path, posts, {
      perPage: config.index_generator.per_page,
      layout: ['filtered-index'],
      format: paginationDir + '/%d/',
      data: {
        __index: true,
        __categories: true,
        type: 'repost'
      }
    });
  });
};
