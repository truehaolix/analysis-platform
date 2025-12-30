from PIL import Image, ImageDraw, ImageFont
import os

# Paths
bg_path = "/home/ubuntu/analysis-platform/client/public/images/bookshelf-empty-clean.png"
book_path = "/home/ubuntu/analysis-platform/client/public/images/asset-book-spine.png"
tag_path = "/home/ubuntu/analysis-platform/client/public/images/asset-hanging-tag.png"
font_path = "/home/ubuntu/analysis-platform/client/public/fonts/ZhiMangXing-Regular.ttf"

# Output paths
bg_output = "/home/ubuntu/analysis-platform/client/public/images/bg-final.jpg"
book_output = "/home/ubuntu/analysis-platform/client/public/images/asset-book-spine-transparent.png"
tag_output = "/home/ubuntu/analysis-platform/client/public/images/asset-hanging-tag-transparent.png"

def remove_white_bg(image_path, output_path, threshold=240):
    try:
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()
        newData = []
        for item in datas:
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        img.putdata(newData)
        # Crop to content
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
        img.save(output_path, "PNG")
        print(f"Processed transparency for {output_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def bake_title(bg_path, output_path, text="优秀经验展板"):
    try:
        img = Image.open(bg_path).convert("RGB")
        draw = ImageDraw.Draw(img)
        
        # Load font
        try:
            font_size = 50 # Initial guess
            font = ImageFont.truetype(font_path, font_size)
        except:
            print("Font not found, using default")
            font = ImageFont.load_default()

        # Calculate position (Top center plaque area)
        # Based on the image structure, the plaque is at the top center
        W, H = img.size
        
        # Fine-tune font size and position based on the image resolution
        # Assuming 16:9 landscape, plaque is roughly at top 10%
        font_size = int(H * 0.06) 
        font = ImageFont.truetype(font_path, font_size)
        
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        
        # Center horizontally, slightly below top edge
        x = (W - text_w) / 2
        y = H * 0.065 # Approximate vertical center of the plaque
        
        # Draw text with slight shadow for depth
        shadow_color = (60, 40, 30)
        text_color = (40, 20, 10)
        
        draw.text((x+2, y+2), text, font=font, fill=shadow_color)
        draw.text((x, y), text, font=font, fill=text_color)
        
        img.save(output_path, "JPEG", quality=95)
        print(f"Baked title to {output_path}")
    except Exception as e:
        print(f"Error baking title: {e}")

# Execute
if __name__ == "__main__":
    # 1. Process Assets Transparency
    remove_white_bg(book_path, book_output)
    remove_white_bg(tag_path, tag_output)
    
    # 2. Bake Title onto Background
    bake_title(bg_path, bg_output)
