from PIL import Image
import os

def remove_white_background(input_path, output_path, tolerance=30):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return

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

# List of files to process
files_to_process = [
    "/home/ubuntu/analysis-platform/client/public/images/front-facing-book.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-classroom.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-game.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-quarterly.png",
    "/home/ubuntu/analysis-platform/client/public/images/icon-expert.png"
]

for file_path in files_to_process:
    # Overwrite the original file or create a new one? Let's create a new one with -transparent suffix
    # But for the book, we might want to keep the name simple or update the code.
    # Let's use the same name for simplicity in code updates later, but wait, 
    # it's safer to create a new file to avoid data loss if something goes wrong.
    # Actually, let's just overwrite for now as we have the original generated one if needed (can regenerate).
    # Better: create a transparent version.
    
    dir_name = os.path.dirname(file_path)
    base_name = os.path.basename(file_path)
    name, ext = os.path.splitext(base_name)
    output_path = os.path.join(dir_name, f"{name}-transparent{ext}")
    
    remove_white_background(file_path, output_path)
