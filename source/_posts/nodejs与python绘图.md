---
title: nodejs与python绘图
categories: 后端开发
date: 2025-08-01 17:52:22
tags: [nodejs, python, 绘图, canvas, 图表]
---
```python
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os
import glob
import time
import re

def hex_to_rgb(hex_color):
    """将16进制颜色字符串转换为RGB元组

    Args:
        hex_color: 16进制颜色字符串，格式为 "#RRGGBB" 或 "RRGGBB"

    Returns:
        tuple: RGB颜色元组 (R, G, B)

    Raises:
        ValueError: 如果颜色格式不正确
    """
    if hex_color is None:
        return None

    # 移除可能的 # 前缀
    hex_color = hex_color.lstrip('#')

    # 验证格式
    if not re.match(r'^[0-9A-Fa-f]{6}$', hex_color):
        raise ValueError(f"无效的16进制颜色格式: {hex_color}，应为6位16进制数")

    # 转换为RGB
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)

    return (r, g, b)

def arrange_icons_layout_1(canvas, icon_folder='icon', start_y=1000):
    """布局1：左右两组，各6个图标"""
    step_start_time = time.time()

    try:
        # 获取所有图标文件
        icon_files = glob.glob(os.path.join(icon_folder, '*.png'))
        if not icon_files:
            print("没有找到图标文件")
            return

        print(f"[信息] 找到 {len(icon_files)} 个图标文件")

        # 加载指定的12个图标
        icons = []
        load_start_time = time.time()

        # 定义指定的图标文件名
        specified_icons = [
            "com_autopai_smart_sound_effect.png",
            "com_incall_apps_personalcenter.png",
            "com_wt_carcamera.png",
            "com_wt_airconditioner.png",
            "com_wt_vehiclecenter.png",
            "com_autopai_car_dialer.png",
            "com_tinnove_mediacenter.png",
            "com_tinnove_scenemode.png",
            "com_tinnove_scenemode.png",
            "com_wtcl_electronicdirections.png",
            "com_wt_scene.png",
            "com_tinnove_gamezone.png",
        ]

        # 定义应用名称映射
        app_names = [
            "音效", "个人中心", "空调", "车辆中心", "电话", "AI空间",
            "情景模式", "导航", "场景", "游戏", "空调2", "AI空间2"
        ]

        # 查找指定的图标文件
        found_icons = []
        for icon_name in specified_icons:
            icon_path = os.path.join(icon_folder, icon_name)
            if os.path.exists(icon_path):
                found_icons.append(icon_path)
            else:
                print(f"[失败] 错误: 找不到图标文件 {icon_name}")
                return

        # 如果指定的图标不够12个，用其他图标补充
        if len(found_icons) < 12:
            remaining_icons = [f for f in icon_files if f not in found_icons]
            found_icons.extend(remaining_icons[:12-len(found_icons)])
            print(f"[警告] 指定的图标不足12个，补充了 {12-len(found_icons)} 个其他图标")

        # 获取画布尺寸用于计算图标大小
        canvas_width, canvas_height = canvas.size
        icon_width = int(canvas_width * 3.9 / 100)  # 3.9%的宽度
        icon_height = int(canvas_height * 8.33 / 100)  # 8.33%的高度

        for i, icon_file in enumerate(found_icons[:12]):
            try:
                icon = Image.open(icon_file)
                # 调整图标大小为相对尺寸
                icon = icon.resize((icon_width, icon_height), Image.Resampling.LANCZOS)
                # 使用预定义的应用名称
                app_name = app_names[i] if i < len(app_names) else f"应用{i+1}"
                icons.append((icon, app_name))
            except Exception as e:
                print(f"[警告] 加载图标失败 {icon_file}: {e}")

        load_time = (time.time() - load_start_time) * 1000
        print(f"[成功] 图标加载完成 (耗时: {load_time:.2f}ms)")

        if not icons:
            print("没有成功加载任何图标")
            return

        # # 尝试加载中文字体，如果失败则使用默认字体
        # font_start_time = time.time()
        # try:
        #     font = ImageFont.truetype("simhei.ttf", 24)  # 黑体，24号字
        #     print("[成功] 使用中文字体: simhei.ttf")
        # except:
        #     try:
        #         font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 24)
        #         print("[成功] 使用中文字体: C:/Windows/Fonts/simhei.ttf")
        #     except:
        #         font = ImageFont.load_default()
        #         print("[警告] 使用默认字体")

        # font_time = (time.time() - font_start_time) * 1000
        # print(f"[成功] 字体加载完成 (耗时: {font_time:.2f}ms)")

        # # 创建绘图对象
        # draw = ImageDraw.Draw(canvas)

        # 获取画布尺寸
        canvas_width, canvas_height = canvas.size

        # 布局参数（使用百分比）
        icon_width_percent = 3.9  # 图标宽度占画布宽度的3.9%
        icon_height_percent = 8.33  # 图标高度占画布高度的8.33%
        icon_spacing_percent = 3.125  # 图标间距占画布宽度的3.125%
        left_group_start_percent = 5.47  # 左侧组起始位置占画布宽度的5.47%
        group_spacing_percent = 10.84  # 两组之间的间距占画布宽度的10.74%

        # 计算实际像素值
        icon_width = int(canvas_width * icon_width_percent / 100)
        icon_height = int(canvas_height * icon_height_percent / 100)
        icon_spacing = int(canvas_width * icon_spacing_percent / 100)
        left_group_start = int(canvas_width * left_group_start_percent / 100)
        group_spacing = int(canvas_width * group_spacing_percent / 100)

        # 计算右侧组起始位置
        right_group_start = left_group_start + 6 * (icon_width + icon_spacing) - icon_spacing + group_spacing

        print(f"画布尺寸: {canvas_width}x{canvas_height}")
        print(f"图标尺寸: {icon_width}x{icon_height} (宽度{icon_width_percent}%, 高度{icon_height_percent}%)")
        print(f"图标间距: {icon_spacing}px ({icon_spacing_percent}%)")
        print(f"左侧组起始位置: x={left_group_start} ({left_group_start_percent}%)")
        print(f"右侧组起始位置: x={right_group_start}")
        print(f"组间距: {group_spacing}px ({group_spacing_percent}%)")

        # 放置图标
        placement_start_time = time.time()
        for i, (icon, app_name) in enumerate(icons):
            if i < 6:
                # 左侧组
                icon_x = left_group_start + i * (icon_width + icon_spacing)
                icon_y = start_y
                group_name = "左侧组"
            else:
                # 右侧组
                icon_x = right_group_start + (i - 6) * (icon_width + icon_spacing)
                icon_y = start_y
                group_name = "右侧组"

            # 放置图标
            canvas.paste(icon, (icon_x, icon_y), icon if icon.mode == 'RGBA' else None)

        placement_time = (time.time() - placement_start_time) * 1000
        print(f"[成功] 图标放置完成 (耗时: {placement_time:.2f}ms)")
        print(f"[成功] 成功放置 {len(icons)} 个图标（左右两组各6个）")

        total_step_time = (time.time() - step_start_time) * 1000
        print(f"[成功] 图标排列总耗时: {total_step_time:.2f}ms")

    except Exception as e:
        print(f"排列图标时出错: {e}")

def arrange_icons_layout_2(canvas, icon_folder='icon', start_y=1000):
    """布局2：左侧3行18个图标，右侧1行6个图标"""
    step_start_time = time.time()

    try:
        # 获取所有图标文件
        icon_files = glob.glob(os.path.join(icon_folder, '*.png'))
        if not icon_files:
            print("没有找到图标文件")
            return

        print(f"[信息] 找到 {len(icon_files)} 个图标文件")

        # 加载指定的24个图标
        icons = []
        load_start_time = time.time()

        # 定义指定的图标文件名 (左侧15个 + 右侧6个 = 21个)
        specified_icons = [
            # 左侧第一行 (6个)
            "com_tinnove_mediacenter.png",
            "com_autopai_car_dialer.png",
            "com_wt_vehiclecenter.png",
            "com_wt_maintenance.png",
            "com_tinnove_aispace.png",
            "com_tinnove_carshow.png",
            # 左侧第二行 (6个)
            "com_wt_airconditioner.png",
            "com_autopai_album.png",
            "com_incall_apps_personalcenter.png",
            "com_wtcl_filemanager.png",
            "com_incall_dvr.png",
            "com_wtcl_electronicdirections.png",
            # 左侧第三行 (3个)
            "com_wt_gamecenter.png",
            "com_wt_carcamera.png",
            "com_autopai_smart_sound_effect.png",
            # 右侧一行 (6个)
            "com_tinnove_aispace.png",
            "com_tinnove_scenemode.png",
            "com_tinnove_link_client.png",
            "com_wtcl_electronicdirections.png",
            "com_wt_scene.png",
            "com_tinnove_gamezone.png",
        ]

        # 定义应用名称映射
        app_names = [
            # 左侧第一行
            "音效", "个人中心", "空调", "车辆中心", "电话", "AI空间",
            # 左侧第二行
            "场景", "导航", "情景", "游戏", "相册", "应用市场",
            # 左侧第三行
            "健康", "记录仪", "AI语音",
            # 右侧一行
            "云摄像头", "客服", "连接", "媒体", "导航", "微信"
        ]

        # 查找指定的图标文件
        found_icons = []
        for icon_name in specified_icons:
            icon_path = os.path.join(icon_folder, icon_name)
            if os.path.exists(icon_path):
                found_icons.append(icon_path)
            else:
                print(f"[失败] 错误: 找不到图标文件 {icon_name}")
                return

        # 如果指定的图标不够21个，用其他图标补充
        if len(found_icons) < 21:
            remaining_icons = [f for f in icon_files if f not in found_icons]
            found_icons.extend(remaining_icons[:21-len(found_icons)])
            print(f"[警告] 指定的图标不足21个，补充了 {21-len(found_icons)} 个其他图标")

        # 获取画布尺寸用于计算图标大小
        canvas_width, canvas_height = canvas.size
        icon_width = int(canvas_width * 3.9 / 100)  # 3.9%的宽度
        icon_height = int(canvas_height * 8.33 / 100)  # 8.33%的高度

        for i, icon_file in enumerate(found_icons[:21]):
            try:
                icon = Image.open(icon_file)
                # 调整图标大小为相对尺寸
                icon = icon.resize((icon_width, icon_height), Image.Resampling.LANCZOS)
                # 使用预定义的应用名称
                app_name = app_names[i] if i < len(app_names) else f"应用{i+1}"
                icons.append((icon, app_name))
            except Exception as e:
                print(f"[警告] 加载图标失败 {icon_file}: {e}")

        load_time = (time.time() - load_start_time) * 1000
        print(f"[成功] 图标加载完成 (耗时: {load_time:.2f}ms)")

        if not icons:
            print("没有成功加载任何图标")
            return

        # 尝试加载中文字体，如果失败则使用默认字体
        # font_start_time = time.time()
        # try:
        #     font = ImageFont.truetype("simhei.ttf", 24)  # 黑体，24号字
        #     print("[成功] 使用中文字体: simhei.ttf")
        # except:
        #     try:
        #         font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 24)
        #         print("[成功] 使用中文字体: C:/Windows/Fonts/simhei.ttf")
        #     except:
        #         font = ImageFont.load_default()
        #         print("[警告] 使用默认字体")

        # font_time = (time.time() - font_start_time) * 1000
        # print(f"[成功] 字体加载完成 (耗时: {font_time:.2f}ms)")

        # # 创建绘图对象
        # draw = ImageDraw.Draw(canvas)

        # 获取画布尺寸
        canvas_width, canvas_height = canvas.size

        # 布局参数（使用百分比）
        icon_width_percent = 3.9  # 图标宽度占画布宽度的3.9%
        icon_height_percent = 8.33  # 图标高度占画布高度的8.33%
        icon_spacing_percent = 3.125  # 图标间距占画布宽度的3.125%
        row_spacing_percent = 15.28  # 行间距占画布高度的15.28%
        left_group_start_percent = 5.47  # 左侧组起始位置占画布宽度的5.47%
        left_group_top_percent = 27.78  # 左侧组顶部位置占画布高度的27.78%
        right_group_top_percent = 45.14  # 右侧组顶部位置占画布高度的45.14%
        group_spacing_percent = 11.24  # 两组之间的间距占画布宽度的11.24%

        # 计算实际像素值
        icon_width = int(canvas_width * icon_width_percent / 100)
        icon_height = int(canvas_height * icon_height_percent / 100)
        icon_spacing = int(canvas_width * icon_spacing_percent / 100)
        row_spacing = int(canvas_height * row_spacing_percent / 100)
        left_group_start = int(canvas_width * left_group_start_percent / 100)
        left_group_top = int(canvas_height * left_group_top_percent / 100)
        right_group_top = int(canvas_height * right_group_top_percent / 100)
        group_spacing = int(canvas_width * group_spacing_percent / 100)

        # 计算右侧组起始位置
        right_group_start = left_group_start + 6 * (icon_width + icon_spacing) - icon_spacing + group_spacing

        print(f"画布尺寸: {canvas_width}x{canvas_height}")
        print(f"图标尺寸: {icon_width}x{icon_height} (宽度{icon_width_percent}%, 高度{icon_height_percent}%)")
        print(f"图标间距: {icon_spacing}px ({icon_spacing_percent}%)")
        print(f"行间距: {row_spacing}px ({row_spacing_percent}%)")
        print(f"左侧组起始位置: x={left_group_start} ({left_group_start_percent}%), y={left_group_top} ({left_group_top_percent}%)")
        print(f"右侧组起始位置: x={right_group_start}, y={right_group_top} ({right_group_top_percent}%)")
        print(f"组间距: {group_spacing}px ({group_spacing_percent}%)")

        # 放置图标
        placement_start_time = time.time()
        for i, (icon, app_name) in enumerate(icons):
            if i < 15:
                # 左侧组：3行（前两行6列，第三行3列）
                if i < 12:
                    # 前两行：6列
                    row = i // 6  # 计算行号 (0, 1)
                    col = i % 6   # 计算列号 (0-5)
                else:
                    # 第三行：3列
                    row = 2
                    col = i - 12  # 计算列号 (0-2)
                icon_x = left_group_start + col * (icon_width + icon_spacing)
                icon_y = left_group_top + row * (icon_height + row_spacing)
                group_name = f"左侧组第{row+1}行"
            else:
                # 右侧组：1行6列
                icon_x = right_group_start + (i - 15) * (icon_width + icon_spacing)
                icon_y = right_group_top
                group_name = "右侧组"

            # 放置图标
            canvas.paste(icon, (icon_x, icon_y), icon if icon.mode == 'RGBA' else None)

        placement_time = (time.time() - placement_start_time) * 1000
        print(f"[成功] 图标放置完成 (耗时: {placement_time:.2f}ms)")
        print(f"[成功] 成功放置 {len(icons)} 个图标（左侧3行15个，右侧1行6个）")

        total_step_time = (time.time() - step_start_time) * 1000
        print(f"[成功] 图标排列总耗时: {total_step_time:.2f}ms")

    except Exception as e:
        print(f"排列图标时出错: {e}")

def create_layered_image(layout_type=1, canvas_size=(2560, 720), black_layer_color=None):
    """创建分层图片：背景+黑色图层+背景图层+图标

    Args:
        layout_type: 布局类型 (1 或 2)
        canvas_size: 画布尺寸 (宽度, 高度)
        black_layer_color: 黑色图层转换颜色，格式为16进制字符串 "#RRGGBB" 或 None
                          None表示不转换颜色，保持原样
    """
    total_start_time = time.time()

    try:
        # 创建画布
        canvas_width, canvas_height = canvas_size
        canvas = Image.new('RGBA', (canvas_width, canvas_height), (0, 0, 0, 0))
        print(f"创建画布: {canvas_width}x{canvas_height}")

        # 根据布局类型选择不同的图片文件
        if layout_type == 1:
            bg_file = 'bg.png'
            black_file = 'black.png'
        else:
            bg_file = 'bg2.png'
            black_file = 'black2.png'

        # 第一层：背景图片
        step_start_time = time.time()
        try:
            background_img = Image.open('wallpaper_1.png')
            background_img = background_img.resize((canvas_width, canvas_height), Image.Resampling.LANCZOS)
            canvas.paste(background_img, (0, 0))
            step_time = (time.time() - step_start_time) * 1000
            print(f"[成功] 背景图片 wallpaper_1.png 已加载并调整大小 (耗时: {step_time:.2f}ms)")
        except Exception as e:
            print(f"背景图片加载失败: {e}")
            # 使用默认灰色背景
            canvas.paste((128, 128, 128), (0, 0, canvas_width, canvas_height))
            print("使用默认灰色背景")

        # 第二层：黑色图层
        step_start_time = time.time()
        try:
            black_img = Image.open(black_file)
            black_img = black_img.resize((canvas_width, canvas_height), Image.Resampling.LANCZOS)

            # 记录开始时间
            start_time = time.time()

                        # 根据参数决定是否转换颜色
            if black_layer_color is not None:
                try:
                    # 将16进制颜色转换为RGB
                    rgb_color = hex_to_rgb(black_layer_color)
                    if rgb_color is None:
                        raise ValueError("颜色值不能为空")

                    # 转换颜色
                    black_array = np.array(black_img)
                    # 设置指定的RGB颜色
                    black_array[:, :, :3] = rgb_color
                    processed_img = Image.fromarray(black_array)

                    # 记录耗时
                    end_time = time.time()
                    processing_time = (end_time - start_time) * 1000  # 转换为毫秒
                    print(f"[成功] 黑色图层已转换为颜色 {black_layer_color} (RGB: {rgb_color})，耗时: {processing_time:.2f}ms")
                except ValueError as e:
                    print(f"[错误] 颜色格式错误: {e}")
                    # 如果颜色格式错误，保持原样
                    processed_img = black_img
                    print(f"[警告] 黑色图层保持原样")
            else:
                # 不转换颜色，保持原样
                processed_img = black_img
                print(f"[成功] 黑色图层保持原样，未进行颜色转换")

            canvas.paste(processed_img, (0, 0), processed_img if processed_img.mode == 'RGBA' else None)
            step_time = (time.time() - step_start_time) * 1000
            print(f"[成功] 黑色图层已加载并调整大小 (总耗时: {step_time:.2f}ms)")
        except Exception as e:
            print(f"加载黑色图层失败: {e}")

        # 第三层：加载背景图层
        step_start_time = time.time()
        try:
            bgbg_img = Image.open(bg_file)
            bgbg_img = bgbg_img.resize((canvas_width, canvas_height), Image.Resampling.LANCZOS)
            canvas.paste(bgbg_img, (0, 0), bgbg_img if bgbg_img.mode == 'RGBA' else None)
            step_time = (time.time() - step_start_time) * 1000
            print(f"[成功] 背景图层 {bg_file} 已加载并调整大小 (耗时: {step_time:.2f}ms)")
        except Exception as e:
            print(f"背景图层加载失败: {e}")

        # 第四层：排列图标
        step_start_time = time.time()
        # 计算图标起始Y位置（相对于画布高度的百分比）
        start_y_percent = 45.14  # 图标起始位置占画布高度的45.14%
        start_y = int(canvas_height * start_y_percent / 100)

        if layout_type == 1:
            arrange_icons_layout_1(canvas, icon_folder='icon', start_y=start_y)
        else:
            arrange_icons_layout_2(canvas, icon_folder='icon', start_y=start_y)

        step_time = (time.time() - step_start_time) * 1000
        print(f"[成功] 图标排列完成 (耗时: {step_time:.2f}ms)")

        # 保存图片
        step_start_time = time.time()
        try:
            output_filename = f'preview{layout_type}.png'
            canvas.save(output_filename)
            step_time = (time.time() - step_start_time) * 1000
            print(f"[成功] 图片已保存为: {output_filename} (耗时: {step_time:.2f}ms)")
        except Exception as e:
            print(f"保存图片失败: {e}")
            print(f"错误类型: {type(e).__name__}")
            print(f"当前工作目录: {os.getcwd()}")
            return None

        # 总耗时
        total_time = (time.time() - total_start_time) * 1000
        print(f"\n=== 总耗时统计 ===")
        print(f"总耗时: {total_time:.2f}ms")

        return canvas

    except Exception as e:
        print(f"创建分层图片时出错: {e}")
        return None

def analyze_image(filename):
    """分析生成的图片信息"""
    try:
        img = Image.open(filename)
        print(f"生成图片信息:")
        print(f"  尺寸: {img.size}")
        print(f"  模式: {img.mode}")
        print(f"  格式: {img.format}")

        # 转换为numpy数组进行进一步分析
        img_array = np.array(img)
        print(f"  数组形状: {img_array.shape}")
        print(f"  数据类型: {img_array.dtype}")

        if len(img_array.shape) == 3:
            print(f"  颜色通道数: {img_array.shape[2]}")

    except Exception as e:
        print(f"分析图片时出错: {e}")

def main():
    """主函数：生成两种布局的图片"""
    print("=== 统一图片生成程序 ===")
    print("目标: 生成两种不同布局的图片")
    print()

    total_start_time = time.time()

    # 黑色图层颜色配置示例
    # 可以设置为不同的16进制颜色，例如：
    # "#000000" - 黑色
    # "#FFFFFF" - 白色
    # "#808080" - 灰色
    # "#FF0000" - 红色
    # "#00FF00" - 绿色
    # "#0000FF" - 蓝色
    # None - 保持原样，不转换颜色
    black_layer_color = "#000000"  # 设置为黑色

    # 生成布局1的图片
    print("=== 生成布局1图片 ===")
    canvas1 = create_layered_image(layout_type=1, canvas_size=(2560, 720), black_layer_color=black_layer_color)
    if canvas1:
        analyze_image('preview1.png')
        print("[成功] 布局1图片生成完成！")
    else:
        print("[失败] 布局1图片生成失败！")

    print()

    # 生成布局2的图片
    print("=== 生成布局2图片 ===")
    canvas2 = create_layered_image(layout_type=2, canvas_size=(2560, 720), black_layer_color=black_layer_color)
    if canvas2:
        analyze_image('preview2.png')
        print("[成功] 布局2图片生成完成！")
    else:
        print("[失败] 布局2图片生成失败！")

    # 总耗时
    total_time = (time.time() - total_start_time) * 1000
    print(f"\n=== 总耗时统计 ===")
    print(f"总耗时: {total_time:.2f}ms")

if __name__ == "__main__":
    main()
```
```javascript
/**
 * JavaScript版本的图像处理程序
 * 功能与Python版本相同，使用Sharp和Node.js实现
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

/**
 * 将16进制颜色字符串转换为RGB对象
 * @param {string} hexColor - 16进制颜色字符串，格式为 "#RRGGBB" 或 "RRGGBB"
 * @returns {Object|null} RGB颜色对象 {r, g, b} 或 null
 */
function hexToRgb(hexColor) {
    if (hexColor === null || hexColor === undefined) {
        return null;
    }

    // 移除可能的 # 前缀
    hexColor = hexColor.replace(/^#/, '');

    // 验证格式
    if (!/^[0-9A-Fa-f]{6}$/.test(hexColor)) {
        throw new Error(`无效的16进制颜色格式: ${hexColor}，应为6位16进制数`);
    }

    // 转换为RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    return { r, g, b };
}

/**
 * 加载图标并调整大小
 * @param {string} iconPath - 图标文件路径
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @returns {Promise<Buffer>} - 调整大小后的图标Buffer
 */
async function loadAndResizeIcon(iconPath, width, height) {
    try {
        return await sharp(iconPath)
            .resize(width, height, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer();
    } catch (e) {
        console.log(`[警告] 加载图标失败 ${iconPath}: ${e}`);
        throw e;
    }
}

/**
 * 布局1：左右两组，各6个图标
 * @param {sharp.Sharp} canvas - Sharp实例
 * @param {Object} canvasSize - 画布尺寸 {width, height}
 * @param {string} iconFolder - 图标文件夹路径
 * @param {number} startY - 图标起始Y坐标
 * @returns {Promise<sharp.Sharp>} - 处理后的Sharp实例
 */
async function arrangeIconsLayout1(canvasSize, iconFolder = 'icon', startY = 1000) {
    const stepStartTime = Date.now();
    const { width: canvasWidth, height: canvasHeight } = canvasSize;

    try {
        // 获取所有图标文件
        const iconFolderPath = path.join(process.cwd(), iconFolder);
        console.log(`搜索图标文件，路径: ${iconFolderPath}`);

        // 检查图标文件夹是否存在
        if (!fs.existsSync(iconFolderPath)) {
            console.log(`图标文件夹不存在: ${iconFolderPath}`);
            return [];
        }

        // 直接读取目录内容
        let iconFiles = [];
        try {
            const dirContents = fs.readdirSync(iconFolderPath);
            // 只保留.png文件
            iconFiles = dirContents
                .filter(file => file.toLowerCase().endsWith('.png'))
                .map(file => path.join(iconFolderPath, file));

            console.log(`找到 ${iconFiles.length} 个PNG图标文件`);
            console.log(`前5个文件: ${iconFiles.slice(0, 5).map(f => path.basename(f)).join(', ')}`);
        } catch (e) {
            console.log(`读取目录失败: ${e.message}`);
            return [];
        }

        if (!iconFiles.length) {
            console.log("没有找到PNG图标文件，搜索路径: " + iconFolderPath);
            return [];
        }

        console.log(`[信息] 找到 ${iconFiles.length} 个图标文件`);

        // 定义指定的图标文件名
        const specifiedIcons = [
            "com_autopai_smart_sound_effect.png",
            "com_incall_apps_personalcenter.png",
            "com_wt_carcamera.png",
            "com_wt_airconditioner.png",
            "com_wt_vehiclecenter.png",
            "com_autopai_car_dialer.png",
            "com_tinnove_mediacenter.png",
            "com_tinnove_scenemode.png",
            "com_tinnove_scenemode.png",
            "com_wtcl_electronicdirections.png",
            "com_wt_scene.png",
            "com_tinnove_gamezone.png",
        ];

        // 定义应用名称映射
        const appNames = [
            "音效", "个人中心", "空调", "车辆中心", "电话", "AI空间",
            "情景模式", "导航", "场景", "游戏", "空调2", "AI空间2"
        ];

        // 查找指定的图标文件
        const foundIcons = [];
        for (const iconName of specifiedIcons) {
            const iconPath = path.join(process.cwd(), iconFolder, iconName);
            if (fs.existsSync(iconPath)) {
                foundIcons.push(iconPath);
            } else {
                console.log(`[失败] 错误: 找不到图标文件 ${iconName}，搜索路径: ${iconPath}`);
                return [];
            }
        }

        // 如果指定的图标不够12个，用其他图标补充
        if (foundIcons.length < 12) {
            const remainingIcons = iconFiles.filter(f => !foundIcons.includes(f));
            foundIcons.push(...remainingIcons.slice(0, 12 - foundIcons.length));
            console.log(`[警告] 指定的图标不足12个，补充了 ${12 - foundIcons.length} 个其他图标`);
        }

        // 布局参数（使用百分比）
        const iconWidthPercent = 3.9;  // 图标宽度占画布宽度的3.9%
        const iconHeightPercent = 8.33;  // 图标高度占画布高度的8.33%
        const iconSpacingPercent = 3.125;  // 图标间距占画布宽度的3.125%
        const leftGroupStartPercent = 5.47;  // 左侧组起始位置占画布宽度的5.47%
        const groupSpacingPercent = 10.84;  // 两组之间的间距占画布宽度的10.74%

        // 计算实际像素值
        const iconWidth = Math.floor(canvasWidth * iconWidthPercent / 100);
        const iconHeight = Math.floor(canvasHeight * iconHeightPercent / 100);
        const iconSpacing = Math.floor(canvasWidth * iconSpacingPercent / 100);
        const leftGroupStart = Math.floor(canvasWidth * leftGroupStartPercent / 100);
        const groupSpacing = Math.floor(canvasWidth * groupSpacingPercent / 100);

        // 计算右侧组起始位置
        const rightGroupStart = leftGroupStart + 6 * (iconWidth + iconSpacing) - iconSpacing + groupSpacing;

        console.log(`画布尺寸: ${canvasWidth}x${canvasHeight}`);
        console.log(`图标尺寸: ${iconWidth}x${iconHeight} (宽度${iconWidthPercent}%, 高度${iconHeightPercent}%)`);
        console.log(`图标间距: ${iconSpacing}px (${iconSpacingPercent}%)`);
        console.log(`左侧组起始位置: x=${leftGroupStart} (${leftGroupStartPercent}%)`);
        console.log(`右侧组起始位置: x=${rightGroupStart}`);
        console.log(`组间距: ${groupSpacing}px (${groupSpacingPercent}%)`);

        // 加载和放置图标
        const placementStartTime = Date.now();
        const compositeOperations = [];

        for (let i = 0; i < Math.min(foundIcons.length, 12); i++) {
            try {
                const iconFile = foundIcons[i];
                const appName = i < appNames.length ? appNames[i] : `应用${i+1}`;

                // 计算位置
                let iconX, iconY;
                if (i < 6) {
                    // 左侧组
                    iconX = leftGroupStart + i * (iconWidth + iconSpacing);
                    iconY = startY;
                } else {
                    // 右侧组
                    iconX = rightGroupStart + (i - 6) * (iconWidth + iconSpacing);
                    iconY = startY;
                }

                // 加载并调整图标大小
                const resizedIcon = await loadAndResizeIcon(iconFile, iconWidth, iconHeight);

                // 添加到合成操作列表
                compositeOperations.push({
                    input: resizedIcon,
                    top: iconY,
                    left: iconX
                });
            } catch (e) {
                console.log(`[警告] 处理图标失败 ${foundIcons[i]}: ${e}`);
            }
        }

        const placementTime = Date.now() - placementStartTime;
        console.log(`[成功] 图标放置完成 (耗时: ${placementTime.toFixed(2)}ms)`);
        console.log(`[成功] 成功放置 ${compositeOperations.length} 个图标（左右两组各6个）`);

        const totalStepTime = Date.now() - stepStartTime;
        console.log(`[成功] 图标排列总耗时: ${totalStepTime.toFixed(2)}ms`);

        return compositeOperations;
    } catch (e) {
        console.log(`排列图标时出错: ${e}`);
        return [];
    }
}

/**
 * 布局2：左侧3行15个图标，右侧1行6个图标
 * @param {sharp.Sharp} canvas - Sharp实例
 * @param {Object} canvasSize - 画布尺寸 {width, height}
 * @param {string} iconFolder - 图标文件夹路径
 * @param {number} startY - 图标起始Y坐标
 * @returns {Promise<sharp.Sharp>} - 处理后的Sharp实例
 */
async function arrangeIconsLayout2(canvasSize, iconFolder = 'icon', startY = 1000) {
    const stepStartTime = Date.now();
    const { width: canvasWidth, height: canvasHeight } = canvasSize;

    try {
        // 获取所有图标文件
        const iconFolderPath = path.join(process.cwd(), iconFolder);
        console.log(`搜索图标文件，路径: ${iconFolderPath}`);

        // 检查图标文件夹是否存在
        if (!fs.existsSync(iconFolderPath)) {
            console.log(`图标文件夹不存在: ${iconFolderPath}`);
            return [];
        }

        // 直接读取目录内容
        let iconFiles = [];
        try {
            const dirContents = fs.readdirSync(iconFolderPath);
            // 只保留.png文件
            iconFiles = dirContents
                .filter(file => file.toLowerCase().endsWith('.png'))
                .map(file => path.join(iconFolderPath, file));

            console.log(`找到 ${iconFiles.length} 个PNG图标文件`);
            console.log(`前5个文件: ${iconFiles.slice(0, 5).map(f => path.basename(f)).join(', ')}`);
        } catch (e) {
            console.log(`读取目录失败: ${e.message}`);
            return [];
        }

        if (!iconFiles.length) {
            console.log("没有找到PNG图标文件，搜索路径: " + iconFolderPath);
            return [];
        }

        console.log(`[信息] 找到 ${iconFiles.length} 个图标文件`);

        // 定义指定的图标文件名 (左侧15个 + 右侧6个 = 21个)
        const specifiedIcons = [
            // 左侧第一行 (6个)
            "com_tinnove_mediacenter.png",
            "com_autopai_car_dialer.png",
            "com_wt_vehiclecenter.png",
            "com_wt_maintenance.png",
            "com_tinnove_aispace.png",
            "com_tinnove_carshow.png",
            // 左侧第二行 (6个)
            "com_wt_airconditioner.png",
            "com_autopai_album.png",
            "com_incall_apps_personalcenter.png",
            "com_wtcl_filemanager.png",
            "com_incall_dvr.png",
            "com_wtcl_electronicdirections.png",
            // 左侧第三行 (3个)
            "com_wt_gamecenter.png",
            "com_wt_carcamera.png",
            "com_autopai_smart_sound_effect.png",
            // 右侧一行 (6个)
            "com_tinnove_aispace.png",
            "com_tinnove_scenemode.png",
            "com_tinnove_link_client.png",
            "com_wtcl_electronicdirections.png",
            "com_wt_scene.png",
            "com_tinnove_gamezone.png",
        ];

        // 定义应用名称映射
        const appNames = [
            // 左侧第一行
            "音效", "个人中心", "空调", "车辆中心", "电话", "AI空间",
            // 左侧第二行
            "场景", "导航", "情景", "游戏", "相册", "应用市场",
            // 左侧第三行
            "健康", "记录仪", "AI语音",
            // 右侧一行
            "云摄像头", "客服", "连接", "媒体", "导航", "微信"
        ];

        // 查找指定的图标文件
        const foundIcons = [];
        for (const iconName of specifiedIcons) {
            const iconPath = path.join(process.cwd(), iconFolder, iconName);
            if (fs.existsSync(iconPath)) {
                foundIcons.push(iconPath);
            } else {
                console.log(`[失败] 错误: 找不到图标文件 ${iconName}，搜索路径: ${iconPath}`);
                return [];
            }
        }

        // 如果指定的图标不够21个，用其他图标补充
        if (foundIcons.length < 21) {
            const remainingIcons = iconFiles.filter(f => !foundIcons.includes(f));
            foundIcons.push(...remainingIcons.slice(0, 21 - foundIcons.length));
            console.log(`[警告] 指定的图标不足21个，补充了 ${21 - foundIcons.length} 个其他图标`);
        }

        // 布局参数（使用百分比）
        const iconWidthPercent = 3.9;  // 图标宽度占画布宽度的3.9%
        const iconHeightPercent = 8.33;  // 图标高度占画布高度的8.33%
        const iconSpacingPercent = 3.125;  // 图标间距占画布宽度的3.125%
        const rowSpacingPercent = 15.28;  // 行间距占画布高度的15.28%
        const leftGroupStartPercent = 5.47;  // 左侧组起始位置占画布宽度的5.47%
        const leftGroupTopPercent = 27.78;  // 左侧组顶部位置占画布高度的27.78%
        const rightGroupTopPercent = 45.14;  // 右侧组顶部位置占画布高度的45.14%
        const groupSpacingPercent = 11.24;  // 两组之间的间距占画布宽度的11.24%

        // 计算实际像素值
        const iconWidth = Math.floor(canvasWidth * iconWidthPercent / 100);
        const iconHeight = Math.floor(canvasHeight * iconHeightPercent / 100);
        const iconSpacing = Math.floor(canvasWidth * iconSpacingPercent / 100);
        const rowSpacing = Math.floor(canvasHeight * rowSpacingPercent / 100);
        const leftGroupStart = Math.floor(canvasWidth * leftGroupStartPercent / 100);
        const leftGroupTop = Math.floor(canvasHeight * leftGroupTopPercent / 100);
        const rightGroupTop = Math.floor(canvasHeight * rightGroupTopPercent / 100);
        const groupSpacing = Math.floor(canvasWidth * groupSpacingPercent / 100);

        // 计算右侧组起始位置
        const rightGroupStart = leftGroupStart + 6 * (iconWidth + iconSpacing) - iconSpacing + groupSpacing;

        console.log(`画布尺寸: ${canvasWidth}x${canvasHeight}`);
        console.log(`图标尺寸: ${iconWidth}x${iconHeight} (宽度${iconWidthPercent}%, 高度${iconHeightPercent}%)`);
        console.log(`图标间距: ${iconSpacing}px (${iconSpacingPercent}%)`);
        console.log(`行间距: ${rowSpacing}px (${rowSpacingPercent}%)`);
        console.log(`左侧组起始位置: x=${leftGroupStart} (${leftGroupStartPercent}%), y=${leftGroupTop} (${leftGroupTopPercent}%)`);
        console.log(`右侧组起始位置: x=${rightGroupStart}, y=${rightGroupTop} (${rightGroupTopPercent}%)`);
        console.log(`组间距: ${groupSpacing}px (${groupSpacingPercent}%)`);

        // 加载和放置图标
        const placementStartTime = Date.now();
        const compositeOperations = [];

        for (let i = 0; i < Math.min(foundIcons.length, 21); i++) {
            try {
                const iconFile = foundIcons[i];
                const appName = i < appNames.length ? appNames[i] : `应用${i+1}`;

                // 计算位置
                let iconX, iconY;
                if (i < 15) {
                    // 左侧组：3行（前两行6列，第三行3列）
                    let row, col;
                    if (i < 12) {
                        // 前两行：6列
                        row = Math.floor(i / 6);  // 计算行号 (0, 1)
                        col = i % 6;   // 计算列号 (0-5)
                    } else {
                        // 第三行：3列
                        row = 2;
                        col = i - 12;  // 计算列号 (0-2)
                    }
                    iconX = leftGroupStart + col * (iconWidth + iconSpacing);
                    iconY = leftGroupTop + row * (iconHeight + rowSpacing);
                } else {
                    // 右侧组：1行6列
                    iconX = rightGroupStart + (i - 15) * (iconWidth + iconSpacing);
                    iconY = rightGroupTop;
                }

                // 加载并调整图标大小
                const resizedIcon = await loadAndResizeIcon(iconFile, iconWidth, iconHeight);

                // 添加到合成操作列表
                compositeOperations.push({
                    input: resizedIcon,
                    top: iconY,
                    left: iconX
                });
            } catch (e) {
                console.log(`[警告] 处理图标失败 ${foundIcons[i]}: ${e}`);
            }
        }

        const placementTime = Date.now() - placementStartTime;
        console.log(`[成功] 图标放置完成 (耗时: ${placementTime.toFixed(2)}ms)`);
        console.log(`[成功] 成功放置 ${compositeOperations.length} 个图标（左侧3行15个，右侧1行6个）`);

        const totalStepTime = Date.now() - stepStartTime;
        console.log(`[成功] 图标排列总耗时: ${totalStepTime.toFixed(2)}ms`);

        return compositeOperations;
    } catch (e) {
        console.log(`排列图标时出错: ${e}`);
        return [];
    }
}

/**
 * 创建分层图片：背景+黑色图层+背景图层+图标
 * @param {number} layoutType - 布局类型 (1 或 2)
 * @param {Object} canvasSize - 画布尺寸 {width, height}
 * @param {string|null} blackLayerColor - 黑色图层转换颜色，格式为16进制字符串 "#RRGGBB" 或 null
 * @returns {Promise<void>}
 */
async function createLayeredImage(layoutType = 1, canvasSize = { width: 2560, height: 720 }, blackLayerColor = null) {
    const totalStartTime = Date.now();
    const { width: canvasWidth, height: canvasHeight } = canvasSize;
    try {
        // 路径
        const bgFile = path.join(process.cwd(), layoutType === 1 ? 'bg.png' : 'bg2.png');
        const blackFile = path.join(process.cwd(), layoutType === 1 ? 'black.png' : 'black2.png');
        const wallpaperPath = path.join(process.cwd(), 'wallpaper_1.png');

        // 读取并resize所有图层
        const wallpaperBuffer = await sharp(wallpaperPath).resize(canvasWidth, canvasHeight).toBuffer();
        let blackBuffer = await sharp(blackFile).resize(canvasWidth, canvasHeight).toBuffer();
        if (blackLayerColor !== null) {
            const rgbColor = hexToRgb(blackLayerColor);
            blackBuffer = await sharp(blackBuffer).tint(rgbColor).png().toBuffer();
        }
        const bgBuffer = await sharp(bgFile).resize(canvasWidth, canvasHeight).toBuffer();

        // 图标合成参数
        const startYPercent = 45.14;
        const startY = Math.floor(canvasHeight * startYPercent / 100);
        let iconComposites;
        if (layoutType === 1) {
            iconComposites = await arrangeIconsLayout1(canvasSize, 'icon', startY);
        } else {
            iconComposites = await arrangeIconsLayout2(canvasSize, 'icon', startY);
        }

        // 一次性合成所有图层
        let canvas = sharp({
            create: {
                width: canvasWidth,
                height: canvasHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });
        const allLayers = [
            { input: wallpaperBuffer, top: 0, left: 0 },
            { input: blackBuffer, top: 0, left: 0 },
            { input: bgBuffer, top: 0, left: 0 },
            ...iconComposites
        ];
        canvas = await canvas.composite(allLayers);

        // 保存
        const outputFilename = `preview${layoutType}.png`;
        await canvas.toFile(outputFilename);
        const totalTime = Date.now() - totalStartTime;
        console.log(`[成功] 图片已保存为: ${outputFilename}`);
        console.log(`总耗时: ${totalTime.toFixed(2)}ms`);
        return canvas;
    } catch (e) {
        console.log(`创建分层图片时出错: ${e}`);
        return null;
    }
}

/**
 * 分析生成的图片信息
 * @param {string} filename - 图片文件名
 */
async function analyzeImage(filename) {
    try {
        const metadata = await sharp(filename).metadata();

        console.log(`生成图片信息:`);
        console.log(`  尺寸: ${metadata.width}x${metadata.height}`);
        console.log(`  格式: ${metadata.format}`);
        console.log(`  通道数: ${metadata.channels}`);
        console.log(`  文件路径: ${path.resolve(filename)}`);

        // 获取文件大小
        const stats = fs.statSync(filename);
        console.log(`  文件大小: ${stats.size} 字节`);

    } catch (e) {
        console.log(`分析图片时出错: ${e}`);
    }
}

/**
 * 主函数：生成两种布局的图片
 */
async function main() {
    console.log("=== 统一图片生成程序 ===\n目标: 生成两种不同布局的图片\n");

    const totalStartTime = Date.now();

    // 黑色图层颜色配置示例
    // 可以设置为不同的16进制颜色，例如：
    // "#000000" - 黑色
    // "#FFFFFF" - 白色
    // "#808080" - 灰色
    // "#FF0000" - 红色
    // "#00FF00" - 绿色
    // "#0000FF" - 蓝色
    // null - 保持原样，不转换颜色
    const blackLayerColor = "#000000";  // 设置为黑色

    // 生成布局1的图片
    console.log("=== 生成布局1图片 ===");
    const canvas1 = await createLayeredImage(1, { width: 2560, height: 720 }, blackLayerColor);
    if (canvas1) {
        await analyzeImage('preview1.png');
        console.log("[成功] 布局1图片生成完成！");
    } else {
        console.log("[失败] 布局1图片生成失败！");
    }

    console.log();

    // 生成布局2的图片
    console.log("=== 生成布局2图片 ===");
    const canvas2 = await createLayeredImage(2, { width: 2560, height: 720 }, blackLayerColor);
    if (canvas2) {
        await analyzeImage('preview2.png');
        console.log("[成功] 布局2图片生成完成！");
    } else {
        console.log("[失败] 布局2图片生成失败！");
    }

    // 总耗时
    const totalTime = Date.now() - totalStartTime;
    console.log(`\n=== 总耗时统计 ===`);
    console.log(`总耗时: ${totalTime.toFixed(2)}ms`);
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
    main().catch(err => {
        console.error("程序执行出错:", err);
    });
}

// 导出函数以便其他模块使用
module.exports = {
    hexToRgb,
    loadAndResizeIcon,
    arrangeIconsLayout1,
    arrangeIconsLayout2,
    createLayeredImage,
    analyzeImage,
    main
};
```
