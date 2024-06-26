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
module.exports = function (hexo) {
  hexo.extend.generator.register('original-index', (locals) => {
    return {
      path: 'original/',
      layout: ['filtered-index'],
      data: Object.assign({}, locals, {
        __categories: true,
        type: 'original'
      }),
    };
  });
};
