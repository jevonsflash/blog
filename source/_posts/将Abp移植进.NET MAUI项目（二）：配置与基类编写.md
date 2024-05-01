---
thumbnail: images/ced3f0d676a447679ebe50cb07bbb914.png
title: 将Abp移植进.NET MAUI项目（二）：配置与基类编写
excerpt: >-
  因为我们要做一个数据持久化型的小应用，所以在完成Abp功能的集成后，我们需要做数据库相关的配置工作配置数据库在MauiBoilerplate.Core项目中，添加两个实体类：我们简单的写一个歌曲（song）的实体类其中包含了歌曲标题（MusicTitle），艺术家（Artist），专辑（Album），时长（Duration）以及发售日期（ReleaseDate）   
  public class Song : FullAuditedEntity<long>    {  .
tags:
  - Xamarin
  - [.NET]
  - MAUI
  - Abp
categories:
  - [.NET]
  - [.NET MAUI]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-05-25 18:44:00/将Abp移植进.NET MAUI项目（二）：配置与基类编写.html'
abbrlink: a3b1360d
date: 2022-05-25 18:44:00
cover:
description:
---
<span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span><p><span id="cke_bm_732S"> 因为我们要做一个数据持久化型的小应用，所以在完成Abp功能的集成后，我们需要做数据库相关的配置工作</span></p><h2>配置数据库</h2><p>在MauiBoilerplate.Core项目中，添加两个实体类：</p><p>我们简单的写一个歌曲（song）的实体类</p><p>其中包含了歌曲标题（MusicTitle），艺术家（Artist），专辑（Album），时长（Duration）以及发售日期（ReleaseDate）</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20Song%20%3A%20FullAuditedEntity%3Clong%3E%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%5BKey%2C%20DatabaseGenerated(DatabaseGeneratedOption.Identity)%5D%5Cn%20%20%20%20%20%20%20%20public%20override%20long%20Id%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20string%20MusicTitle%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20string%20Artist%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20string%20Album%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20TimeSpan%20Duration%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20DateTime%20ReleaseDate%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">Song : <span class="hljs-title">FullAuditedEntity&lt;<span class="hljs-title">long&gt;
    {
        [<span class="hljs-meta">Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        <span class="hljs-keyword">public <span class="hljs-keyword">override <span class="hljs-built_in">long Id { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public <span class="hljs-built_in">string MusicTitle { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public <span class="hljs-built_in">string Artist { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public <span class="hljs-built_in">string Album { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public TimeSpan Duration { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public DateTime ReleaseDate { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>在MauiBoilerplate.EntityFrameworkCore项目中：将这个类添加至MauiBoilerplateDbContext中</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20class%20MauiBoilerplateDbContext%20%3A%20AbpDbContext%5Cn%7B%5Cn%20%20%20%20%20%2F%2FAdd%20DbSet%20properties%20for%20your%20entities...%5Cn%20%20%20%20%20public%20DbSet%3CSong%3E%20Song%20%7B%20get%3B%20set%3B%20%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">MauiBoilerplateDbContext : <span class="hljs-title">AbpDbContext
{
     <span class="hljs-comment">//Add DbSet properties for your entities...
     <span class="hljs-keyword">public DbSet&lt;Song&gt; Song { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
}</span></span></span></span></span></span></span></span></code></pre>
</div><p> 新建WithDbContextHelper.cs</p><p>创建一个静态类WithDbContext，利用Abp的工作单元模式对dbcontext执行操作</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20WithDbContextHelper%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20static%20void%20WithDbContext%3CTDbContext%3E(IIocResolver%20iocResolver%2C%20Action%3CTDbContext%3E%20contextAction)%5Cn%20%20%20%20where%20TDbContext%20%3A%20DbContext%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20using%20(var%20uowManager%20%3D%20iocResolver.ResolveAsDisposable%3CIUnitOfWorkManager%3E())%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20using%20(var%20uow%20%3D%20uowManager.Object.Begin(TransactionScopeOption.Suppress))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20context%20%3D%20uowManager.Object.Current.GetDbContext%3CTDbContext%3E()%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20contextAction(context)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20uow.Complete()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">WithDbContextHelper
    {
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">void <span class="hljs-title">WithDbContext&lt;<span class="hljs-title">TDbContext&gt;(<span class="hljs-params">IIocResolver iocResolver, Action&lt;TDbContext&gt; contextAction)
    <span class="hljs-keyword">where TDbContext : DbContext
        {
            <span class="hljs-keyword">using (<span class="hljs-keyword">var uowManager = iocResolver.ResolveAsDisposable&lt;IUnitOfWorkManager&gt;())
            {
                <span class="hljs-keyword">using (<span class="hljs-keyword">var uow = uowManager.Object.Begin(TransactionScopeOption.Suppress))
                {
                    <span class="hljs-keyword">var context = uowManager.Object.Current.GetDbContext&lt;TDbContext&gt;();

                    contextAction(context);

                    uow.Complete();
                }
            }
        }

    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>[可选]种子数据相关类编写</p><p>编写种子数据帮助类SeedHelper.cs，与数据库初始化类InitialDbBuilder，这里将在程序启动时向数据库插入一些种子数据</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20static%20class%20SeedHelper%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20static%20void%20SeedHostDb(IIocResolver%20iocResolver)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20Helper.WithDbContextHelper.WithDbContext%3CMauiBoilerplateDbContext%3E(iocResolver%2C%20SeedHostDb)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20static%20void%20SeedHostDb(MauiBoilerplateDbContext%20context)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20context.SuppressAutoSetTenantId%20%3D%20true%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Host%20seed%5Cn%20%20%20%20%20%20%20%20%20%20%20%20new%20InitialDbBuilder(context).Create()%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">class <span class="hljs-title">SeedHelper
    {
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">void <span class="hljs-title">SeedHostDb(<span class="hljs-params">IIocResolver iocResolver)
        {
            Helper.WithDbContextHelper.WithDbContext&lt;MauiBoilerplateDbContext&gt;(iocResolver, SeedHostDb);
        }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">void <span class="hljs-title">SeedHostDb(<span class="hljs-params">MauiBoilerplateDbContext context)
        {
            context.SuppressAutoSetTenantId = <span class="hljs-literal">true;

            <span class="hljs-comment">// Host seed
            <span class="hljs-keyword">new InitialDbBuilder(context).Create();
        }

    }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p> </p><p>编写MauiBoilerplateEntityFrameworkCoreModule.cs</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%5BDependsOn(%5Cn%20%20%20%20%20%20%20%20typeof(MauiBoilerplateCoreModule)%2C%20%5Cn%20%20%20%20%20%20%20%20typeof(AbpEntityFrameworkCoreModule))%5D%5Cn%20%20%20%20public%20class%20MauiBoilerplateEntityFrameworkCoreModule%20%3A%20AbpModule%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20bool%20SkipDbContextRegistration%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20bool%20SkipDbSeed%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20override%20void%20PreInitialize()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(!SkipDbContextRegistration)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Configuration.Modules.AbpEfCore().AddDbContext%3CMauiBoilerplateDbContext%3E(options%20%3D%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(options.ExistingConnection%20!%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20DbContextOptionsConfigurer.Configure(options.DbContextOptions%2C%20options.ExistingConnection)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20else%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20DbContextOptionsConfigurer.Configure(options.DbContextOptions%2C%20options.ConnectionString)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20public%20override%20void%20Initialize()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20IocManager.RegisterAssemblyByConvention(typeof(MauiBoilerplateEntityFrameworkCoreModule).GetAssembly())%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20override%20void%20PostInitialize()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20Helper.WithDbContextHelper.WithDbContext%3CMauiBoilerplateDbContext%3E(IocManager%2C%20RunMigrate)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(!SkipDbSeed)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20SeedHelper.SeedHostDb(IocManager)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20static%20void%20RunMigrate(MauiBoilerplateDbContext%20dbContext)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20dbContext.Database.Migrate()%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    [<span class="hljs-meta">DependsOn(
        typeof(MauiBoilerplateCoreModule), 
        typeof(AbpEntityFrameworkCoreModule))]
    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">MauiBoilerplateEntityFrameworkCoreModule : <span class="hljs-title">AbpModule
    {
        <span class="hljs-keyword">public <span class="hljs-built_in">bool SkipDbContextRegistration { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public <span class="hljs-built_in">bool SkipDbSeed { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">override <span class="hljs-keyword">void <span class="hljs-title">PreInitialize()
        {
            <span class="hljs-keyword">if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext&lt;MauiBoilerplateDbContext&gt;(options =&gt;
                {
                    <span class="hljs-keyword">if (options.ExistingConnection != <span class="hljs-literal">null)
                    {
                        DbContextOptionsConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    <span class="hljs-keyword">else
                    {
                        DbContextOptionsConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }
        }
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">override <span class="hljs-keyword">void <span class="hljs-title">Initialize()
        {
 
            IocManager.RegisterAssemblyByConvention(<span class="hljs-keyword">typeof(MauiBoilerplateEntityFrameworkCoreModule).GetAssembly());
            
        }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">override <span class="hljs-keyword">void <span class="hljs-title">PostInitialize()
        {
            Helper.WithDbContextHelper.WithDbContext&lt;MauiBoilerplateDbContext&gt;(IocManager, RunMigrate);
            <span class="hljs-keyword">if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb(IocManager);
            }
        }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">void <span class="hljs-title">RunMigrate(<span class="hljs-params">MauiBoilerplateDbContext dbContext)
        {
            dbContext.Database.Migrate();
        }


    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>将MauiBoilerplate.EntityFrameworkCore设置为启动项目，选择框架为.net6.0</p><p>打开程序包管理器控制台，选择默认项目MauiBoilerplate.EntityFrameworkCore</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164951256-1628775970.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F7bbc8ebd1a78459baaada2fd72db3c6c.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22709%22%2C%22height%22%3A%22178%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="178" src="644861-20231022164951256-1628775970.png" width="709"/></span></p><p> 运行Add-Migration命令，将生成迁移脚本</p><p>运行MauiBoilerplate.EntityFrameworkCore，将生成mato.db等三个文件，</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164951183-113622743.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fe33fa96919fe4c4c8f0106a8834e173c.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22186%22%2C%22height%22%3A%2261%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="61" src="644861-20231022164951183-113622743.png" width="186"/></span></p><h2>编写基类（可选）</h2><p>我们在使用相关的父类时，某某ContentPage，或者某某UserControl时，需要像使用AbpServiceBase一样使用一些常用的功能，比如字符串的本地化，配置，AutoMapper对象等，就像AbpServiceBase的注释里描述的那样：</p><blockquote>
<p>    /// &lt;summary&gt;<br/>
    /// This class can be used as a base class for services.<br/>
    /// It has some useful objects property-injected and has some basic methods<br/>
    /// most of services may need to.<br/>
    /// &lt;/summary&gt;</p>
</blockquote><p>此时，需要编写一个基类（奈何.net本身没有Mixin模式，C#语言也不支持多继承），这些基类仅是注入了一些常用的Manager，方便代码编写者使用，因此基类的创建不是必须的。</p><p>比如可以增加一个ContentPageBase类作为ContentPage实例控件的基类</p><p>新建ContentPageBase.cs文件，创建类ContentPageBase继承于ContentPage</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20ContentPageBase%20%3A%20ContentPage%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20IObjectMapper%20ObjectMapper%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Reference%20to%20the%20setting%20manager.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20public%20ISettingManager%20SettingManager%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Reference%20to%20the%20localization%20manager.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20public%20ILocalizationManager%20LocalizationManager%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Gets%2Fsets%20name%20of%20the%20localization%20source%20that%20is%20used%20in%20this%20application%20service.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20It%20must%20be%20set%20in%20order%20to%20use%20%3Csee%20cref%3D%5C%22L(string)%5C%22%2F%3E%20and%20%3Csee%20cref%3D%5C%22L(string%2CCultureInfo)%5C%22%2F%3E%20methods.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20protected%20string%20LocalizationSourceName%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Gets%20localization%20source.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20It's%20valid%20if%20%3Csee%20cref%3D%5C%22LocalizationSourceName%5C%22%2F%3E%20is%20set.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20protected%20ILocalizationSource%20LocalizationSource%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20get%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(LocalizationSourceName%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20AbpException(%5C%22Must%20set%20LocalizationSourceName%20before%2C%20in%20order%20to%20get%20LocalizationSource%5C%22)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(_localizationSource%20%3D%3D%20null%20%7C%7C%20_localizationSource.Name%20!%3D%20LocalizationSourceName)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20_localizationSource%20%3D%20LocalizationManager.GetSource(LocalizationSourceName)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20_localizationSource%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20private%20ILocalizationSource%20_localizationSource%3B%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Constructor.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20protected%20ContentPageBase()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20LocalizationSourceName%20%3D%20MauiBoilerplateConsts.LocalizationSourceName%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20ObjectMapper%20%3D%20NullObjectMapper.Instance%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20LocalizationManager%20%3D%20NullLocalizationManager.Instance%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Gets%20localized%20string%20for%20given%20key%20name%20and%20current%20language.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22name%5C%22%3EKey%20name%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Creturns%3ELocalized%20string%3C%2Freturns%3E%5Cn%20%20%20%20%20%20%20%20protected%20virtual%20string%20L(string%20name)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20LocalizationSource.GetString(name)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Gets%20localized%20string%20for%20given%20key%20name%20and%20current%20language%20with%20formatting%20strings.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22name%5C%22%3EKey%20name%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22args%5C%22%3EFormat%20arguments%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Creturns%3ELocalized%20string%3C%2Freturns%3E%5Cn%20%20%20%20%20%20%20%20protected%20virtual%20string%20L(string%20name%2C%20params%20object%5B%5D%20args)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20LocalizationSource.GetString(name%2C%20args)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Gets%20localized%20string%20for%20given%20key%20name%20and%20specified%20culture%20information.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22name%5C%22%3EKey%20name%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22culture%5C%22%3Eculture%20information%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Creturns%3ELocalized%20string%3C%2Freturns%3E%5Cn%20%20%20%20%20%20%20%20protected%20virtual%20string%20L(string%20name%2C%20CultureInfo%20culture)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20LocalizationSource.GetString(name%2C%20culture)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Csummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20Gets%20localized%20string%20for%20given%20key%20name%20and%20current%20language%20with%20formatting%20strings.%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3C%2Fsummary%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22name%5C%22%3EKey%20name%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22culture%5C%22%3Eculture%20information%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Cparam%20name%3D%5C%22args%5C%22%3EFormat%20arguments%3C%2Fparam%3E%5Cn%20%20%20%20%20%20%20%20%2F%2F%2F%20%3Creturns%3ELocalized%20string%3C%2Freturns%3E%5Cn%20%20%20%20%20%20%20%20protected%20virtual%20string%20L(string%20name%2C%20CultureInfo%20culture%2C%20params%20object%5B%5D%20args)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20LocalizationSource.GetString(name%2C%20culture%2C%20args)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">ContentPageBase : <span class="hljs-title">ContentPage
    {
        <span class="hljs-keyword">public IObjectMapper ObjectMapper { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }


        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Reference to the setting manager.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-keyword">public ISettingManager SettingManager { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }


        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Reference to the localization manager.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-keyword">public ILocalizationManager LocalizationManager { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Gets/sets name of the localization source that is used in this application service.
        <span class="hljs-comment"><span class="hljs-doctag">/// It must be set in order to use <span class="hljs-doctag">&lt;see cref="L(string)"/&gt; and <span class="hljs-doctag">&lt;see cref="L(string,CultureInfo)"/&gt; methods.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-keyword">protected <span class="hljs-built_in">string LocalizationSourceName { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Gets localization source.
        <span class="hljs-comment"><span class="hljs-doctag">/// It's valid if <span class="hljs-doctag">&lt;see cref="LocalizationSourceName"/&gt; is set.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-keyword">protected ILocalizationSource LocalizationSource
        {
            <span class="hljs-keyword">get
            {
                <span class="hljs-keyword">if (LocalizationSourceName == <span class="hljs-literal">null)
                {
                    <span class="hljs-keyword">throw <span class="hljs-keyword">new AbpException(<span class="hljs-string">"Must set LocalizationSourceName before, in order to get LocalizationSource");
                }

                <span class="hljs-keyword">if (_localizationSource == <span class="hljs-literal">null || _localizationSource.Name != LocalizationSourceName)
                {
                    _localizationSource = LocalizationManager.GetSource(LocalizationSourceName);
                }

                <span class="hljs-keyword">return _localizationSource;
            }
        }
        <span class="hljs-keyword">private ILocalizationSource _localizationSource;


        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Constructor.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-title">ContentPageBase()
        {
            LocalizationSourceName = MauiBoilerplateConsts.LocalizationSourceName;
            ObjectMapper = NullObjectMapper.Instance;
            LocalizationManager = NullLocalizationManager.Instance;
        }

        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Gets localized string for given key name and current language.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="name"&gt;Key name<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;returns&gt;Localized string<span class="hljs-doctag">&lt;/returns&gt;
        <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">virtual <span class="hljs-built_in">string <span class="hljs-title">L(<span class="hljs-params"><span class="hljs-built_in">string name)
        {
            <span class="hljs-keyword">return LocalizationSource.GetString(name);
        }

        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Gets localized string for given key name and current language with formatting strings.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="name"&gt;Key name<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="args"&gt;Format arguments<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;returns&gt;Localized string<span class="hljs-doctag">&lt;/returns&gt;
        <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">virtual <span class="hljs-built_in">string <span class="hljs-title">L(<span class="hljs-params"><span class="hljs-built_in">string name, <span class="hljs-keyword">params <span class="hljs-built_in">object[] args)
        {
            <span class="hljs-keyword">return LocalizationSource.GetString(name, args);
        }

        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Gets localized string for given key name and specified culture information.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="name"&gt;Key name<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="culture"&gt;culture information<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;returns&gt;Localized string<span class="hljs-doctag">&lt;/returns&gt;
        <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">virtual <span class="hljs-built_in">string <span class="hljs-title">L(<span class="hljs-params"><span class="hljs-built_in">string name, CultureInfo culture)
        {
            <span class="hljs-keyword">return LocalizationSource.GetString(name, culture);
        }

        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// Gets localized string for given key name and current language with formatting strings.
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;/summary&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="name"&gt;Key name<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="culture"&gt;culture information<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;param name="args"&gt;Format arguments<span class="hljs-doctag">&lt;/param&gt;
        <span class="hljs-comment"><span class="hljs-doctag">/// <span class="hljs-doctag">&lt;returns&gt;Localized string<span class="hljs-doctag">&lt;/returns&gt;
        <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">virtual <span class="hljs-built_in">string <span class="hljs-title">L(<span class="hljs-params"><span class="hljs-built_in">string name, CultureInfo culture, <span class="hljs-keyword">params <span class="hljs-built_in">object[] args)
        {
            <span class="hljs-keyword">return LocalizationSource.GetString(name, culture, args);
        }
    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>同理，若我们使用了其他控件类时，可以增加一个Base类作为实例控件的基类的</p><p>比如Popup控件，就编写一个PopupBase基类。</p><p>在这里我们编写了两个基类</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164951287-1812037174.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F5a12e69e206340899c8acc806d41a73b.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22334%22%2C%22height%22%3A%2260%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="60" src="644861-20231022164951287-1812037174.png" width="334"/></span></p><h2> 本地化配置</h2><p>新建一个TranslateExtension.cs作为Xaml标签的本地化处理类</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%5BContentProperty(%5C%22Text%5C%22)%5D%5Cn%20%20%20%20public%20class%20TranslateExtension%20%3A%20DomainService%2C%20IMarkupExtension%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20TranslateExtension()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20LocalizationSourceName%20%3D%20MauiBoilerplateConsts.LocalizationSourceName%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20Text%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20object%20ProvideValue(IServiceProvider%20serviceProvider)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(Text%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20%5C%22%5C%22%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20translation%20%3D%20L(Text)%3B%20%20%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20translation%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%5Cn%5Cn%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    [<span class="hljs-meta">ContentProperty(<span class="hljs-string">"Text")]
    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">TranslateExtension : <span class="hljs-title">DomainService, <span class="hljs-title">IMarkupExtension
    {
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">TranslateExtension()
        {
            LocalizationSourceName = MauiBoilerplateConsts.LocalizationSourceName;

        }
        <span class="hljs-keyword">public <span class="hljs-built_in">string Text { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-built_in">object <span class="hljs-title">ProvideValue(<span class="hljs-params">IServiceProvider serviceProvider)
        {
            <span class="hljs-keyword">if (Text == <span class="hljs-literal">null)
                <span class="hljs-keyword">return <span class="hljs-string">"";
            <span class="hljs-keyword">var translation = L(Text);          
            <span class="hljs-keyword">return translation;
        }



    }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>在MauiBoilerplateLocalization.cs配置好SourceFiles </p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20static%20void%20Configure(ILocalizationConfiguration%20localizationConfiguration)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20localizationConfiguration.Sources.Add(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20new%20DictionaryBasedLocalizationSource(MauiBoilerplateConsts.LocalizationSourceName%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20new%20XmlEmbeddedFileLocalizationDictionaryProvider(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20typeof(LocalizationConfigurer).GetAssembly()%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5C%22MauiBoilerplate.Core.Localization.SourceFiles%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">void <span class="hljs-title">Configure(<span class="hljs-params">ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                <span class="hljs-keyword">new DictionaryBasedLocalizationSource(MauiBoilerplateConsts.LocalizationSourceName,
                    <span class="hljs-keyword">new XmlEmbeddedFileLocalizationDictionaryProvider(
                        <span class="hljs-keyword">typeof(LocalizationConfigurer).GetAssembly(),
                        <span class="hljs-string">"MauiBoilerplate.Core.Localization.SourceFiles"
                    )
                )
            );
        }</span></span></span></span></span></span></span></span></span></span></code></pre>
</div><h2>编写ViewModelBase</h2><p>为实现Mvvm设计模式，页面需要绑定一个继承于ViewModelBase的类型</p><p>在ViewModelBase中，需要实现INotifyPropertyChanged以处理绑定成员变化时候的通知消息；</p><p>ViewModelBase集成于AbpServiceBase以方便ViewModel代码编写者使用常用的功能，比如字符串的本地化，配置，AutoMapper对象等。</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20abstract%20class%20ViewModelBase%20%3A%20AbpServiceBase%2C%20ISingletonDependency%2C%20INotifyPropertyChanged%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20ViewModelBase()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20LocalizationSourceName%20%3D%20MauiBoilerplateConsts.LocalizationSourceName%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20event%20PropertyChangedEventHandler%20PropertyChanged%3B%5Cn%5Cn%20%20%20%20%20%20%20%20protected%20PropertyChangedEventHandler%20PropertyChangedHandler%20%7B%20get%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20void%20VerifyPropertyName(string%20propertyName)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20Type%20type%20%3D%20GetType()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(!string.IsNullOrEmpty(propertyName)%20%26%26%20type.GetTypeInfo().GetDeclaredProperty(propertyName)%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20ArgumentException(%5C%22%E6%89%BE%E4%B8%8D%E5%88%B0%E5%B1%9E%E6%80%A7%5C%22%2C%20propertyName)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20virtual%20void%20RaisePropertyChanged(%5BCallerMemberName%5D%20string%20propertyName%20%3D%20null)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20PropertyChangedEventHandler%20propertyChanged%20%3D%20PropertyChanged%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(propertyChanged%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20propertyChanged(this%2C%20new%20PropertyChangedEventArgs(propertyName))%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20virtual%20void%20RaisePropertyChanged%3CT%3E(Expression%3CFunc%3CT%3E%3E%20propertyExpression)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(PropertyChanged%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20string%20propertyName%20%3D%20GetPropertyName(propertyExpression)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(string.IsNullOrEmpty(propertyName))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20RaisePropertyChanged(propertyName)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20protected%20static%20string%20GetPropertyName%3CT%3E(Expression%3CFunc%3CT%3E%3E%20propertyExpression)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(propertyExpression%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20ArgumentNullException(nameof(propertyExpression))%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20MemberExpression%20body%20%3D%20propertyExpression.Body%20as%20MemberExpression%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(body%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20ArgumentException(%5C%22%E5%8F%82%E6%95%B0%E4%B8%8D%E5%90%88%E6%B3%95%5C%22%2C%20nameof(propertyExpression))%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20PropertyInfo%20member%20%3D%20body.Member%20as%20PropertyInfo%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(member%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20ArgumentException(%5C%22%E6%89%BE%E4%B8%8D%E5%88%B0%E5%B1%9E%E6%80%A7%5C%22%2C%20nameof(propertyExpression))%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20member.Name%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">abstract <span class="hljs-keyword">class <span class="hljs-title">ViewModelBase : <span class="hljs-title">AbpServiceBase, <span class="hljs-title">ISingletonDependency, <span class="hljs-title">INotifyPropertyChanged
    {
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">ViewModelBase()
        {
            LocalizationSourceName = MauiBoilerplateConsts.LocalizationSourceName;
        }

        <span class="hljs-keyword">public <span class="hljs-keyword">event PropertyChangedEventHandler PropertyChanged;

        <span class="hljs-keyword">protected PropertyChangedEventHandler PropertyChangedHandler { <span class="hljs-keyword">get; }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">void <span class="hljs-title">VerifyPropertyName(<span class="hljs-params"><span class="hljs-built_in">string propertyName)
        {
            Type type = GetType();
            <span class="hljs-keyword">if (!<span class="hljs-built_in">string.IsNullOrEmpty(propertyName) &amp;&amp; type.GetTypeInfo().GetDeclaredProperty(propertyName) == <span class="hljs-literal">null)
                <span class="hljs-keyword">throw <span class="hljs-keyword">new ArgumentException(<span class="hljs-string">"找不到属性", propertyName);
        }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">void <span class="hljs-title">RaisePropertyChanged(<span class="hljs-params">[CallerMemberName] <span class="hljs-built_in">string propertyName = <span class="hljs-literal">null)
        {
            PropertyChangedEventHandler propertyChanged = PropertyChanged;
            <span class="hljs-keyword">if (propertyChanged == <span class="hljs-literal">null)
                <span class="hljs-keyword">return;
            propertyChanged(<span class="hljs-keyword">this, <span class="hljs-keyword">new PropertyChangedEventArgs(propertyName));
        }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">void <span class="hljs-title">RaisePropertyChanged&lt;<span class="hljs-title">T&gt;(<span class="hljs-params">Expression&lt;Func&lt;T&gt;&gt; propertyExpression)
        {
            <span class="hljs-keyword">if (PropertyChanged == <span class="hljs-literal">null)
                <span class="hljs-keyword">return;
            <span class="hljs-built_in">string propertyName = GetPropertyName(propertyExpression);
            <span class="hljs-keyword">if (<span class="hljs-built_in">string.IsNullOrEmpty(propertyName))
                <span class="hljs-keyword">return;
            RaisePropertyChanged(propertyName);
        }

        <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">static <span class="hljs-built_in">string <span class="hljs-title">GetPropertyName&lt;<span class="hljs-title">T&gt;(<span class="hljs-params">Expression&lt;Func&lt;T&gt;&gt; propertyExpression)
        {
            <span class="hljs-keyword">if (propertyExpression == <span class="hljs-literal">null)
                <span class="hljs-keyword">throw <span class="hljs-keyword">new ArgumentNullException(<span class="hljs-keyword">nameof(propertyExpression));
            MemberExpression body = propertyExpression.Body <span class="hljs-keyword">as MemberExpression;
            <span class="hljs-keyword">if (body == <span class="hljs-literal">null)
                <span class="hljs-keyword">throw <span class="hljs-keyword">new ArgumentException(<span class="hljs-string">"参数不合法", <span class="hljs-keyword">nameof(propertyExpression));
            PropertyInfo member = body.Member <span class="hljs-keyword">as PropertyInfo;
            <span class="hljs-keyword">if (member == <span class="hljs-literal">null)
                <span class="hljs-keyword">throw <span class="hljs-keyword">new ArgumentException(<span class="hljs-string">"找不到属性", <span class="hljs-keyword">nameof(propertyExpression));
            <span class="hljs-keyword">return member.Name;
        }

    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>至此，我们完成了数据库的配置，内容页基类与 ViewModel基类的编写，接下来可以制作我们的页面了。请看下一章<a href="https://www.cnblogs.com/jevonsflash/p/16310399.html">将Abp移植进.NET MAUI项目（三）：构建UI层 - 林晓lx - 博客园 (cnblogs.com)</a></p><h2> 项目地址</h2><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/jevonsflash/maui-abp-sample" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fjevonsflash%2Fmaui-abp-sample%22%2C%22text%22%3A%22jevonsflash%2Fmaui-abp-sample%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22C12dbO-1653475381458%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="jevonsflash/maui-abp-sample (github.com)" data-widget="csdnlink" href="https://github.com/jevonsflash/maui-abp-sample" title="jevonsflash/maui-abp-sample (github.com)">jevonsflash/maui-abp-sample (github.com)</a></span></p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span>