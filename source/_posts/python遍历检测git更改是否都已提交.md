---
title: python遍历检测git更改是否都已提交
date: 2024-01-19 09:49:37
tags: [python, git]
categories: [其他]
---
```python
import os
import subprocess

def check_git_status(folder):
    # 执行`git status --porcelain`命令，如果所有的更改都已提交，则输出应为空
    result = subprocess.run(['git', 'status', '--porcelain'], cwd=folder, stdout=subprocess.PIPE)
    return result.stdout.decode().strip()

def walk_and_check(folder):
    for root, dirs, _ in os.walk(folder):
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            # 检查文件夹是否包含.git目录，如果是，则视为Git仓库
            if os.path.exists(os.path.join(dir_path, '.git')):
                status = check_git_status(dir_path)
                if status:
                    print(f'未提交的更改在 {dir_path}:')
                    print(status)

if __name__ == "__main__":
    walk_and_check('E:\WT\gerritCode')
```
