from PIL import Image, ImageDraw, ImageOps
import os

def make_circular(input_path):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return

        img = Image.open(input_path).convert("RGBA")
        
        # Create circular mask
        size = min(img.size)
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # Crop to square and apply mask
        output = ImageOps.fit(img, (size, size), centering=(0.5, 0.5))
        output.putalpha(mask)
        
        # Save
        output_path = input_path.replace(".png", "-circle.png")
        output.save(output_path, "PNG")
        print(f"Processed: {output_path}")
        
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

make_circular("/home/ubuntu/analysis-platform/client/public/images/game-icon-bg.png")
