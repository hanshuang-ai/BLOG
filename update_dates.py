#!/usr/bin/env python3
import os
import re
import random
from datetime import datetime, timedelta

# Claude Code 相关文章（2025年10月之后）
claude_code_articles = [
    "Claude-Code-Agent-SDK-接入自研插件.md",
    "Claude-Code-Router完全分析.md",
    "claude-code-Task提示词.md",
    "claude-code-TodoRead提示词.md",
    "claude-code-TodoWrite提示词.md",
    "claude-codeLLM视角-实际接收指令的感觉.md",
    "claude-code工具与执行引擎.md",
    "claude-code基础架构.md",
    "claude-code架构-引擎室.md",
    "claude-code解析.md",
    "claude-code控制流与编排引擎.md",
    "claude-code内置工具Read核心代码.md",
    "claude-code数据结构与消息架构.md",
    "claude-code提示词工程-指导AI的艺术.md",
    "claude-code文件编辑-AI辅助的代码修改.md",
    "claude-code系统提示词.md",
    "claude-code新颖的组件.md",
]

# 大模型相关文章（2024年）
ai_articles = [
    "大模型的泛化能力.md",
    "大模型合集.md",
    "大模型是如何分析数据的.md",
    "大模型微调需要注意的事项.md",
    "大模型训练与优化完全指南.md",
    "嵌入模型.md",
    "向量数据库.md",
    "损失函数.md",
    "线性激活函数.md",
    "计算机中的向量.md",
]

def generate_random_date(start_date, end_date):
    """生成指定范围内的随机日期"""
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randrange(days_between)
    return start_date + timedelta(days=random_days)

def update_date_in_file(filepath, new_date):
    """更新文件中的日期"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 格式化日期为 YYYY-MM-DD HH:mm:ss
    date_str = new_date.strftime('%Y-%m-%d %H:%M:%S')

    # 尝试匹配并替换 date 字段
    patterns = [
        r'date:\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}',
        r'date:\s*\d{4}-\d{2}-\d{2}',
        r'date:\s*(.+)',  # 任何格式的 date
    ]

    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            content = re.sub(pattern, f'date: {date_str}', content, count=1)
            break

    # 如果没有找到 date 字段，在 title 后添加
    if 'date:' not in content:
        # 找到 title 字段并在其后插入 date
        content = re.sub(
            r'(title:\s*.+)',
            rf'\1\ndate: {date_str}',
            content,
            count=1
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return date_str

def main():
    posts_dir = 'source/_posts'

    # 遍历所有文章
    for filename in os.listdir(posts_dir):
        if not filename.endswith('.md'):
            continue

        filepath = os.path.join(posts_dir, filename)
        new_date = None
        category = ''

        # 判断文章类别并生成相应日期
        if filename in claude_code_articles:
            # Claude Code: 2025年10月22日到12月29日
            start_date = datetime(2025, 10, 22)
            end_date = datetime(2025, 12, 29)
            new_date = generate_random_date(start_date, end_date)
            category = 'Claude Code'

        elif filename in ai_articles:
            # 大模型: 2024年全年
            start_date = datetime(2024, 1, 1)
            end_date = datetime(2024, 12, 31)
            new_date = generate_random_date(start_date, end_date)
            category = '大模型'

        else:
            # 其他: 2022年1月1日到2023年12月31日
            start_date = datetime(2022, 1, 1)
            end_date = datetime(2023, 12, 31)
            new_date = generate_random_date(start_date, end_date)
            category = '其他'

        # 更新文件日期
        date_str = update_date_in_file(filepath, new_date)
        print(f"[{category}] {filename}: {date_str}")

    print("\n✅ 所有文章日期已更新完成！")

if __name__ == '__main__':
    main()
