import sys
from PIL import Image

def remove_green():
    try:
        # Load the original green image
        img = Image.open(r"C:\Users\Lnx\.gemini\antigravity\brain\28af9d66-f2fe-4343-8dbc-d4cc3fa0133a\rottweiler_green_1773459885340.png")
        img = img.convert("RGBA")
        
        datas = img.getdata()
        new_data = []
        
        for item in datas:
            # item is (R, G, B, A)
            r, g, b, a = item
            
            # Identify Chroma Key green (high G, low R, low B)
            if g > 150 and r < 120 and b < 120:
                # Fully transparent
                new_data.append((255, 255, 255, 0))
            else:
                # Keep original pixel
                new_data.append(item)
                
        img.putdata(new_data)
        out_path = r"C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_clean.png"
        img.save(out_path, "PNG")
        print(f"Successfully processed image and injected true transparency into {out_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    remove_green()
