---
thumbnail: images/34025b7a6a2e4bc6bd3e6503df461bc3.png
title: '[Python]语音识别媒体中的音频到文本'
excerpt: >-
  Azure提供了快捷转换语音到文本的工具
  https://speech.microsoft.com/portal。这里需要注意的是，需要上传的音频格式为16kHz 或 8kHz、16 位和单声道
  PCM。编写代码，将视频文件test.mp4中的音频提取到test2.wav。文件以16kHz 采样率和单声道 PCM
  编码方式，保存至。中的音频识别，并转换成文本写入。上传完成后将自动转换成文本。编写代码，将视频文件。
tags:
  - Python
  - 语音识别
  - Azure
categories:
  - Python
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-03-17 19:30:00/[Python]语音识别媒体中的音频到文本.html'
abbrlink: ccca819f
date: 2023-03-17 19:30:00
cover:
description:
---
<!-- toc -->
## 准备工作
1. 安装python3环境
2. 申请一个可用的语音转换API，此篇以[Microsoft Azure Speech](https://azure.microsoft.com/en-us/services/cognitive-services/speech/)为例
在Microsoft Azure 市场中搜索`speech`关键字找到语音服务。并创建好服务实例
![在这里插入图片描述](25158d8c751c482193f5222808d189a1.png)
在资源中找到创建的服务并查看
![在这里插入图片描述](c97c192f8af644f88477bf776f634a31.png)
在此处点击显示密钥，我们要记住`key`值和`location`值，作为语音识别库的请求参数
![在这里插入图片描述](73158a9e206449b7bd505e6ffb2587bf.png)


## 视频转音频
安装视频库[moviepy](https://zulko.github.io/moviepy/gallery.html)
```
pip install moviepy 
```
编写代码，将视频文件test.mp4中的音频提取到test2.wav

```python
import moviepy.editor

videoClip = moviepy.editor.VideoFileClip(r"{}".format("test.mp4"))
videoClip.audio.write_audiofile(r"{}".format("test2.wav"))
```

## 识别音频到文本

安装语音识别库[SpeechRecognition](https://github.com/Uberi/speech_recognition)
```
pip install SpeechRecognition 
```
编写代码，将视频文件`test3.wav`中的音频识别，并转换成文本写入`test.txt`
```python
import speech_recognition 

audio2 = speech_recognition.AudioFile("{}".format("test3.wav"))
recognizer =  speech_recognition.Recognizer()
with audio2 as source:
    audioData = recognizer.record(source)
result = recognizer.recognize_azure(audioData,key="<your api key>",language="zh-CN",location="eastus")
with open('test.txt', 'w') as file:
    if result.__len__()>0:
        file.write(result[0])

```

完整代码如下

```python
import speech_recognition 
import moviepy.editor

videoClip = moviepy.editor.VideoFileClip(r"{}".format("test.mp4"))
videoClip.audio.write_audiofile(r"{}".format("test2.wav"))
audio2 = speech_recognition.AudioFile("{}".format("test2.wav"))
recognizer =  speech_recognition.Recognizer()
with audio2 as source:
    audioData = recognizer.record(source)
result = recognizer.recognize_azure(audioData,key="<your api key>",language="zh-CN",location="eastus")
with open('test.txt', 'w') as file:
    if result.__len__()>0:
        file.write(result[0])

```

## 音频直接转换文本
Azure提供了快捷转换语音到文本的工具 https://speech.microsoft.com/portal
点击实时语音转文本
![在这里插入图片描述](34025b7a6a2e4bc6bd3e6503df461bc3.png)
这里需要注意的是，需要上传的音频格式为16kHz 或 8kHz、16 位和单声道 PCM
![在这里插入图片描述](2523e7322e3449ec9404008b4bbac446.png)
上传完成后将自动转换成文本
![在这里插入图片描述](4698ae8410df4ce1846865624db9a07c.png)


安装音频转换库[pydub](https://github.com/jiaaro/pydub)
```
pip install pydub
```

编写代码，将`test.aac`文件以16kHz 采样率和单声道 PCM 编码方式，保存至`test1.wav`
**注意，如果使用ffmpeg编码的格式，需要下载ffmpeg相关库到脚本所在目录
http://www.ffmpeg.org/download.html#build-windows**
```python
from pydub import AudioSegment

audio1 = AudioSegment.from_file("test.aac", "aac")
#  -ac 1 -ar 16000 
audio1.export("test1.wav", format="wav",parameters=["-ac", "1", "-ar", "16000"])
```
