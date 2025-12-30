from PIL import Image, ImageDraw, ImageFont
import os

def remove_white_background(input_path, output_path, threshold=240):
    """Removes white background from an image."""
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check if the pixel is close to white
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                new_data.append((255, 255, 255, 0))  # Transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Processed transparency for {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def add_title_to_bg(bg_path, output_path, text="优秀经验展板"):
    """Adds the title to the background image."""
    try:
        img = Image.open(bg_path).convert("RGB")
        draw = ImageDraw.Draw(img)
        
        # Load font
        font_path = "/home/ubuntu/analysis-platform/client/public/fonts/ZhiMangXing-Regular.ttf"
        if not os.path.exists(font_path):
            # Fallback to a default font if custom font is missing (though it should be there)
            print("Custom font not found, using default.")
            font = ImageFont.load_default()
            font_size = 40
        else:
            # Adjust font size based on image width. 
            # The image is zoomed out, so the text should be smaller relative to the full width 
            # to fit on the plaque, but still readable.
            font_size = int(img.width * 0.03) 
            font = ImageFont.truetype(font_path, font_size)

        # Calculate text position - Center Top
        # Assuming the plaque is roughly in the top center.
        # We'll place it at 10% from the top.
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (img.width - text_width) / 2
        y = img.height * 0.08 # Slightly lower than top edge

        # Draw text with a subtle shadow/glow for better visibility
        shadow_color = (60, 40, 30)
        text_color = (40, 20, 10) # Dark brown ink color
        
        # Shadow
        draw.text((x + 2, y + 2), text, font=font, fill=shadow_color)
        # Main text
        draw.text((x, y), text, font=font, fill=text_color)
        
        img.save(output_path)
        print(f"Baked title to {output_path}")
    except Exception as e:
        print(f"Error adding title: {e}")

# 1. Process Vertical Label Transparency
remove_white_background(
    "/home/ubuntu/analysis-platform/client/public/images/asset-vertical-label.png",
    "/home/ubuntu/analysis-platform/client/public/images/asset-vertical-label-transparent.png"
)

# 2. Bake Title onto Zoomed-out Background
add_title_to_bg(
    "/home/ubuntu/analysis-platform/client/public/images/bookshelf-zoomed-out.jpg",
    "/home/ubuntu/analysis-platform/client/public/images/bg-final-v2.jpg"
)
