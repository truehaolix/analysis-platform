from PIL import Image, ImageDraw, ImageFont
import os

def add_title_to_bg(bg_path, output_path, text="优秀经验展板"):
    """Adds the title to the background image."""
    try:
        img = Image.open(bg_path).convert("RGB")
        draw = ImageDraw.Draw(img)
        
        # Load font
        font_path = "/home/ubuntu/analysis-platform/client/public/fonts/ZhiMangXing-Regular.ttf"
        if not os.path.exists(font_path):
            print("Custom font not found, using default.")
            font = ImageFont.load_default()
            font_size = 40
        else:
            # Adjust font size. Since image is zoomed out, the plaque is smaller.
            # We need to find the plaque position visually or guess.
            # In the zoomed out version, the plaque is roughly at 20% from top (since we added padding).
            font_size = int(img.width * 0.025) 
            font = ImageFont.truetype(font_path, font_size)

        # Calculate text position
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        
        x = (img.width - text_width) / 2
        # Position needs to be lower because of the padding we added.
        # Original image was centered. Plaque was at top.
        # New image has padding. So plaque is roughly at (Height - OriginalHeight)/2 + OriginalPlaqueOffset
        # OriginalPlaqueOffset was ~8%.
        # Padding is roughly 17.5% on top (since scale is 0.65).
        # So roughly 17.5% + (65% * 8%) = 17.5 + 5.2 = 22.7%
        y = img.height * 0.225 

        # Draw text
        shadow_color = (60, 40, 30)
        text_color = (40, 20, 10)
        
        draw.text((x + 2, y + 2), text, font=font, fill=shadow_color)
        draw.text((x, y), text, font=font, fill=text_color)
        
        img.save(output_path)
        print(f"Baked title to {output_path}")
    except Exception as e:
        print(f"Error adding title: {e}")

add_title_to_bg(
    "/home/ubuntu/analysis-platform/client/public/images/bookshelf-refined-zoomed.jpg",
    "/home/ubuntu/analysis-platform/client/public/images/bg-final-v3.jpg"
)
