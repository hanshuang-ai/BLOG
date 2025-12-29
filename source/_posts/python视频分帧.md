---
title: python视频分帧
categories: 后端开发
date: 2023-02-13 00:00:00
tags: [python, 视频处理, 分帧, opencv]
updated: 2019-10-06 15:25:28
---
```python
import cv2
import os

# 设置视频文件路径
video_path = '1.mp4'

# 设置保存帧图片的文件夹
output_folder = 'output_frames'

# 确保输出文件夹存在
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 打开视频文件
cap = cv2.VideoCapture(video_path)

# 检查视频是否成功打开
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

frame_count = 0

while True:
    # 读取一帧
    ret, frame = cap.read()

    # 如果读取失败（例如视频结束），则退出循环
    if not ret:
        break

    # 生成帧图片的文件名
    frame_filename = os.path.join(output_folder, f'frame_{frame_count:04d}.jpg')

    # 保存帧图片
    cv2.imwrite(frame_filename, frame)

    print(f'Saved {frame_filename}')

    # 计数加1
    frame_count += 1

# 释放视频捕捉对象
cap.release()

print('Video frames have been successfully saved.')

```