from PIL import Image
import os

def remove_white_background(input_path, output_path, tolerance=30):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if the pixel is close to white
            if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
                newData.append((255, 255, 255, 0))  # Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed {input_path} to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Process the book set image
remove_white_background(
    "/home/ubuntu/analysis-platform/client/public/images/chinese-book-set.png",
    "/home/ubuntu/analysis-platform/client/public/images/chinese-book-set-transparent.png"
)
