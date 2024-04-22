const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Footer extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            siteYear,
            author,
            links,
            showVisitorCounter,
            url_for
        } = this.props;

        return <footer class="footer">
            <div class="container">
                <div class="level">
                    <div class="level-start">
                        <a class="footer-logo is-block mb-2" href={siteUrl}>
                            {logo && logo.text ? logo.text : <img src={logoUrl} alt={siteTitle} height="28" />}
                        </a>
                        <p class="size-small">
                            <span dangerouslySetInnerHTML={{ __html: `&copy; ${siteYear} ${author || siteTitle}` }}></span>
                            <br />

                            <script type="text/javascript" src={url_for('/js/statistics.js')}></script>
                            <span>站长统计：</span>
                            <br />
                            <span id="statistic-times">网站运行时间统计加载中...</span>
                            <br />
                            {showVisitorCounter ?
                                <div class="size-small">
                                    <span id="busuanzi_container_site_uv">
                                        独立访客数(UV): <span id="busuanzi_value_site_uv">99+</span>
                                    </span>
                                    <br />
                                    页面浏览量(PV): <span id="busuanzi_value_site_pv">99+</span>

                                </div> : null}
                            <br />

                            <span> Powered by <a href="https://hexo.io/" target="_blank">Hexo</a> & <a
                                href="https://github.com/ppoffice/hexo-theme-icarus" target="_blank">Icarus</a></span>
                            <br />
                        </p>
                    </div>
                    <div class="level-end">
                        {Object.keys(links).length ? <div class="field has-addons">
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <p class="control">
                                    <a class={`button is-transparent ${link.icon ? 'is-large' : ''}`} target="_blank" rel="noopener" title={name} href={link.url}>
                                        {link.icon ? <i class={link.icon}></i> : name}
                                    </a>
                                </p>;
                            })}
                        </div> : null}
                    </div>
                </div>
            </div>
        </footer>;
    }
}

module.exports = cacheComponent(Footer, 'common.footer', props => {
    const { config, helper } = props;
    const { url_for, _p, date } = helper;
    const { logo, title, author, footer, plugins } = config;

    const links = {};
    if (footer && footer.links) {
        Object.keys(footer.links).forEach(name => {
            const link = footer.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        url_for: url_for,
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        siteYear: date(new Date(), 'YYYY'),
        author,
        links,
        showVisitorCounter: plugins && plugins.busuanzi === true,
        visitorCounterTitle: _p('plugin.visitor', '<span id="busuanzi_value_site_uv">0</span>')
    };
});
