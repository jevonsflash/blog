---
thumbnail: images/13e6e450796f4300b51159cf0ba79854.png
title: '[MAUI 项目实战] 音乐播放器（二）：播放内核'
excerpt: >-
  曲目排序，原理是通过交换位置实现的，iOS和Android平台都有自己的可排序列表控件，在对选中的条目进行排序（往往是提起条目-拖拽-释放）的过程中，触发事件往往提供当前条目。在传统播放器随机播放时，如果下一曲不是我想听的，我仍然想听上一曲，由于上一曲按钮是随机触发的时机，你可能找不到它了，不得不再音乐列表再搜索它。播放控制类，用于当前平台播放器对象的操作，对当前所播放曲目的暂停/播放，下一首/上一首，快进快退（寻迹），随机、单曲模式等功能的控制。同样，用到了排序逻辑，再将他的排序（
tags:
  - Xamarin
  - .net
  - MAUI
categories:
  - .NET
  - .NET MAUI
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-02-12 00:27:00/[MAUI 项目实战] 音乐播放器（二）：播放内核.html'
abbrlink: 9f432214
date: 2023-02-12 00:27:00
cover:
description:
---
## 播放控制服务
IMusicControlService:
播放控制类，用于当前平台播放器对象的操作，对当前所播放曲目的暂停/播放，下一首/上一首，快进快退（寻迹），随机、单曲模式等功能的控制。


播放控制类包含一个平台特定的播放器，由于要制作通用的播放控制类，`IMusicControlService`不开放播放器对象的公共访问，而是通过暴露方法操作播放器对象。

在跨平台中的实现：
* Android平台使用Android.Media.MediaPlayer类
* iOS平台使用AVFoundation.AVAudioPlayer类
* Windows平台使用Windows.Media.Playback.MediaPlayer类

虽然不同平台的播放器类都提供了诸如播放，暂停，寻迹的功能，但不同平台存在着微小差别。
比如停止功能 - Stop：

在iOS中的实现：
```
public partial void Stop()
{
    if (!IsInitFinished()) { return; }

    if (CurrentIosPlayer.Playing)
    {
        CurrentIosPlayer.Stop();
        OnPlayStatusChanged?.Invoke(this, false);

    }
}
```
在Android中，由于Android.Media.MediaPlayer没有提供Stop方法，所以停止的逻辑用寻迹至0位置暂停实现的
```
public partial void Stop()
{
    if (CurrentAndroidPlayer.IsPlaying)
    {
        CurrentAndroidPlayer.SeekTo(0);
        CurrentAndroidPlayer.Pause();

    }
}
```
又如寻迹功能 - SeekTo
在iOS中的实现，`postion`参数为曲目开始后的时间值，单位秒。改变播放位置是通过直接赋值AVFoundation.AVAudioPlayer.CurrentTime实现的
```
public partial void SeekTo(double position)

{
    if (!IsInitFinished()) { return; }
    CurrentIosPlayer.CurrentTime = position;
}
```
在Android中，Android.Media.MediaPlayer提供了SeekTo方法，传入值是毫秒，因此要做一下转换：
```
public partial void SeekTo(double position)
{
    CurrentAndroidPlayer.SeekTo((int)position * 1000);

}
```

在传统播放器随机播放时，如果下一曲不是我想听的，我仍然想听上一曲，由于上一曲按钮是随机触发的时机，你可能找不到它了，不得不再音乐列表再搜索它。这可能是个遗憾

我在这个随机模型中引入随机播放映射表，使得在随机模式中，上一曲/下一曲仍然能发挥其作用。

刷新随机列表：
`increment`为跳转步数，例如increment = 1时相当于下一曲，increment = -1 时相当于上一曲：
```
private partial int GetShuffleMusicIndex(int originItem, int increment)
{
    var originItemIndex = 0;

    foreach (var item in ShuffleMap)
    {
        if (originItem == item)
        {
            break;
        }
        originItemIndex++;
    }
    var newItemIndex = originItemIndex + increment;
    if (newItemIndex < 0)
    {
        newItemIndex = LastIndex;
    }
    if (newItemIndex > LastIndex)
    {
        newItemIndex = 0;
    }
    var shuffleMapCount = shuffleMap.Count();

    var musicInfosCount = MusicInfos.Count();

    if (shuffleMapCount != musicInfosCount)
    {
        shuffleMap = CommonHelper.GetRandomArry(0, LastIndex);
        shuffleMapCount = shuffleMap.Count();
    }

    if (shuffleMapCount > 0 && newItemIndex < shuffleMapCount)
    {
        var resultContent = ShuffleMap[newItemIndex];
        return resultContent;
    }
    else
    {
        return -1;
    }
}


```

GetRandomArry 方法将产生一个指定最小值到最大值连续数列的随机数组

```
public static int[] GetRandomArry(int minval, int maxval)
{

    int[] arr = new int[maxval - minval + 1];
    int i;
    //初始化数组
    for (i = 0; i <= maxval - minval; i++)
    {
        arr[i] = i + minval;
    }
    //随机数
    Random r = new Random();
    for (int j = maxval - minval; j >= 1; j--)
    {
        int address = r.Next(0, j);
        int tmp = arr[address];
        arr[address] = arr[j];
        arr[j] = tmp;
    }
    //输出
    foreach (int k in arr)
    {
        Debug.WriteLine(k + " ");
    }
    return arr;
}

```



关键属性：
* ShuffleMap - 随机播放映射表
* MusicInfos - 播放器音频列表
* LastIndex - 当前播放曲目位于器音频列表位置角标


关键方法：
* Play - 播放
* PauseOrResume - 暂停/恢复
* RebuildMusicInfos - 从播放列队中读取音频列表，刷新播放器队列
* SeekTo - 快进快退（寻迹）
* GetNextMusic - 获取下一首曲目信息
* GetPreMusic - 获取上一首曲目信息
* InitPlayer - 初始化播放器
* UpdateShuffleMap - 更新随机播放映射表
* SetRepeatOneStatus - 设置是否单曲循环
* Duration - 获取当前曲目时长
* CurrentTime - 获取当前曲目播放进度
* IsPlaying - 获取是否在播放中
* IsInitFinished - 获取是否完成播放器初始化

关键事件：
* OnPlayFinished - 完成当前曲目播放时触发
* OnRebuildMusicInfosFinished - 完成刷新播放器队列触发
* OnProgressChanged - 播放进度更改时触发
* OnPlayStatusChanged - 播放状态变更时触发

接口定义：

```
public interface IMusicControlService
{
    event EventHandler<bool> OnPlayFinished;
    event EventHandler OnRebuildMusicInfosFinished;
    event EventHandler<double> OnProgressChanged;
    event EventHandler<bool> OnPlayStatusChanged;
    public IMusicInfoManager MusicInfoManager { get; set; }

    int[] ShuffleMap { get; }
    List<MusicInfo> MusicInfos { get; }
    int LastIndex { get; }
    Task RebuildMusicInfos(Action callback);
    void SeekTo(double position);
    MusicInfo GetNextMusic(MusicInfo current, bool isShuffle);
    MusicInfo GetPreMusic(MusicInfo current, bool isShuffle);
    int GetMusicIndex(MusicInfo musicInfo);
    MusicInfo GetMusicByIndex(int index);
    Task InitPlayer(MusicInfo musicInfo);
    void Play(MusicInfo currentMusic);
    void Stop();
    void PauseOrResume();
    void PauseOrResume(bool status);
    Task UpdateShuffleMap();
    void SetRepeatOneStatus(bool isRepeatOne);
    double Duration();
    double CurrentTime();
    bool IsPlaying();
    bool IsInitFinished();
}
```


## 曲目管理器设计

IMusicInfoManager:
曲目管理类，用于歌曲队列，歌单的编辑；各曲目集合增加，删除等功能

歌曲队列，歌单等信息存在于本地数据库，曲目管理类将对这些数据增、删、查、改的操作，Abp框架实现的仓储模式为我们生成了Repository对象。

在`MusicInfoManager`构造函数中注入各仓储依赖
```
public MusicInfoManager(IRepository<Queue, long> queueRepository,
    IRepository<PlaylistItem, long> playlistItemRepository,
    IRepository<Playlist, long> playlistRepository,
    IUnitOfWorkManager unitOfWorkManager
    )
{
    ...
}
```

## 读取播放队列

播放队列具有一定的代表性，歌单的逻辑与播放队列类似，所以本篇博文着重讲述播放队列的业务

播放队列存在于本地数据库的Queue表中，全部将他们读取。

播放队列的Entry项和设备中的媒体条目是一种弱关联，需要将他们“螯合”起来，连表左联查询后取得MusicInfo集合。

```
[UnitOfWork]
public async Task<List<MusicInfo>> GetQueueEntry()
{
    var queueEntrys = await queueRepository.GetAll().ToListAsync();
    if (_musicInfos == null || _musicInfos.Count == 0)
    {
        var isSucc = await GetMusicInfos();
        if (!isSucc.IsSucess)
        {
            //CommonHelper.ShowNoAuthorized();
        }
        _musicInfos = isSucc.Result;

    }
    var result =
        from queue in queueEntrys
        join musicInfo in _musicInfos
        on queue.MusicInfoId equals musicInfo.Id
        orderby queue.Rank
        select musicInfo;
    return result.ToList();
}

```

返回时依据`Rank`字段递增排序。


## 添加播放队列

播放整个专辑时，将整个专辑中的所有曲目添加到播放队列：

`QueueAllAction`在点击播放专辑时触发，首先清空当前播放队列，接着将当前页面绑定的曲目集合（`Musics`对象）插入到播放队列

```
private async void QueueAllAction(object obj)
{
    await MusicInfoManager.ClearQueue();
    var result = await MusicInfoManager.CreateQueueEntrys(Musics);

    ..
}
```

`MusicInfoManager.cs` 中定义了清空播放队列ClearQueue，和歌单中创建曲目集合方法CreateQueueEntrys：
```
[UnitOfWork]
public async Task ClearQueue()
{
    await queueRepository.DeleteAsync(c => true);

}
```

```
[UnitOfWork]
public async Task<bool> CreateQueueEntrys(List<MusicInfo> musicInfos)
{
    var lastItemRank = queueRepository.GetAll().OrderBy(c => c.Rank).Select(c => c.Rank).LastOrDefault();
    var entrys = new List<Queue>();
    foreach (var music in musicInfos)
    {
        var entry = new Queue(music.Title, lastItemRank, music.Id);
        lastItemRank++;
        entrys.Add(entry);
    }
    await queueRepository.GetDbContext().AddRangeAsync(entrys);
    return true;
}
```
需要注意的是，`Rank`字段将在队列最后一条后继续递增

## 曲目排序

曲目排序，原理是通过交换位置实现的，iOS和Android平台都有自己的可排序列表控件，在对选中的条目进行排序（往往是提起条目-拖拽-释放）的过程中，触发事件往往提供当前条目`oldMusicInfo`，和排斥条目`newMusicInfo`，调用ReorderQueue时将这辆个参数传入，将这两个MusicInfo的`Rank`值交换：

```
[UnitOfWork]
public void ReorderQueue(MusicInfo oldMusicInfo, MusicInfo newMusicInfo)
{
    var oldMusic = queueRepository.FirstOrDefault(c => c.MusicTitle==oldMusicInfo.Title);
    var newMusic = queueRepository.FirstOrDefault(c => c.MusicTitle==newMusicInfo.Title);
    if (oldMusic ==null || newMusic==null)
    {
        return;
    }
    var oldRank = oldMusic.Rank;
    oldMusic.Rank=newMusic.Rank;
    newMusic.Rank=oldRank;
    queueRepository.Update(oldMusic);
    queueRepository.Update(newMusic);
}
```

## 下一首播放

下一首播放将播放队列中，指定的曲目排在当前播放曲目之后，实现方式是线确保目标曲目存在于播放队列。同样，用到了排序逻辑，再将他的排序（`Rank`值）与当前播放曲目之后的做交换。


```
public partial async Task<bool> InsertToEndQueueEntry(MusicInfo musicInfo)
{
    var result = false;
    var isSuccessCreate = false;
    //如果没有则先创建
    if (!await GetIsQueueContains(musicInfo.Title))
    {
        isSuccessCreate = await CreateQueueEntry(musicInfo);
        await unitOfWorkManager.Current.SaveChangesAsync();
    }
    else
    {
        isSuccessCreate = true;
    }
    //确定包含后与下一曲交换位置
    if (isSuccessCreate)
    {
        var current = currentMusic;
        Queue newMusic = null;
        var lastItem = await queueRepository.FirstOrDefaultAsync(c => c.MusicTitle==current.Title);
        if (lastItem!=null)
        {
            newMusic = await queueRepository.FirstOrDefaultAsync(c => c.Rank==lastItem.Rank+1);
        }

        var oldMusic = await queueRepository.FirstOrDefaultAsync(c => c.MusicTitle==musicInfo.Title);

        if (oldMusic ==null || newMusic==null)
        {
            return true;
        }
        var oldRank = oldMusic.Rank;
        oldMusic.Rank=newMusic.Rank;
        newMusic.Rank=oldRank;
        queueRepository.Update(oldMusic);
        queueRepository.Update(newMusic);

        result = true;
    }
    else
    {
        result = false;
    }
    return result;
}

```

其它关键方法：


* ClearQueue - 从播放队列中清除所有曲目
* CreatePlaylist - 创建歌单
* CreatePlaylistEntry - 歌单中创建曲目
* CreatePlaylistEntrys - 歌单中创建曲目集合
* CreatePlaylistEntrysToMyFavourite - “我最喜爱”中插入曲目集合
* CreateQueueEntry - 播放队列中创建曲目
* CreateQueueEntrys - 播放队列中创建曲目集合
* DeleteMusicInfoFormQueueEntry - 从队列中删除指定曲目
* DeletePlaylist - 删除歌单
* DeletePlaylistEntry - 从歌单中删除曲目
* DeletePlaylistEntryFromMyFavourite - 从“我最喜爱”中删除曲目
* GetMusicInfos - 获取曲目集合
* GetAlbumInfos -  获取专辑集合
* GetArtistInfos -  获取艺术家集合
* GetAlphaGroupedMusicInfo - 获取分组包装好的曲目集合
* GetAlphaGroupedAlbumInfo - 获取分组包装好的专辑集合
* GetAlphaGroupedArtistInfo - 获取分组包装好的艺术家集合
* GetIsMyFavouriteContains - 曲目是否包含在"我最喜爱"中
* GetIsPlaylistContains - 曲目是否包含在歌单中
* GetIsQueueContains - 曲目是否包含在播放队列中
* GetPlaylist - 获取歌单列表
* GetPlaylistEntry - 获取歌单列表
* GetPlaylistInfo - 获取歌单中的曲目
* GetQueueEntry - 获取播放队列中的曲目
* InsertToEndQueueEntry - 插入曲目到播放队列中的末尾
* InsertToEndQueueEntrys -  插入曲目集合到播放队列中的末尾
* InsertToNextQueueEntry -  插入曲目到队列中的下一曲（下一首播放）
* UpdatePlaylist - 更新歌单信息

接口定义：
```
public interface IMusicInfoManager
{
    Task ClearQueue();
    Task<bool> CreatePlaylist(Playlist playlist);
    Task<bool> CreatePlaylistEntry(MusicInfo musicInfo, long playlistId);
    Task<bool> CreatePlaylistEntrys(List<MusicInfo> musics, long playlistId);
    Task<bool> CreatePlaylistEntrys(MusicCollectionInfo musicCollectionInfo, long playlistId);
    Task<bool> CreatePlaylistEntrysToMyFavourite(List<MusicInfo> musics);
    Task<bool> CreatePlaylistEntrysToMyFavourite(MusicCollectionInfo musicCollectionInfo);
    Task<bool> CreatePlaylistEntryToMyFavourite(MusicInfo musicInfo);
    Task<bool> CreateQueueEntry(MusicInfo musicInfo);
    Task<bool> CreateQueueEntrys(List<MusicInfo> musicInfos);
    Task<bool> CreateQueueEntrys(MusicCollectionInfo musics);
    Task<bool> DeleteMusicInfoFormQueueEntry(MusicInfo musicInfo);
    Task<bool> DeleteMusicInfoFormQueueEntry(string musicTitle);
    Task<bool> DeletePlaylist(long playlistId);
    Task<bool> DeletePlaylist(Playlist playlist);
    Task<bool> DeletePlaylistEntry(MusicInfo musicInfo, long playlistId);
    Task<bool> DeletePlaylistEntry(string musicTitle, long playlistId);
    Task<bool> DeletePlaylistEntryFromMyFavourite(MusicInfo musicInfo);
    Task<InfoResult<List<AlbumInfo>>> GetAlbumInfos();
    Task<AlphaGroupedObservableCollection<AlbumInfo>> GetAlphaGroupedAlbumInfo();
    Task<AlphaGroupedObservableCollection<ArtistInfo>> GetAlphaGroupedArtistInfo();
    Task<AlphaGroupedObservableCollection<MusicInfo>> GetAlphaGroupedMusicInfo();
    Task<InfoResult<List<ArtistInfo>>> GetArtistInfos();
    Task<bool> GetIsMyFavouriteContains(MusicInfo musicInfo);
    Task<bool> GetIsMyFavouriteContains(string musicTitle);
    Task<bool> GetIsPlaylistContains(MusicInfo musicInfo, long playlistId);
    Task<bool> GetIsPlaylistContains(string musicTitle, long playlistId);
    Task<bool> GetIsQueueContains(string musicTitle);
    Task<InfoResult<List<MusicInfo>>> GetMusicInfos();
    Task<List<Playlist>> GetPlaylist();
    Task<List<MusicInfo>> GetPlaylistEntry(long playlistId);
    Task<List<MusicInfo>> GetPlaylistEntryFormMyFavourite();
    Task<List<PlaylistInfo>> GetPlaylistInfo();
    Task<List<MusicInfo>> GetQueueEntry();
    Task<bool> InsertToEndQueueEntry(MusicInfo musicInfo);
    Task<bool> InsertToEndQueueEntrys(List<MusicInfo> musicInfos);
    Task<bool> InsertToNextQueueEntry(MusicInfo musicInfo, MusicInfo currentMusic);
    Task<bool> UpdatePlaylist(Playlist playlist);
}

```




## 获取本地音乐


### Android中的实现
在Android平台中`MatoMusic.Core\Platforms\Android\MusicInfoManager.cs`


MediaStore类是Android平台的多媒体数据库，它包含了音频，视频，图片等所有多媒体文件信息。

Android扫描服务会在后台自动扫描设备文件资源，将设备上的音乐媒体信息加入到MediaStore数据库中。应用程序通过Android平台提供的ContentProvider包含的API直接从MediaStore中读取相应的媒体信息。


获取设备多媒体信息的实现方式如下：
```
public IList<MusicInfo> GetAllSongs()
{

    IList<MusicInfo> songs = new ObservableCollection<MusicInfo>();
    ICursor mediaCursor, genreCursor, albumCursor;

    mediaCursor = Application.Context.ContentResolver.Query(
        MediaStore.Audio.Media.ExternalContentUri,
        _mediaProjections, null, null,
        MediaStore.Audio.Media.InterfaceConsts.TitleKey);

    int artistColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.Artist);
    int albumColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.Album);
    int titleColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.Title);
    int durationColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.Duration);
    int uriColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.Data);
    int idColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.Id);
    int isMusicColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.IsMusic);
    int albumIdColumn = mediaCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.AlbumId);

    int isMusic;
    ulong duration, id;
    string artist, album, title, uri, genre, artwork, artworkId;

    if (mediaCursor.MoveToFirst())
    {
        do
        {
            isMusic = int.Parse(mediaCursor.GetString(isMusicColumn));
            if (isMusic != 0)
            {
                ulong.TryParse(mediaCursor.GetString(durationColumn),out duration);
                artist = mediaCursor.GetString(artistColumn);
                album = mediaCursor.GetString(albumColumn);
                title = mediaCursor.GetString(titleColumn);
                uri = mediaCursor.GetString(uriColumn);
                ulong.TryParse(mediaCursor.GetString(idColumn), out id);
                artworkId = mediaCursor.GetString(albumIdColumn);

                genreCursor = Application.Context.ContentResolver.Query(
                    MediaStore.Audio.Genres.GetContentUriForAudioId("external", (int)id),
                    _genresProjections, null, null, null);
                int genreColumn = genreCursor.GetColumnIndex(MediaStore.Audio.Genres.InterfaceConsts.Name);
                if (genreCursor.MoveToFirst())
                {
                    genre = genreCursor.GetString(genreColumn) ?? string.Empty;
                }
                else
                {
                    genre = string.Empty;
                }
                //https://stackoverflow.com/questions/63181820/why-is-album-art-the-only-field-that-returns-null-from-mediastore-when-others-ar

                ImageSource artworkImage = null;

                if (DeviceInfo.Version.Major < 10)
                {
                    albumCursor = Application.Context.ContentResolver.Query(
                        MediaStore.Audio.Albums.ExternalContentUri,
                        _albumProjections,
                        $"{MediaStore.Audio.Albums.InterfaceConsts.Id}=?",
                        new string[] { artworkId },
                        null);
                    int artworkColumn = albumCursor.GetColumnIndex(MediaStore.Audio.Media.InterfaceConsts.AlbumArt);
                    if (albumCursor.MoveToFirst())
                    {
                        artwork = albumCursor.GetString(artworkColumn) ?? string.Empty;
                    }
                    else
                    {
                        artwork = String.Empty;
                    }

                    albumCursor?.Close();
                    artworkImage = artwork;

                }
                else
                {
                    var extUrl = MediaStore.Audio.Albums.ExternalContentUri;
                    var albumArtUri = ContentUris.WithAppendedId(extUrl, long.Parse(artworkId));

                    try
                    {
                        //var art = System.IO.Path.Combine (Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "albumart" + artworkId + ".jpg");
                        var art = System.IO.Path.Combine(Android.OS.Environment.GetExternalStoragePublicDirectory(Android.OS.Environment.DirectoryDocuments).AbsolutePath, "albumart" + artworkId + ".jpg");

                        var bitmap = Application.Context.ContentResolver.LoadThumbnail(albumArtUri, new Android.Util.Size(1024, 1024), null);
                        var h = bitmap.Height;
                        var w = bitmap.Width;
                        var bb = bitmap.ByteCount;

                        using (Stream ms = new FileStream(art, FileMode.Create))
                        {
                            bitmap.Compress(Bitmap.CompressFormat.Png, 100, ms);
                            bitmap.Recycle();
                        }
                        artworkImage = art;
                    }
                    catch (Exception e)
                    {
                        System.Console.WriteLine(e.Message);
                    }
                }
                songs.Add(new MusicInfo()
                {
                    Id = (int)id,
                    Title = title,
                    Artist = artist,
                    AlbumTitle = album,
                    Genre = genre,
                    Duration = duration / 1000,
                    Url = uri,
                    AlbumArt = artworkImage
                });
                genreCursor?.Close();
            }
        } while (mediaCursor.MoveToNext());
    }
    mediaCursor?.Close();

    return songs;

}

```

获取音乐信息集合
```
public partial async Task<InfoResult<List<MusicInfo>>> GetMusicInfos()
{
    List<MusicInfo> musicInfos;

    var result = false;

    if (await MediaLibraryAuthorization())
    {

        musicInfos = await Task.Run(() =>
        {
            var Infos = (from item in GetAllSongs()

                            select new MusicInfo()
                            {
                                Id = item.Id,
                                Title = item.Title,
                                Duration = item.Duration,
                                Url = item.Url,
                                AlbumTitle = item.AlbumTitle,
                                Artist = item.Artist,
                                AlbumArt = item.AlbumArt,
                                GroupHeader = GetGroupHeader(item.Title),
                                IsFavourite = GetIsMyFavouriteContains(item.Title).Result,
                                IsInitFinished = true
                            }).ToList();
            return Infos;
        });

        result = true;

    }
    else
    {
        musicInfos = new List<MusicInfo>();
        result = false;
    }
    return new InfoResult<List<MusicInfo>>(result, musicInfos);

}

```


### iOS中的实现

在iOS平台中`MatoMusic.Core\Platforms\iOS\MusicInfoManager.cs`

在iOS平台中获取音乐信息要简单得多，MPMediaQuery这个类获取通系统自带的‘音乐’软件下载的，或通过iTunes导入的本地歌曲文件

MPMediaQuery 类使用方式可以参考[官方文档](
https://learn.microsoft.com/zh-cn/dotnet/api/mediaplayer.mpmediaquery)

获取音乐信息集合
```
public partial async Task<InfoResult<List<MusicInfo>>> GetMusicInfos()
{
    List<MusicInfo> musicInfos;

    var result = false;
    if (await MediaLibraryAuthorization())
    {
        musicInfos = await Task.Run(() =>
        {
            var Infos = (from item in MediaQuery.Items
                            where item.MediaType == MPMediaType.Music
                            select new MusicInfo()
                            {
                                Id = (int)item.PersistentID,
                                Title = item.Title,
                                Url = item.AssetURL.ToString(),
                                Duration = Convert.ToUInt64(item.PlaybackDuration),

                                AlbumTitle = item.AlbumTitle,
                                Artist = item.Artist,
                                AlbumArt = GetAlbumArtSource(item),
                                GroupHeader = GetGroupHeader(item.Title),
                                IsFavourite = GetIsMyFavouriteContains(item.Title).Result,
                                IsInitFinished = true

                            }).ToList();
            return Infos;
        });

        result = true;

    }
    else
    {
        musicInfos = new List<MusicInfo>();
        result = false;
    }
    return new InfoResult<List<MusicInfo>>(result, musicInfos);

}

```

### Windows中的实现

在Windows设备中，需要指定一个主目录来扫描音乐文件，我们指定一个缺省目录，如`“音乐”`文件夹（`KnownFolders.MusicLibrary`），好跟之前两个平台的行为保持一致
```
private async Task<List<MusicInfo>> SetMusicListAsync(StorageFolder musicFolder = null)
{

    var localSongs = new List<MusicInfo>();
    List<StorageFile> songfiles = new List<StorageFile>();
    if (musicFolder == null)
    {
        musicFolder = KnownFolders.MusicLibrary;
    }

    await GetLocalSongsAysnc(songfiles, musicFolder);
    localSongs = await PopulateSongListAsync(songfiles);

    return localSongs;

}
```

递归调用GetLocalSongsAysnc，遍历主目录以及其子目录的所有`.mp3`文件
```
private async Task GetLocalSongsAysnc(List<StorageFile> songFiles, StorageFolder parent)
{
    foreach (var item in await parent.GetFilesAsync())
    {
        if (item.FileType == ".mp3")
            songFiles.Add(item);
    }
    foreach (var folder in await parent.GetFoldersAsync())
    {
        await GetLocalSongsAysnc(songFiles, folder);
    }
}
```

从本地文件读取音频信息，转成曲目信息
```
private async Task<List<MusicInfo>> PopulateSongListAsync(List<StorageFile> songFiles)
{

    var localSongs = new List<MusicInfo>();
    int Id = 1;

    foreach (var file in songFiles)
    {
        MusicInfo song = new MusicInfo();

        // 1. 获取文件信息
        MusicProperties musicProperty = await file.Properties.GetMusicPropertiesAsync();
        if (!string.IsNullOrEmpty(musicProperty.Title))
            song.Title = musicProperty.Title;
        else
        {
            song.Title = file.DisplayName;
        }

        StorageItemThumbnail currentThumb = await file.GetThumbnailAsync(ThumbnailMode.MusicView, 60, ThumbnailOptions.UseCurrentScale);

        // 2.将文件信息转换为数据模型

        string coverUri = "ms-appx:///Assets/Default/Default.jpg";

        song.Id = Id;
        song.Url = file.Path;
        song.GroupHeader = GetGroupHeader(song.Title);
        if (!string.IsNullOrEmpty(musicProperty.Artist))
            song.Artist = musicProperty.Artist;
        else
            song.Artist = "未知歌手";
        if (!string.IsNullOrEmpty(musicProperty.Album))
            song.AlbumTitle = musicProperty.Album;
        else
            song.AlbumTitle = "未知唱片";
        song.Duration = (ulong)musicProperty.Duration.TotalSeconds;


        //3. 添加至UI集合中

        var task01 = SaveImagesAsync(file, song);
        var result = await task01;
        var task02 = task01.ContinueWith((e) =>
            {
                if (result.IsSucess)
                {
                    song.AlbumArtPath = result.Result;
                }
                else
                {
                    song.AlbumArtPath = coverUri;

                }
            });

        Task.WaitAll(task01, task02);
        song.IsInitFinished = true;
        localSongs.Add(song);
        Id++;

    }
    return localSongs;
}

```

获取音乐信息集合
```
public partial async Task<InfoResult<List<MusicInfo>>> GetMusicInfos()
{
    List<MusicInfo> musicInfos;
    var result = false;
    if (await MediaLibraryAuthorization())
    {
        musicInfos = await SetMusicListAsync();
        result = true;
    }
    else
    {
        musicInfos = new List<MusicInfo>();
        result = false;
    }
    return new InfoResult<List<MusicInfo>>(result, musicInfos);

}

```


## 获取专辑和艺术家

专辑信息包含了音乐集合


获取专辑和艺术家的跨平台的实现方式大同小异，以Android平台为例

GetAlbumInfos方法用于获取AlbumInfo集合
```
public partial async Task<InfoResult<List<AlbumInfo>>> GetAlbumInfos()
{
    List<AlbumInfo> albumInfo;
    var result = false;

    if (await MediaLibraryAuthorization())
    {
        var isSucc = await GetMusicInfos();
        if (!isSucc.IsSucess)
        {
            //CommonHelper.ShowNoAuthorized();

        }
        albumInfo = await Task.Run(() =>
        {
            var info = (from item in isSucc.Result
                        group item by item.AlbumTitle
                into c
                        select new AlbumInfo()
                        {
                            Title = c.Key,
                            GroupHeader = GetGroupHeader(c.Key),

                            AlbumArt = c.FirstOrDefault().AlbumArt,
                            Musics = new ObservableCollection<MusicInfo>(c.Select(d => new MusicInfo()
                            {
                                Id = d.Id,
                                Title = d.Title,
                                Duration = d.Duration,
                                Url = d.Url,
                                AlbumTitle = d.AlbumTitle,
                                Artist = d.Artist,
                                AlbumArt = d.AlbumArt,
                                IsFavourite = GetIsMyFavouriteContains(d.Title).Result,
                                IsInitFinished = true
                            }))

                        }).ToList();
            return info;
        });

        result = true;

    }
    else
    {
        albumInfo = new List<AlbumInfo>();
        result = false;
    }
    return new InfoResult<List<AlbumInfo>>(result, albumInfo);

}
```
GetArtistInfos方法用于获取ArtistInfo集合
```
public partial async Task<InfoResult<List<ArtistInfo>>> GetArtistInfos()
{
    List<ArtistInfo> artistInfo;
    var result = false;
    if (await MediaLibraryAuthorization())
    {
        var isSucc = await GetMusicInfos();
        if (!isSucc.IsSucess)
        {
            //CommonHelper.ShowNoAuthorized();

        }
        artistInfo = await Task.Run(() =>
        {

            var info = (from item in isSucc.Result
                        group item by item.Artist
                into c
                        select new ArtistInfo()
                        {
                            Title = c.Key,
                            GroupHeader = GetGroupHeader(c.Key),
                            Musics = new ObservableCollection<MusicInfo>(c.Select(d => new MusicInfo()
                            {
                                Id = d.Id,
                                Title = d.Title,
                                Duration = d.Duration,
                                Url = d.Url,
                                AlbumTitle = d.AlbumTitle,
                                Artist = d.Artist,
                                AlbumArt = d.AlbumArt,
                                IsFavourite = GetIsMyFavouriteContains(d.Title).Result,
                                IsInitFinished = true

                            }))

                        }).ToList();
            return info;
        });
        result = true;

    }
    else
    {
        artistInfo = new List<ArtistInfo>();
        result = false;
    }
    return new InfoResult<List<ArtistInfo>>(result, artistInfo);
}
```

## 项目地址
[GitHub:MatoMusic](https://github.com/jevonsflash/MatoMusic)
