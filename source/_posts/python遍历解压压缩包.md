---
title: python遍历解压压缩包
date: 2024-09-03 11:06:25
tags: [python]
---
```python
import os
import zipfile
import tarfile
import shutil

def ensure_dir_exists(directory):
    """确保目录存在，不存在则创建"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def get_extract_path(file_path):
    """根据压缩包名称生成解压目录路径"""
    extract_dir = os.path.splitext(os.path.basename(file_path))[0]  # 获取压缩包的名字，不带后缀
    extract_to = os.path.join(os.path.dirname(file_path), extract_dir)  # 与压缩包同级目录
    return extract_to

def unzip_file(file_path, extract_to):
    """解压.zip文件到指定目录下"""
    ensure_dir_exists(extract_to)
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        for member in zip_ref.infolist():
            if member.filename.endswith('.log'):
                # 将 .log 文件直接复制到目标目录，而不解压
                log_path = os.path.join(extract_to, member.filename)
                ensure_dir_exists(os.path.dirname(log_path))
                with zip_ref.open(member) as source, open(log_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                print(f'Copied .log file: {member.filename} to {log_path}')
            else:
                zip_ref.extract(member, extract_to)
                print(f'Extracted: {member.filename}')

def untar_file(file_path, extract_to):
    """解压.tar, .tar.gz, .tar.bz2文件到指定目录下"""
    ensure_dir_exists(extract_to)
    mode = 'r'
    if file_path.endswith('.gz'):
        mode = 'r:gz'
    elif file_path.endswith('.bz2'):
        mode = 'r:bz2'

    with tarfile.open(file_path, mode) as tar_ref:
        for member in tar_ref.getmembers():
            if member.name.endswith('.log'):
                # 将 .log 文件直接复制到目标目录，而不解压
                log_path = os.path.join(extract_to, member.name)
                ensure_dir_exists(os.path.dirname(log_path))
                with tar_ref.extractfile(member) as source, open(log_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                print(f'Copied .log file: {member.name} to {log_path}')
            else:
                tar_ref.extract(member, extract_to)
                print(f'Extracted: {member.name}')

def extract_file(file_path, extract_to):
    """根据文件类型选择解压方式"""
    if file_path.endswith('.zip'):
        unzip_file(file_path, extract_to)
    elif file_path.endswith(('.tar', '.tar.gz', '.tar.bz2', '.gz')):
        untar_file(file_path, extract_to)

def extract_all_in_archive(file_path, extract_to):
    """递归解压压缩包内的压缩包"""
    # 初次解压到与压缩包同名的目录
    extract_dir = get_extract_path(file_path)
    extract_all_in_directory(file_path, extract_dir)

    # 再次递归解压
    for root, dirs, files in os.walk(extract_dir):
        for file in files:
            nested_file_path = os.path.join(root, file)
            if nested_file_path.endswith(('.zip', '.tar', '.tar.gz', '.tar.bz2', '.gz')):
                nested_extract_dir = os.path.splitext(nested_file_path)[0]  # 用文件名生成解压目录
                extract_file(nested_file_path, nested_extract_dir)  # 解压嵌套压缩包
                extract_all_in_archive(nested_file_path, nested_extract_dir)  # 递归解压

def extract_all_in_directory(file_path, extract_to):
    """如果传入的是压缩包，则开始解压"""
    if os.path.isfile(file_path):
        extract_file(file_path, extract_to)

# 示例用法，传入压缩包路径
extract_all_in_archive(r'C:\Users\WTCL\Desktop\解压缩\a.zip', None)

```
