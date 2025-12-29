---
title: Python实用工具脚本汇总
date: 2022-09-23 00:00:00
tags: [python, 工具脚本, 自动化, 实用工具]
categories: 后端开发
updated: 2018-05-24 12:30:00
---

# Python实用工具脚本汇总

在日常开发中，我们经常需要编写一些自动化脚本来提高工作效率。本文汇总了几个实用的Python工具脚本，包括文件解压、Git仓库管理等。

## 1. 递归解压压缩包工具

### 1.1 功能特点

- 支持多种压缩格式：ZIP、TAR、TAR.GZ、TAR.BZ2、GZ
- 递归解压嵌套的压缩包
- 自动生成解压目录
- 支持对特定文件类型（如.log）的特殊处理

### 1.2 完整代码实现

```python
import os
import zipfile
import tarfile
import gzip
import shutil
from pathlib import Path

def ensure_dir_exists(directory):
    """确保目录存在，不存在则创建"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def get_extract_path(file_path):
    """根据压缩包名称生成解压目录路径"""
    extract_dir = os.path.splitext(os.path.basename(file_path))[0]
    extract_to = os.path.join(os.path.dirname(file_path), extract_dir)
    return extract_to

def unzip_file(file_path, extract_to, handle_log=False):
    """
    解压.zip文件到指定目录下
    :param file_path: 压缩文件路径
    :param extract_to: 解压目标目录
    :param handle_log: 是否对.log文件进行特殊处理
    """
    ensure_dir_exists(extract_to)
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        for member in zip_ref.infolist():
            if handle_log and member.filename.endswith('.log'):
                # 将 .log 文件直接复制到目标目录
                log_path = os.path.join(extract_to, member.filename)
                ensure_dir_exists(os.path.dirname(log_path))
                with zip_ref.open(member) as source, open(log_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                print(f'Copied .log file: {member.filename} to {log_path}')
            else:
                zip_ref.extract(member, extract_to)
                print(f'Extracted: {member.filename}')

def untar_file(file_path, extract_to, handle_log=False):
    """
    解压.tar, .tar.gz, .tar.bz2文件到指定目录下
    :param file_path: 压缩文件路径
    :param extract_to: 解压目标目录
    :param handle_log: 是否对.log文件进行特殊处理
    """
    ensure_dir_exists(extract_to)
    mode = 'r'
    if file_path.endswith('.gz'):
        mode = 'r:gz'
    elif file_path.endswith('.bz2'):
        mode = 'r:bz2'

    with tarfile.open(file_path, mode) as tar_ref:
        for member in tar_ref.getmembers():
            if handle_log and member.name.endswith('.log'):
                # 将 .log 文件直接复制到目标目录
                log_path = os.path.join(extract_to, member.name)
                ensure_dir_exists(os.path.dirname(log_path))
                with tar_ref.extractfile(member) as source, open(log_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                print(f'Copied .log file: {member.name} to {log_path}')
            else:
                tar_ref.extract(member, extract_to)
                print(f'Extracted: {member.name}')

def extract_gz_file(file_path, extract_to):
    """
    解压单独的.gz文件
    :param file_path: 压缩文件路径
    :param extract_to: 解压目标目录
    """
    output_name = Path(file_path).stem  # 自动去除.gz后缀
    output_path = os.path.join(extract_to, output_name)

    ensure_dir_exists(extract_to)
    with gzip.open(file_path, 'rb') as f_in:
        with open(output_path, 'wb') as f_out:
            f_out.write(f_in.read())
    print(f"解压GZ文件: {file_path} -> {output_path}")

    return output_path

def extract_nested_archives(archive_path, extract_to=None, processed=None, handle_log=False):
    """
    递归解压嵌套的压缩文件
    :param archive_path: 要解压的压缩文件路径
    :param extract_to: 解压目录
    :param processed: 已处理的文件集合（防止重复处理）
    :param handle_log: 是否对.log文件进行特殊处理
    """
    if processed is None:
        processed = set()

    archive_path = os.path.abspath(archive_path)
    if archive_path in processed:
        return
    processed.add(archive_path)

    if extract_to is None:
        extract_to = os.path.join(
            os.path.dirname(archive_path),
            Path(archive_path).stem + "_extracted"
        )

    ensure_dir_exists(extract_to)

    try:
        # 处理ZIP文件
        if zipfile.is_zipfile(archive_path):
            unzip_file(archive_path, extract_to, handle_log)

        # 处理TAR文件（包括tar.gz/tar.bz2）
        elif tarfile.is_tarfile(archive_path):
            untar_file(archive_path, extract_to, handle_log)

        # 处理单独.gz文件
        elif archive_path.endswith('.gz') and not tarfile.is_tarfile(archive_path):
            output_path = extract_gz_file(archive_path, extract_to)
            # 递归处理新解压的文件
            extract_nested_archives(output_path, processed=processed, handle_log=handle_log)

        else:
            print(f"不支持的文件格式: {archive_path}")
            return

        # 递归处理解压目录中的所有文件
        for root, _, files in os.walk(extract_to):
            for file in files:
                file_path = os.path.join(root, file)
                if (file_path.endswith(('.zip', '.tar', '.tar.gz', '.tar.bz2', '.gz')) and
                    file_path not in processed):
                    extract_nested_archives(file_path, processed=processed, handle_log=handle_log)

    except Exception as e:
        print(f"解压失败: {archive_path} - {str(e)}")

def extract_all_in_archive(file_path, extract_to=None, handle_log=False):
    """
    递归解压压缩包内的所有压缩包
    :param file_path: 压缩包路径
    :param extract_to: 解压目录
    :param handle_log: 是否对.log文件进行特殊处理
    """
    if extract_to is None:
        extract_to = get_extract_path(file_path)

    # 初次解压
    if os.path.isfile(file_path):
        extract_nested_archives(file_path, extract_to, handle_log=handle_log)

if __name__ == "__main__":
    # 交互式使用
    print("=== Python递归解压工具 ===")
    print("功能：支持ZIP、TAR、TAR.GZ、TAR.BZ2、GZ格式的递归解压")

    file_path = input("请输入要解压的文件路径: ").strip().strip('"')

    if not os.path.isfile(file_path):
        print(f"错误：文件不存在 - {file_path}")
    else:
        handle_log = input("是否对.log文件进行特殊处理？(y/n): ").strip().lower() == 'y'

        print("\n开始解压...")
        extract_all_in_archive(file_path, handle_log=handle_log)
        print("解压完成！")

        # 打印解压目录
        extract_dir = get_extract_path(file_path)
        print(f"解压目录: {os.path.abspath(extract_dir)}")
```

### 1.3 使用示例

```python
# 示例1：简单解压
extract_all_in_archive(r'C:\Users\example\archive.zip')

# 示例2：解压并处理.log文件
extract_all_in_archive(r'C:\Users\example\archive.zip', handle_log=True)

# 示例3：指定解压目录
extract_nested_archives(
    r'C:\Users\example\archive.zip',
    extract_to=r'C:\Users\example\output'
)
```

### 1.4 支持的格式

| 格式 | 说明 | 示例 |
|------|------|------|
| ZIP | 常用压缩格式 | archive.zip |
| TAR | Linux常用格式 | archive.tar |
| TAR.GZ | Gzip压缩的TAR | archive.tar.gz |
| TAR.BZ2 | Bzip2压缩的TAR | archive.tar.bz2 |
| GZ | 单个Gzip压缩文件 | file.txt.gz |

## 2. Git仓库状态检查工具

### 2.1 功能特点

- 遍历指定目录下的所有Git仓库
- 检查每个仓库是否有未提交的更改
- 批量检查多个项目的工作状态

### 2.2 完整代码实现

```python
import os
import subprocess
from pathlib import Path

def check_git_status(folder):
    """
    检查Git仓库的状态
    :param folder: Git仓库路径
    :return: 未提交的更改信息
    """
    try:
        # 执行`git status --porcelain`命令
        # 如果所有的更改都已提交，则输出应为空
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            cwd=folder,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except Exception as e:
        return f"Error: {str(e)}"

def get_git_branch(folder):
    """
    获取当前Git分支
    :param folder: Git仓库路径
    :return: 当前分支名
    """
    try:
        result = subprocess.run(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            cwd=folder,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except:
        return "unknown"

def get_git_remote_url(folder):
    """
    获取Git远程仓库URL
    :param folder: Git仓库路径
    :return: 远程仓库URL
    """
    try:
        result = subprocess.run(
            ['git', 'config', '--get', 'remote.origin.url'],
            cwd=folder,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except:
        return "unknown"

def walk_and_check(folder, show_clean=False):
    """
    遍历目录并检查所有Git仓库的状态
    :param folder: 要遍历的根目录
    :param show_clean: 是否显示已提交的仓库
    """
    print(f"\n开始扫描目录: {folder}")
    print("=" * 80)

    repo_count = 0
    uncommitted_count = 0

    for root, dirs, _ in os.walk(folder):
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)

            # 检查文件夹是否包含.git目录
            if os.path.exists(os.path.join(dir_path, '.git')):
                repo_count += 1
                status = check_git_status(dir_path)
                branch = get_git_branch(dir_path)

                if status:
                    # 有未提交的更改
                    uncommitted_count += 1
                    print(f"\n❌ 未提交的更改: {dir_path}")
                    print(f"   分支: {branch}")

                    # 格式化输出更改内容
                    for line in status.split('\n'):
                        if line:
                            status_code = line[:2]
                            file_path = line[3:]
                            status_symbol = {
                                'M': '修改',
                                'A': '新增',
                                'D': '删除',
                                'R': '重命名',
                                'C': '复制',
                                '??': '未跟踪'
                            }
                            print(f"   [{status_code}] {status_symbol.get(status_code, '未知')}: {file_path}")

                elif show_clean:
                    # 所有更改都已提交
                    remote_url = get_git_remote_url(dir_path)
                    print(f"\n✅ 已提交: {dir_path}")
                    print(f"   分支: {branch}")
                    print(f"   远程: {remote_url}")

    print("\n" + "=" * 80)
    print(f"扫描完成！")
    print(f"总共找到 {repo_count} 个Git仓库")
    print(f"其中 {uncommitted_count} 个仓库有未提交的更改")

if __name__ == "__main__":
    print("=== Git仓库状态批量检查工具 ===\n")

    # 默认目录
    default_folder = r'E:\Projects'

    # 获取用户输入
    folder = input(f"请输入要扫描的目录 (默认: {default_folder}): ").strip()

    if not folder:
        folder = default_folder

    if not os.path.exists(folder):
        print(f"错误：目录不存在 - {folder}")
    else:
        show_clean = input("是否显示已提交的仓库？(y/n): ").strip().lower() == 'y'
        walk_and_check(folder, show_clean=show_clean)
```

### 2.3 使用示例

```python
# 示例1：检查指定目录
walk_and_check('E:\\Projects')

# 示例2：检查并显示已提交的仓库
walk_and_check('E:\\Projects', show_clean=True)

# 示例3：检查单个仓库
status = check_git_status('E:\\Projects\\my-project')
if status:
    print("有未提交的更改")
else:
    print("所有更改已提交")
```

### 2.4 输出示例

```
开始扫描目录: E:\Projects
================================================================================

❌ 未提交的更改: E:\Projects\project-a
   分支: feature/new-feature
   [ M ] 修改: src/main.py
   [A ] 新增: src/utils.py
   [??] 未跟踪: config.ini

❌ 未提交的更改: E:\Projects\project-b
   分支: main
   [ D ] 删除: old_file.py

================================================================================
扫描完成！
总共找到 15 个Git仓库
其中 2 个仓库有未提交的更改
```

## 3. 批量重命名工具

### 3.1 功能特点

- 批量重命名文件
- 支持正则表达式匹配
- 支持递归处理子目录

### 3.2 代码实现

```python
import os
import re
from pathlib import Path

def batch_rename_files(directory, pattern, replacement, recursive=False, dry_run=True):
    """
    批量重命名文件
    :param directory: 目录路径
    :param pattern: 正则表达式模式
    :param replacement: 替换字符串
    :param recursive: 是否递归处理子目录
    :param dry_run: 是否为试运行（不实际重命名）
    """
    count = 0

    if recursive:
        # 递归遍历
        for root, _, files in os.walk(directory):
            for filename in files:
                if re.search(pattern, filename):
                    old_path = os.path.join(root, filename)
                    new_filename = re.sub(pattern, replacement, filename)
                    new_path = os.path.join(root, new_filename)

                    if dry_run:
                        print(f"[试运行] {filename} -> {new_filename}")
                    else:
                        os.rename(old_path, new_path)
                        print(f"[重命名] {filename} -> {new_filename}")
                    count += 1
    else:
        # 只处理当前目录
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            if os.path.isfile(file_path) and re.search(pattern, filename):
                new_filename = re.sub(pattern, replacement, filename)
                new_path = os.path.join(directory, new_filename)

                if dry_run:
                    print(f"[试运行] {filename} -> {new_filename}")
                else:
                    os.rename(file_path, new_path)
                    print(f"[重命名] {filename} -> {new_filename}")
                count += 1

    if dry_run:
        print(f"\n试运行完成：将重命名 {count} 个文件")
        confirm = input("确认执行重命名？(y/n): ").strip().lower()
        if confirm == 'y':
            batch_rename_files(directory, pattern, replacement, recursive, dry_run=False)
    else:
        print(f"\n重命名完成：共处理 {count} 个文件")

# 使用示例
if __name__ == "__main__":
    # 示例：将所有空格替换为下划线
    batch_rename_files(
        directory='./files',
        pattern=r'\s+',
        replacement='_',
        recursive=True,
        dry_run=True
    )
```

## 4. 文件去重工具

### 4.1 功能特点

- 根据文件内容（MD5）检测重复文件
- 支持按文件大小筛选
- 生成重复文件报告

### 4.2 代码实现

```python
import os
import hashlib
from collections import defaultdict

def calculate_md5(filepath):
    """计算文件的MD5值"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def find_duplicates(directory, min_size=0):
    """
    查找重复文件
    :param directory: 要扫描的目录
    :param min_size: 最小文件大小（字节）
    :return: 重复文件字典 {md5: [file_list]}
    """
    files_by_md5 = defaultdict(list)

    for root, _, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            filesize = os.path.getsize(filepath)

            # 跳过小于指定大小的文件
            if filesize < min_size:
                continue

            try:
                file_md5 = calculate_md5(filepath)
                files_by_md5[file_md5].append(filepath)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

    # 只返回有重复的文件
    duplicates = {
        md5: files for md5, files in files_by_md5.items() if len(files) > 1
    }

    return duplicates

if __name__ == "__main__":
    directory = input("请输入要扫描的目录: ").strip()
    min_size = int(input("请输入最小文件大小（字节，0=不限制）: ") or "0")

    print(f"\n正在扫描 {directory}...")
    duplicates = find_duplicates(directory, min_size)

    if not duplicates:
        print("未发现重复文件")
    else:
        total_duplicates = sum(len(files) - 1 for files in duplicates.values())
        print(f"\n发现 {len(duplicates)} 组重复文件，共 {total_duplicates} 个重复：\n")

        for md5, files in duplicates.items():
            print(f"MD5: {md5}")
            for file in files:
                size = os.path.getsize(file)
                print(f"  - {file} ({size} bytes)")
            print()
```

## 5. 总结

本文汇总了4个实用的Python工具脚本：

1. **递归解压工具** - 处理各种格式的压缩包
2. **Git状态检查工具** - 批量检查多个仓库的状态
3. **批量重命名工具** - 批量重命名文件
4. **文件去重工具** - 查找重复文件

这些脚本可以直接使用，也可以根据实际需求进行修改。Python的强大之处在于能够快速实现各种自动化任务，大大提高工作效率。
