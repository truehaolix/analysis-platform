from PIL import Image, ImageOps

def zoom_out_image(input_path, output_path, padding_factor=0.5):
    """
    Simulates a zoom-out effect by adding white padding around the image.
    padding_factor: 0.5 means the original image will take up about 50% of the new canvas width/height (conceptually).
    Actually, we'll add padding to make the original image look smaller.
    """
    try:
        img = Image.open(input_path).convert("RGB")
        
        # Calculate new size
        # If we want the bookshelf to be smaller, we increase the canvas size.
        # Let's say we want the bookshelf to be 60% of the height.
        # Current height = h. New height = h / 0.6
        
        scale_ratio = 0.65 # The original image will occupy 65% of the new height
        
        new_width = int(img.width / scale_ratio)
        new_height = int(img.height / scale_ratio)
        
        # Create new white background
        new_img = Image.new("RGB", (new_width, new_height), (248, 248, 248)) # Slightly off-white to match paper
        
        # Paste original image in center
        x_offset = (new_width - img.width) // 2
        y_offset = (new_height - img.height) // 2
        
        new_img.paste(img, (x_offset, y_offset))
        
        # Resize back to original dimensions (optional, but good for consistency if we want 1920x1080)
        # Or keep it high res. Let's resize to a standard 1920x1080 ratio if possible, 
        # but here we just want to keep the aspect ratio reasonable.
        # Let's resize it back to the original image's dimensions to fit the screen 
        # (assuming the original was already screen-sized).
        
        final_img = new_img.resize((img.width, img.height), Image.Resampling.LANCZOS)
        
        final_img.save(output_path)
        print(f"Created zoomed-out image at {output_path}")
        
    except Exception as e:
        print(f"Error zooming out: {e}")

# Use the 'Refined' image selected previously (bookshelf-refined-4.jpg)
# We need to find where it is. Based on history, it was generated at:
# /home/ubuntu/analysis-platform/client/public/images/bookshelf-refined-4.jpg
# But wait, the user said "回滚到上个版本的图片", which might refer to the one BEFORE the "zoomed-out" attempt.
# The previous successful one was likely the 'Refined' one.
# Let's use 'bookshelf-refined-4.jpg' as the source.

zoom_out_image(
    "/home/ubuntu/analysis-platform/client/public/images/bookshelf-refined-4.jpg",
    "/home/ubuntu/analysis-platform/client/public/images/bookshelf-refined-zoomed.jpg"
)
