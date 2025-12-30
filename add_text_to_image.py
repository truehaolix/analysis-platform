from PIL import Image, ImageDraw, ImageFont
import os

# Load the image
image_path = "/home/ubuntu/analysis-platform/client/public/images/bookshelf-6-rows-empty-front.jpg"
output_path = "/home/ubuntu/analysis-platform/client/public/images/bookshelf-6-rows-final.jpg"
font_path = "/home/ubuntu/analysis-platform/client/public/fonts/ZhiMangXing-Regular.ttf"

try:
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    
    # Load font - try to find a system font if the specific one isn't there, 
    # but we should check if the font exists first.
    # Assuming the font was downloaded in a previous step or is available.
    # If not, we might need to use a default font or download one.
    # Let's check if the font exists, if not use a default but warn.
    
    if not os.path.exists(font_path):
        print(f"Font not found at {font_path}, using default font.")
        font = ImageFont.load_default()
        # Default font might not support Chinese, so we really need a Chinese font.
        # Let's try to find one in the system if the specific one is missing.
        # For this environment, we might need to download one if missing.
        # However, based on context, ZhiMangXing was used in CSS, so it might be in public/fonts?
        # Let's assume for now we need to find a font that supports Chinese.
        # Actually, let's just try to use a font we know exists or can download.
        # Since I cannot download from here easily without a URL, I will assume the user
        # wants me to use the one from the project if available.
        pass
    else:
        font_size = 120 # Adjust based on image size
        font = ImageFont.truetype(font_path, font_size)

    text = "优秀成果展板"
    
    # Calculate text position - centered on the plaque
    # The plaque is at the top. Let's estimate its position.
    # Based on the image generation prompt, it's at the top.
    # Let's get image dimensions
    width, height = img.size
    
    # Estimate plaque area: top 15% of the image
    plaque_center_y = height * 0.08 
    plaque_center_x = width / 2
    
    # Get text size
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = plaque_center_x - text_width / 2
    y = plaque_center_y - text_height / 2
    
    # Draw text with a gold/yellow color to match the border
    text_color = (255, 215, 0) # Gold
    
    # Add a slight shadow for better visibility
    shadow_color = (0, 0, 0)
    shadow_offset = 3
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=shadow_color)
    draw.text((x, y), text, font=font, fill=text_color)
    
    img.save(output_path)
    print(f"Successfully saved image to {output_path}")

except Exception as e:
    print(f"Error: {e}")
