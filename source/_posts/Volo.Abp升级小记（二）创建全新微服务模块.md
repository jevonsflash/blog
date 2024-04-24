---
thumbnail:
cover:
title: 'Volo.Abp升级小记（二）创建全新微服务模块'
excerpt:
description:
date: 2023-06-09 14:45:00
tags:
  - .net
  - asp.net core
  - 微服务
  - Abp

categories:
  - .NET
  - 架构
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-06-09 14:45:00/Volo.Abp升级小记（二）创建全新微服务模块.html
---
<!-- toc -->
假设有一个按照[官方sample](https://docs.abp.io/zh-Hans/abp/latest/Samples/Microservice-Demo)搭建的微服务项目，并安装好了abp-cli。
需要创建一个名为GDMK.CAH.Common的模块，并在模块中创建标签管理功能

因为大部分的代码是自动生成的，此示例仅描述需要手动更改的内容。我们以创建一个全新的最小化的微服务模块为例，需要做以下几步：
# 创建模块

用abp-cli创建一个新的模块
在项目根目录下执行以下命令：

```
abp new GDMK.CAH.Common --template module --no-ui --ui='none' -d='ef' --output-folder .\modules\GDMK.CAH.Common --local-framework-ref --abp-path ..\..\..\..\abp\
```
--template module: 模块/服务模板
--no-ui: 不创建前端项目
-d: 指定数据库提供程序为ef.
--output-folder: 指定输出目录
--local-framework-ref: 使用本地abp框架

你可以自由设定模板选项，详情请参考[abp-cli文档](https://docs.abp.io/zh-Hans/abp/latest/CLI)


我们只需要保留应用层，领域层，数据库，Api访问层以及各抽象层。将这些项目放在模块目录下，即当前位置（.\modules\GDMK.CAH.Common）

Common.Host项目作为微服务单独放置在服务目录中（一般为microservices）

看起来模块的目录结构如下

![在这里插入图片描述](644861-20230609144349228-2016306914.png)


## 领域层

领域层中我们创建一个Tag实体、领域层服务和模型

Tag实体
```
public class Tag : AuditedEntity<long>, IMultiTenant
{
    ...
}

```

Tag领域层服务
```
public class TagManager<T> : DomainService
{
    ...
}
```
页面结构看起来像这样


![在这里插入图片描述](644861-20230609144349116-813440267.png)


## 应用层


在应用层抽象层中创建ITagAppService接口，以及各Dto类。

ITagAppService接口继承ICurdAppService，实现标签管理的增删改查功能
```
public interface ITagAppService : ICurdAppService<TagDto, TagDto, long, GetAllTagInput, GetAllTagInput, CreateTagInput, CreateTagInput>, IApplicationService
{
    ...
}
```
页面结构看起来像这样


![在这里插入图片描述](644861-20230609144349047-634760510.png)



应用层中创建标签管理的应用层服务TagAppService

TagAppService继承CurdAppServiceBase，实现ITagAppService接口

```
public class TagAppService : CurdAppServiceBase<Tag, TagDto, TagDto, long, GetAllTagInput, GetAllTagInput, CreateTagInput, CreateTagInput>, ITagAppService
{
    ...
}
```

![在这里插入图片描述](644861-20230609144349053-1726675431.png)


配置AutoMapper

在CommonApplicationAutoMapperProfile中添加Tag的映射配置

```
public class CommonApplicationAutoMapperProfile : Profile
{
    public CommonApplicationAutoMapperProfile()
    {
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
        CreateMap<Tag.Tag, TagDto>();

        CreateMap<TagDto, Tag.Tag>().Ignore(c => c.TenantId);
        CreateMap<CreateTagInput, Tag.Tag>().IgnoreAuditedObjectProperties()
                .Ignore(c => c.TenantId);

    }
}
```

## 数据库和仓储

在CommonDbContext中添加Tag的DbSet

```
public class CommonDbContext : AbpDbContext<CommonDbContext>, ICommonDbContext
{
    /* Add DbSet for each Aggregate Root here. Example:
     * public DbSet<Question> Questions { get; set; }
     */
    public DbSet<Tag.Tag> Tag { get; set; }

    ...
}
```

在CommonDbContextModelCreatingExtensions中添加对Tag实体的配置

ConfigureByConvention会根据DataAnnotationAttributes为实体配置一些默认的属性，如Id为主键，Name为索引等，详情请参考[Abp文档](https://docs.abp.io/zh-Hans/abp/latest/Domain-Entities#configure-by-convention)和[EF文档](https://docs.microsoft.com/zh-cn/ef/core/modeling/entity-properties)

```
public static class CommonDbContextModelCreatingExtensions
{
    public static void ConfigureCommon(
        this ModelBuilder builder)
    {
        Check.NotNull(builder, nameof(builder));

        builder.Entity<Tag.Tag>(b =>
        {
            b.ToTable(CommonDbProperties.DbTablePrefix + nameof(Tag.Tag), CommonDbProperties.DbSchema);

            b.ConfigureByConvention();

        });

        ...
    }
}

```

在CommonEntityFrameworkCoreModule的ConfigureServices方法中，为Tag添加默认仓储

```
public class CommonEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddAbpDbContext<CommonDbContext>(options =>
        {
            /* Add custom repositories here. Example:
             * options.AddRepository<Question, EfCoreQuestionRepository>();
             */
            options.AddDefaultRepositories(includeAllEntities: true);

        });


    }
}

```

## 控制器

添加控制器，配置路由


![在这里插入图片描述](644861-20230609144349094-2046984208.png)


```
[Area(CommonRemoteServiceConsts.ModuleName)]
[RemoteService(Name = CommonRemoteServiceConsts.RemoteServiceName)]
[Route("api/Common/tag")]
public class TagController : CommonController<ITagAppService, TagDto, TagDto, long, GetAllTagInput, GetAllTagInput, CreateTagInput, CreateTagInput>, ITagAppService
{
    private readonly ITagAppService _tagAppService;

    public TagController(ITagAppService tagAppService) : base(tagAppService)
    {
        _tagAppService = tagAppService;
    }


}
```

## 配置微服务

在服务目录中打开Common.Host项目，将CommonHttpApi,CommonApplication以及CommonEntityFrameworkCore模块添加到项目引用，并建立Abp模块的依赖关系

```
    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(AbpAspNetCoreMvcModule),
        typeof(AbpEntityFrameworkCoreSqlServerModule),
   
        typeof(CommonHttpApiModule),
        typeof(CommonApplicationModule),
        typeof(CommonEntityFrameworkCoreModule),
        ...
        )]
    public class CommonServiceHostModule : AbpModule

```

在launchSettings.json中指定端口号，此端口号不要跟其他服务的端口号冲突

```
"profiles": {  
    "CommonService.Host": {
      "commandName": "Project",
      "launchBrowser": true,
      "applicationUrl": "http://localhost:44363",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
    ...
  }
```


准备一些种子数据
```
public static List<Tag> tags = new List<Tag>()
{
    new Tag() { Title = "医术高明" },
    new Tag() { Title = "救死扶伤" },
    new Tag() { Title = "心地仁慈" },
    new Tag() { Title = "百治百效" },
    new Tag() { Title = "白衣天使" },
    new Tag() { Title = "手到病除" },
    new Tag() { Title = "妙手回春" },
};
```

在CommonServiceDataSeeder创建种子数据

```
public class CommonServiceDataSeeder : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<Tag.Tag, long> _tagRepository;

    public CommonServiceDataSeeder(
        IRepository<Tag.Tag, long> tagRepository)
    {
        _tagRepository = tagRepository;

    }

    [UnitOfWork]
    public virtual async Task SeedAsync(DataSeedContext context)
    {
        await _tagRepository.InsertManyAsync(StaticMember.tags);
    }

}
```

创建迁移

将Common.Host设置为启动项目，打开程序包管理器控制台选择Common.Host默认项目。
执行Add-Migration init命令和Update-Database命令

![在这里插入图片描述](644861-20230609144349092-1167960350.png)



# 测试微服务

启动Common.Host，打开浏览器，输入http://localhost:44363/swagger/index.html


![在这里插入图片描述](644861-20230609144349338-1610089110.png)



# 微服务注册


## 添加资源配置

AuthServerDataSeeder中添加identityServer4资源配置

添加Scopes
```
private async Task CreateApiScopesAsync()
{  
    ...
    await CreateApiScopeAsync("CommonService");
}
```

添加Resource

```
private async Task CreateApiResourcesAsync()
{
    ...
    await CreateApiResourceAsync("CommonService", commonApiUserClaims);
    
}
```

添加Client

```
private async Task CreateClientsAsync()
{
    ...
    await CreateClientAsync(
            "common-service-client",
            commonScopes.Union(new[] { "InternalGateway", "IdentityService" }),
            new[] { "client_credentials" },
            commonSecret
        );
}
```

## 配置网关

在内外网关的appsettings.json中添加Ocelot对微服务的路由转发

```
 {
      "DownstreamPathTemplate": "/api/common/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "localhost",
          "Port": 44363
        }
      ],
      "UpstreamPathTemplate": "/api/common/{everything}",
      "UpstreamHttpMethod": [ "Put", "Delete", "Get", "Post" ]
    }

```

网关中添加对CommonHttpApi项目的引用，并配置Abp模块依赖

```
namespace BackendAdminAppGateway.Host
{
    [DependsOn(
        ...
        typeof(CommonHttpApiModule)
    )]
    public class BackendAdminAppGatewayHostModule : AbpModule

    ...

```

选择启动项目，将Common.Host微服务设置为启动

![在这里插入图片描述](644861-20230609144349269-321387448.png)



到此完成了新模块的配置工作

# 运行项目

可以通过网关访问Tag接口了

![在这里插入图片描述](644861-20230609144349314-612816414.png)
