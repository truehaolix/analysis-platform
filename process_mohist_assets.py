from PIL import Image
import os

def remove_background(input_path, output_path, threshold=240):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check if the pixel is close to white
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Processed {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Process Mohist Gear
remove_background(
    "/home/ubuntu/analysis-platform/client/public/images/mohist-gear.png",
    "/home/ubuntu/analysis-platform/client/public/images/mohist-gear-transparent.png"
)

# Process Mohist Lever
remove_background(
    "/home/ubuntu/analysis-platform/client/public/images/mohist-lever.png",
    "/home/ubuntu/analysis-platform/client/public/images/mohist-lever-transparent.png"
)
