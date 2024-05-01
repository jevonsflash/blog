---
thumbnail: images/ec2d87487742439aa71ee9149bde6613.png
title: '[Volo.Abp升级笔记]使用旧版Api规则替换RESTful Api以兼容老程序'
excerpt: >-
  Volo.Abp 配置应用层自动生成Controller，增删查改服务（CrudAppService）将会以RESTful
  Api的方式生成对应的接口)，这与旧版本的Abp区别很大。RESTful固然好，虽然项目里新的Api会逐步使用RESTful
  Api代替旧的，但在前后端分离的项目中已经定好的接口，往往需要兼容之前的方式。
tags:
  - asp.net core
  - 微服务
  - RESTful API
categories:
  - [.NET]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-03-29 11:22:00/[Volo.Abp升级笔记]使用旧版Api规则替换RESTful Api以兼容老程序.html'
abbrlink: f1a2cf73
date: 2023-03-29 11:22:00
cover:
description:
---
<!-- toc -->
Volo.Abp 配置应用层自动生成Controller，增删查改服务（CrudAppService）将会以RESTful Api的方式生成对应的接口
([官方文档](https://docs.abp.io/zh-Hans/abp/latest/API/Auto-API-Controllers))，这与旧版本的Abp区别很大。RESTful固然好，虽然项目里新的Api会逐步使用RESTful Api代替旧的，但在前后端分离的项目中已经定好的接口，往往需要兼容之前的方式。

# 原理分析


旧版行为

应用层继承于AsyncCrudAppService的类，在Web层调用CreateControllersForAppServices后，Abp框架将以默认的规则实现Controller，具体的规则如下：

* Get: 如果方法名称以GetList,GetAll或Get开头.
* Put: 如果方法名称以Put或Update开头.
* Delete: 如果方法名称以Delete或Remove开头.
* Post: 如果方法名称以Create,Add,Insert或Post开头.
* Patch: 如果方法名称以Patch开头.
* 其他情况, Post 为 默认方式.
* 自动删除'Async'后缀. 


例子：
![在这里插入图片描述](ec2d87487742439aa71ee9149bde6613.png)



新版行为：
将会以RESTful Api的方式生成对应的接口，具体规则如下
服务方法名称|HTTP Method|Route  
---|---  |---  
GetAsync(Guid id)|	GET|	/api/app/book/{id}
GetListAsync()|	GET	|/api/app/book
CreateAsync(CreateBookDto input)|	POST	|/api/app/book
UpdateAsync(Guid id, UpdateBookDto input)	|PUT|	/api/app/book/{id}
DeleteAsync(Guid id)|	DELETE|	/api/app/book/{id}
GetEditorsAsync(Guid id)|	GET|	/api/app/book/{id}/editors
CreateEditorAsync(Guid id, BookEditorCreateDto input)|	POST|	/api/app/book/{id}/editor

例子
![在这里插入图片描述](79d6d563af1147259e3bcca43c8ecf69.png)



# 开始改造


## 更换基类型


为了兼容旧版Abp，先来还原增删查改服务（CrudAppService）的方法签名。
注意到
1. Volo.Abp 中 UpdateAsync方法签名已与旧版不同
2. 旧版中的GetAllAsync方法，被GetListAsync所取代。

新建一个CrudAppServiceBase类继承 CrudAppService。并重写UpdateAsync和GetListAsync方法。


为了还原旧版的接口，将用private new关键字覆盖掉 UpdateAsync，GetListAsync方法，并重新实现更改和查询列表的功能

```



public abstract class CrudAppServiceBase<TEntity, TGetOutputDto, TGetListOutputDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
    : CrudAppService<TEntity, TGetOutputDto, TGetListOutputDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
    where TEntity : class, IEntity<TKey>
        where TGetOutputDto : IEntityDto<TKey>
where TGetListOutputDto : IEntityDto<TKey>
{
    protected CrudAppServiceBase(IRepository<TEntity, TKey> repository)
: base(repository)
    {

    }

    private new Task<TGetOutputDto> UpdateAsync(TKey id, TUpdateInput input)
    {
        return base.UpdateAsync(id, input);
    }
    private new Task<PagedResultDto<TGetListOutputDto>> GetListAsync(TGetListInput input)
    {
        return base.GetListAsync(input);
    }

    public virtual async Task<TGetOutputDto> UpdateAsync(TUpdateInput input)
    {
        await CheckUpdatePolicyAsync();
        var entity = await GetEntityByIdAsync((input as IEntityDto<TKey>).Id);
        MapToEntity(input, entity);
        await Repository.UpdateAsync(entity, autoSave: true);
        return await MapToGetOutputDtoAsync(entity);

    }
    public virtual Task<PagedResultDto<TGetListOutputDto>> GetAllAsync(TGetListInput input)
    {
        return this.GetListAsync(input);
    }   

}


```
基于扩展性考虑，我们可以像官方实现一样做好类型复用

```
public abstract class CrudAppServiceBase<TEntity, TEntityDto, TKey>
    : CrudAppServiceBase<TEntity, TEntityDto, TKey, PagedAndSortedResultRequestDto>
    where TEntity : class, IEntity<TKey>
    where TEntityDto : IEntityDto<TKey>
{
    protected CrudAppServiceBase(IRepository<TEntity, TKey> repository)
        : base(repository)
    {

    }
}

public abstract class CrudAppServiceBase<TEntity, TEntityDto, TKey, TGetListInput>
    : CrudAppServiceBase<TEntity, TEntityDto, TKey, TGetListInput, TEntityDto>
    where TEntity : class, IEntity<TKey>
    where TEntityDto : IEntityDto<TKey>
{
    protected CrudAppServiceBase(IRepository<TEntity, TKey> repository)
        : base(repository)
    {

    }
}


public abstract class CrudAppServiceBase<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput>
    : CrudAppServiceBase<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput, TCreateInput>
    where TEntity : class, IEntity<TKey>
    where TEntityDto : IEntityDto<TKey>
{
    protected CrudAppServiceBase(IRepository<TEntity, TKey> repository)
        : base(repository)
    {

    }
}

public abstract class CrudAppServiceBase<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
: CrudAppServiceBase<TEntity, TEntityDto, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
where TEntity : class, IEntity<TKey>
where TEntityDto : IEntityDto<TKey>
{
    protected CrudAppServiceBase(IRepository<TEntity, TKey> repository)
        : base(repository)
    {

    }

    protected override Task<TEntityDto> MapToGetListOutputDtoAsync(TEntity entity)
    {
        return MapToGetOutputDtoAsync(entity);
    }

    protected override TEntityDto MapToGetListOutputDto(TEntity entity)
    {
        return MapToGetOutputDto(entity);
    }
}

```

## 重写接口

重写增删查改服务接口

```
public interface IBaseCrudAppService<TGetOutputDto, TGetListOutputDto, in TKey, in TGetListInput, in TCreateInput, in TUpdateInput>

    {
        Task<TGetOutputDto> GetAsync(TKey id);

        Task<PagedResultDto<TGetListOutputDto>> GetAllAsync(TGetListInput input);

        Task<TGetOutputDto> CreateAsync(TCreateInput input);

        Task<TGetOutputDto> UpdateAsync(TUpdateInput input);

        Task DeleteAsync(TKey id);

    }

```
基于扩展性考虑，我们可以像官方实现一样做好类型复用
```
public interface IBaseCrudAppService<TEntityDto, in TKey>
    : IBaseCrudAppService<TEntityDto, TKey, PagedAndSortedResultRequestDto>
{

}

public interface IBaseCrudAppService<TEntityDto, in TKey, in TGetListInput>
    : IBaseCrudAppService<TEntityDto, TKey, TGetListInput, TEntityDto>
{

}

public interface IBaseCrudAppService<TEntityDto, in TKey, in TGetListInput, in TCreateInput>
    : IBaseCrudAppService<TEntityDto, TKey, TGetListInput, TCreateInput, TCreateInput>
{

}

public interface IBaseCrudAppService<TEntityDto, in TKey, in TGetListInput, in TCreateInput, in TUpdateInput>
    : IBaseCrudAppService<TEntityDto, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
{

}

```




将应用服务接口IReservationAppService继承于IBaseCrudAppService和IApplicationService

```
public interface IReservationAppService: IBaseCrudAppService<ReservationDto, long>, IApplicationService
{
    //除增删查改业务的其他业务
}
```

创建应用服务类ReservationAppService，此时应用服务派生自CrudAppServiceBase，应用服务应该会完全实现接口
```
public class ReservationAppService : CrudAppServiceBase<Workflow.Reservation.Reservation, ReservationDto, long>, IReservationAppService
{
    ...
}
```


## 替换默认规则

Abp封装了Controller自动生成规则，利用了Asp.Net MVC的约定接口IApplicationModelConvention，这一特性，所谓规则即Convention，AbpServiceConvention是此接口的实现类，在此类中约定了如何将应用层程序集增删查改服务（CrudAppService）中的成员方法，按上述规则生成Controller。

规则的具体代码封装在ConventionalRouteBuilder里



既然是默认规则方式，我们就重写一个自定义的Convention来代替它默认的那个。
假设有领域Workflow，在Web层中新建WorkflowServiceConvention，把原AbpServiceConvention类中的所有内容复制到这个类中

```
public class WorkflowServiceConvention : IAbpServiceConvention, ITransientDependency
{

}
```

将不需要用到的对象删掉
```
// 删除 protected IConventionalRouteBuilder ConventionalRouteBuilder { get; } 
```

重写CreateAbpServiceAttributeRouteModel

```
protected virtual AttributeRouteModel CreateAbpServiceAttributeRouteModel(string rootPath, string controllerName, ActionModel action, string httpMethod, [CanBeNull] ConventionalControllerSetting configuration)
{
    return new AttributeRouteModel(
        new RouteAttribute(
                $"api/services/{rootPath}/{controllerName}/{action.ActionName}"
        )
    );
}
```

在Web层的Module文件WorkflowHostModule中，添加WorkflowApplicationModule
```
Configure<AbpAspNetCoreMvcOptions>(options =>
{
    options
        .ConventionalControllers
        .Create(typeof(WorkflowApplicationModule).Assembly);
});
```

用WorkflowServiceConvention替换原始的AbpServiceConvention实现。

```
Configure<MvcOptions>(options =>
{
    options.Conventions.RemoveAt(0);
    options.Conventions.Add(convention.Value);
});
```

# 在微服务架构中的问题

Asp.Net MVC在微服务的网关层中无法通过仅引用应用层方法的接口，生成Controller，即便改写  ControllerFeatureProvider， 还是需要引用实现类，这些实现类在应用层中。
但网关仅仅依赖定义层，若要拿到实现类，将改变微服务架构的依赖关系。

在官方的微服务实例中，也没有用Controller的自动生成，在这个issue中作者也给出了解答
https://github.com/abpframework/abp/issues/1731
![在这里插入图片描述](f68ca34748b24accafb4db9c81a8d335.png)


因此如果想达到目的，只能用重写controller基类的方式了，这个方式好处在于简单好用，可读性和可维护性高，缺陷就是每写一个应用层类，需要写一个对应的Controller类，但在项目不多用CV大法还是可以接受的。



新建WorkflowController并继承于AbpControllerBase，并创建增删查改（Curd）的终结点路由，通过调用ITAppService的方法，实现各业务功能

```
public abstract class WorkflowController<ITAppService, TGetOutputDto, TGetListOutputDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
    : AbpControllerBase
where ITAppService : IBaseCrudAppService<TGetOutputDto, TGetListOutputDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
        where TGetOutputDto : IEntityDto<TKey>
where TGetListOutputDto : IEntityDto<TKey>
{


    protected WorkflowController()
    {
        LocalizationResource = typeof(WorkflowResource);
    }


    private readonly ITAppService _recipeAppService;

    public WorkflowController(ITAppService recipeAppService)
    {
        _recipeAppService = recipeAppService;
    }

    [HttpPost]
    [Route("Create")]

    public async Task<TGetOutputDto> CreateAsync(TCreateInput input)
    {
        return await _recipeAppService.CreateAsync(input);
    }

    [HttpDelete]
    [Route("Delete")]
    public async Task DeleteAsync(TKey id)
    {
        await _recipeAppService.DeleteAsync(id);
    }

    [HttpGet]
    [Route("GetAll")]
    public async Task<PagedResultDto<TGetListOutputDto>> GetAllAsync(TGetListInput input)
    {
        return await _recipeAppService.GetAllAsync(input);
    }

    [HttpGet]
    [Route("Get")]
    public async Task<TGetOutputDto> GetAsync(TKey id)
    {
        return await _recipeAppService.GetAsync(id);
    }

    [HttpPut]
    [Route("Update")]
    public async Task<TGetOutputDto> UpdateAsync(TUpdateInput input)
    {
        return await _recipeAppService.UpdateAsync(input);
    }
}

```

基于扩展性考虑，我们可以做好类型复用

```
public abstract class WorkflowController<ITAppService, TEntityDto, TKey>
      : WorkflowController<ITAppService, TEntityDto, TKey, PagedAndSortedResultRequestDto>
      where ITAppService : IBaseCrudAppService<TEntityDto, TKey>
      where TEntityDto : IEntityDto<TKey>
{
    protected WorkflowController(ITAppService appService)
        : base(appService)
    {

    }
}

public abstract class WorkflowController<ITAppService, TEntityDto, TKey, TGetListInput>
    : WorkflowController<ITAppService, TEntityDto, TKey, TGetListInput, TEntityDto>
    where ITAppService : IBaseCrudAppService<TEntityDto, TKey, TGetListInput>
    where TEntityDto : IEntityDto<TKey>
{
    protected WorkflowController(ITAppService appService)
        : base(appService)
    {

    }
}


public abstract class WorkflowController<ITAppService, TEntityDto, TKey, TGetListInput, TCreateInput>
 : WorkflowController<ITAppService, TEntityDto, TKey, TGetListInput, TCreateInput, TCreateInput>
 where ITAppService : IBaseCrudAppService<TEntityDto, TKey, TGetListInput, TCreateInput>
 where TEntityDto : IEntityDto<TKey>
{
    protected WorkflowController(ITAppService appService)
        : base(appService)
    {

    }
}

public abstract class WorkflowController<ITAppService, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
: WorkflowController<ITAppService, TEntityDto, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
where ITAppService : IBaseCrudAppService<TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput>
where TEntityDto : IEntityDto<TKey>
{
    protected WorkflowController(ITAppService appService)
        : base(appService)
    {

    }

}


```


创建实际的Controller，定义Area名称和Controller路由“api/Workflow/reservation”

此时Controller派生自WorkflowController，应用服务应该会完全实现接口

```
[Area(WorkflowRemoteServiceConsts.ModuleName)]
[RemoteService(Name = WorkflowRemoteServiceConsts.RemoteServiceName)]
[Route("api/Workflow/reservation")]
public class ReservationController : WorkflowController<IReservationAppService, ReservationDto,long>, IReservationAppService
{
    private readonly IReservationAppService _reservationAppService;

    public ReservationController(IReservationAppService reservationAppService):base(reservationAppService)
    {
        _reservationAppService = reservationAppService;
    }
}
```
运行程序，我们将得到一个旧版的接口
![在这里插入图片描述](c857144b47a2486996a4b3476ca8b2d3.png)


每次为新的应用服务类创建Controller，只需要新建一个派生自WorkflowController类的Controller，并指定一个应用服务类对象。就完成了，不需要自己写一大堆的控制器方法。