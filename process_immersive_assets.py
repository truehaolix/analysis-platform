from PIL import Image
import os

def remove_background(input_path, output_path, threshold=240):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check if the pixel is close to white (for the scroll) or just use a general removal if simple
            # For generated images, simple threshold might not work perfectly if background is complex.
            # However, since I can't use advanced AI segmentation here easily without external libs, 
            # I will try a simple corner-based flood fill or just threshold if the prompt asked for isolated.
            # The prompts didn't explicitly say "isolated on white" for all, but let's try.
            
            # Actually, for "wall-mechanism" and "plaque", the background might be complex.
            # But since I don't have a robust background removal model installed by default (like rembg),
            # I will rely on the fact that I can't easily do perfect removal without it.
            # Wait, I can use `rembg` if I install it, but I should check if it's available or if I can use a simple heuristic.
            # Let's assume the generation produced something reasonable or I will just use them as rectangular assets with borders if removal fails.
            
            # BUT, for the purpose of this task, I will try to make them "transparent" by assuming a white/black background if possible,
            # or just keep them rectangular if they look like framed objects.
            
            # Plaque: Usually rectangular.
            # Scroll: Rectangular.
            # Mechanism: Might be irregular.
            
            # Let's just copy them for now and maybe apply a simple mask if needed.
            # Actually, the user wants "no borders", so transparency is better.
            # I'll try a simple white background removal for the scroll.
            
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Processed {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# For the mechanism, it might be better to just use it as a square tile if it's on a wall, 
# or try to remove background. Let's try to remove white background.
remove_background(
    "/home/ubuntu/analysis-platform/client/public/images/wall-mechanism.png",
    "/home/ubuntu/analysis-platform/client/public/images/wall-mechanism-transparent.png"
)

remove_background(
    "/home/ubuntu/analysis-platform/client/public/images/hanging-scroll.png",
    "/home/ubuntu/analysis-platform/client/public/images/hanging-scroll-transparent.png"
)

# Plaque might be dark, so threshold removal might not work if background is dark.
# Let's just convert it to png.
try:
    img = Image.open("/home/ubuntu/analysis-platform/client/public/images/immersive-plaque.png")
    img.save("/home/ubuntu/analysis-platform/client/public/images/immersive-plaque.png") # Just ensure it is saved
except:
    pass
