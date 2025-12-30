from PIL import Image, ImageDraw, ImageFont
import os

# Load the image
image_path = "/home/ubuntu/analysis-platform/client/public/images/bookshelf-xieyi-masterpiece.jpg"
output_path = "/home/ubuntu/analysis-platform/client/public/images/bookshelf-xieyi-masterpiece-final.jpg"
font_path = "/home/ubuntu/analysis-platform/client/public/fonts/ZhiMangXing-Regular.ttf"

try:
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    
    if not os.path.exists(font_path):
        print(f"Font not found at {font_path}, using default font.")
        font = ImageFont.load_default()
    else:
        font_size = 110 # Adjusted for the masterpiece image
        font = ImageFont.truetype(font_path, font_size)

    text = "优秀成果展板"
    
    # Calculate text position - centered on the plaque
    width, height = img.size
    
    # Estimate plaque area: top 10-15% of the image
    # Based on the masterpiece image, the plaque is a rectangular ink stroke area at the top.
    plaque_center_y = height * 0.11 # Estimated based on typical composition
    plaque_center_x = width / 2
    
    # Get text size
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = plaque_center_x - text_width / 2
    y = plaque_center_y - text_height / 2
    
    # Draw text with black ink color to match the style
    text_color = (30, 30, 30) # Dark ink
    
    draw.text((x, y), text, font=font, fill=text_color)
    
    img.save(output_path)
    print(f"Successfully saved image to {output_path}")

except Exception as e:
    print(f"Error: {e}")
