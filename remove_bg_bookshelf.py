from PIL import Image
import numpy as np

# Load the image
image_path = "/home/ubuntu/analysis-platform/client/public/images/wooden-bookshelf-isolated.jpg"
output_path = "/home/ubuntu/analysis-platform/client/public/images/wooden-bookshelf-transparent.png"

try:
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Change all white (also shades of whites) pixels to transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Successfully saved transparent image to {output_path}")

except Exception as e:
    print(f"Error: {e}")
