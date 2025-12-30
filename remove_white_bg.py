from PIL import Image
import os

def remove_white_background(input_path, output_path, threshold=240):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if the pixel is close to white
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                newData.append((255, 255, 255, 0))  # Make it transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed {input_path} to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Process scroll asset
remove_white_background(
    "/home/ubuntu/analysis-platform/client/public/images/scroll-asset.png",
    "/home/ubuntu/analysis-platform/client/public/images/scroll-asset-transparent.png"
)

# Process label asset
remove_white_background(
    "/home/ubuntu/analysis-platform/client/public/images/label-paper.png",
    "/home/ubuntu/analysis-platform/client/public/images/label-paper-transparent.png"
)
