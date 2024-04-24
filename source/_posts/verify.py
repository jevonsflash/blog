import json
import sys

def parse_json(json_str):
    try:
        obj = json.loads(json_str)
        return obj
    except Exception as e:
        error_info = sys.exc_info()
        print("解析JSON时发生错误：")
        print("错误类型：", error_info[0])
        print("错误信息：", error_info[1])
        print("错误位置：", error_info[2])
        return None


with open('posts.json', 'r', encoding='utf-8') as file:  
    # 读取文件内容并解析为Python对象  
    posts =  file.read() 


parse_json(posts)