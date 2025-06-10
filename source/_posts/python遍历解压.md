---
title: python遍历解压
date: 2025-06-10 15:27:21
tags: [python]
---
```python
import os
import zipfile
import tarfile
import gzip
from pathlib import Path

def extract_nested_archives(archive_path, extract_to=None, processed=None):
    """
    递归解压嵌套的压缩文件（新增对单独.gz文件的支持）
    :param archive_path: 要解压的压缩文件路径
    :param extract_to: 解压目录（默认为文件所在目录/文件名_extracted）
    :param processed: 已处理的文件集合（防止重复处理）
    """
    if processed is None:
        processed = set()

    archive_path = os.path.abspath(archive_path)
    if archive_path in processed:
        return
    processed.add(archive_path)

    if extract_to is None:
        extract_to = os.path.join(os.path.dirname(archive_path),
                                Path(archive_path).stem + "_extracted")

    os.makedirs(extract_to, exist_ok=True)

    try:
        # 处理ZIP文件
        if zipfile.is_zipfile(archive_path):
            with zipfile.ZipFile(archive_path, 'r') as zip_ref:
                zip_ref.extractall(extract_to)
                print(f"解压ZIP文件: {archive_path} -> {extract_to}")

        # 处理TAR文件（包括tar.gz/tar.bz2）
        elif tarfile.is_tarfile(archive_path):
            mode = 'r'
            if archive_path.endswith('.tar.gz'):
                mode = 'r:gz'
            elif archive_path.endswith('.tar.bz2'):
                mode = 'r:bz2'

            with tarfile.open(archive_path, mode) as tar_ref:
                tar_ref.extractall(extract_to)
                print(f"解压TAR文件: {archive_path} -> {extract_to}")

        # 新增：处理单独.gz文件
        elif archive_path.endswith('.gz') and not tarfile.is_tarfile(archive_path):
            output_name = Path(archive_path).stem  # 自动去除.gz后缀
            output_path = os.path.join(extract_to, output_name)

            with gzip.open(archive_path, 'rb') as f_in:
                with open(output_path, 'wb') as f_out:
                    f_out.write(f_in.read())
            print(f"解压GZ文件: {archive_path} -> {output_path}")

            # 递归处理新解压的文件
            extract_nested_archives(output_path, processed=processed)

        else:
            print(f"不支持的文件格式: {archive_path}")
            return

        # 递归处理解压目录中的所有文件
        for root, _, files in os.walk(extract_to):
            for file in files:
                file_path = os.path.join(root, file)
                extract_nested_archives(file_path, processed=processed)

    except Exception as e:
        print(f"解压失败: {archive_path} - {str(e)}")

if __name__ == "__main__":
    start_archive = input("请输入要解压的初始压缩文件路径: ").strip()
    if os.path.isfile(start_archive):
        extract_nested_archives(start_archive)
        print("解压完成！")
    else:
        print("文件不存在！")
```