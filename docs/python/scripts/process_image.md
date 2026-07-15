# 图片缩放与压缩脚本说明

## 文件位置

`docs/process_image.py`

## 主要作用

将 PNG 图片缩放到指定尺寸，并自动控制文件大小在指定阈值以内。

当图片放大后文件大小超出限制时，脚本会自动通过颜色量化（256→128→64→32色）逐级压缩，直到满足文件大小要求。

## 典型场景

- 应用商店上架图标处理（华为 512x512 + ≤200KB，荣耀类似要求）
- Logo 等图标素材批量处理

## 依赖

```bash
pip install Pillow
```

## 使用方法

```bash
# 基本用法（默认 512x512, 最大200KB）
python3 docs/process_image.py 源图片.png 输出图片.png

# 自定义尺寸和大小限制
python3 docs/process_image.py 源图片.png 输出图片.png 512 512 200
```

### 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| 源图片路径 | 输入的 PNG 图片 | 必填 |
| 输出路径 | 输出的 PNG 图片 | 必填 |
| 宽度 | 目标宽度 px | 512 |
| 高度 | 目标高度 px | 512 |
| 最大KB | 文件大小上限 | 200 |

## 示例

```bash
# 处理应用市场图标
python3 docs/process_image.py logo.png output_logo.png

# 自定义尺寸
python3 docs/process_image.py icon.png output.png 1024 1024 500
```

## 技术实现

1. **缩放**：使用 Pillow `LANCZOS` 算法进行高质量缩放
2. **压缩**：PNG `optimize=True` 优化输出
3. **量化兜底**：若超出大小限制，使用 `MEDIANCUT` 算法逐步降低色深（256→128→64→32色）
