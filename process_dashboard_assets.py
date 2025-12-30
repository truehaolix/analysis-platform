from PIL import Image
import os

def remove_background(input_path):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return

        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        datas = img.getdata()
        new_data = []
        
        # Simple threshold for white/near-white background removal
        for item in datas:
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        
        # Save as transparent PNG
        output_path = input_path.replace(".png", "-transparent.png")
        img.save(output_path, "PNG")
        print(f"Processed: {output_path}")
        
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

icons = [
    "/home/ubuntu/analysis-platform/client/public/images/icon-standard.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-demand.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-collection.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-tools.png"
]

for icon in icons:
    remove_background(icon)
