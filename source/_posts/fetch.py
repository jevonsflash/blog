import os  
import requests  
import json  
import re

# 假设你已经有了一个包含上述 JSON 的字符串或者从某个 URL 获取了它  
# 这里我们直接定义一个包含 JSON 的字符串作为示例  
# https://blog.csdn.net/community/home-api/v1/get-business-list?page=3&size=50&businessType=blog&orderby=&noMore=false&year=&month=&username=jevonsflash
with open('posts.json', 'r', encoding='utf-8') as file:  
    # 读取文件内容并解析为Python对象  
    data = json.load(file)  

  
# 检查响应状态码  
if data['code'] == 200:  
    # 获取列表中的第一个元素（如果有多个，可以遍历）  
    for item in data['data']['list']:  
        print("---------")
        if item['type'] !=   1:
            continue
        # 保存 title 和 description  
        title = item['title']  
        description = item['description']  

        # 创建保存图片的目录  
        image_dir = os.path.join('../','images')  
        if not os.path.exists(image_dir):  
            os.makedirs(image_dir) 

        if 'picList' in item:
            # 保存图片到本地  
            if item['picList'].__len__()>0:                 
                pic_url=item['picList'][0]
                response = requests.get(pic_url)  
                if response.status_code == 200:  
                    # 图片文件名可以是 URL 的最后一部分，或者根据需要自定义  
                    prueFilename =  os.path.basename(pic_url)
                    filename = os.path.join(image_dir, prueFilename )
                    with open(filename, 'wb') as f:  
                        f.write(response.content)  
                    print(f"Saved {filename}")  
                else:  
                    print(f"Failed to download {pic_url}")  
            
        # 打印 title 和 description（或根据需要处理）  
        print(f"Title: {title}")  
        print(f"Description: {description}")  
        markdown_filename = title+".md"  
        try:
        # 读取 Markdown 文件内容  
            with open(markdown_filename, 'r', encoding='utf-8') as file:  
                markdown_content = file.read()  
            if filename:
                markdown_content = markdown_content.replace('thumbnail:', f'thumbnail: \'images/{prueFilename}\'')
            markdown_content = markdown_content.replace('excerpt:', f'excerpt: \'{description}\'')
            
            # 保存修改后的 Markdown 文件内容  
            with open(markdown_filename, 'w', encoding='utf-8') as file:  
                file.write(markdown_content)  
        except:
            print("Markdown file not found."+markdown_filename)
        
        print("Markdown file updated with thumbnail and description.")
