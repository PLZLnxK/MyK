import sys
try:
    from PIL import Image
    # Load image
    img = Image.open(r"C:\Users\Lnx\.gemini\antigravity\brain\28af9d66-f2fe-4343-8dbc-d4cc3fa0133a\rottweiler_3d_1773459383938.png").convert("RGBA")
    
    # Get the background color from top-left pixel
    pixels = img.load()
    bg_color = pixels[0, 0]
    
    # Simple color distance based transparency
    def color_dist(c1, c2):
        return sum(abs(a - b) for a, b in zip(c1[:3], c2[:3]))
    
    width, height = img.size
    for y in range(height):
        for x in range(width):
            if color_dist(pixels[x, y], bg_color) < 150: # Tolerance
                pixels[x, y] = (255, 255, 255, 0)
                
    img.save(r"c:\Users\Lnx\Documents\Web 14 febrero\img\ginger.png", "PNG")
    print("Success")
except Exception as e:
    print(f"Error: {e}")
