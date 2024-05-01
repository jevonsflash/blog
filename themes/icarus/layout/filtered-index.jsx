const { Component, Fragment } = require('inferno');
const Paginator = require('hexo-component-inferno/lib/view/misc/paginator');
const Article = require('./common/article');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __, url_for } = helper;
        const orderBy =
        (config.category_generator ? config.category_generator.order_by : null) || '-date';
  
        function getClass(el) {
            let className = 'level-item button';
            if (page.type) {
                if (el == page.type) {
                    className += ' is-primary';
                }
            }
            else {
                if (el == 'all') {
                    className += ' is-primary';
                }
            }
            return className
        }

        return <Fragment>
           <div class="card">
                <div class="card-content level">
                    <div class="level-left">
                        <p>文章类型</p>
                    </div>
                    <div class="level-right is-mobile is-multiline">
                        <a class={getClass('all')} href='/'>全部</a>
                        <a class={getClass('original')} href='/original/'>原创</a>
                        <a class={getClass('repost')} href='/repost/'>转载</a>
                    </div>
                </div>
            </div>
            {page.type === 'repost' ?
                page.posts.filter((c) => c.categories.some(obj => obj.name === '转载')).sort(orderBy).map(post => <Article config={config} page={post} helper={helper} index={true} />)
                : page.posts.filter((c) => !c.categories.some(obj => obj.name === '转载')).sort(orderBy).map(post => <Article config={config} page={post} helper={helper} index={true} />)}
            {page.total > 1 ? <Paginator
                current={page.current}
                total={page.total}
                baseUrl={page.base}
                path={config.pagination_dir}
                urlFor={url_for}
                prevTitle={__('common.prev')}
                nextTitle={__('common.next')} /> : null}
        </Fragment>;
    }
};
