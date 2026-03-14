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
            r, g, b, a = item
            
            # Very aggressive green removal: if green is significantly higher than both red and blue
            max_rb = max(r, b)
            if g > max_rb and (g - max_rb) > 30:
                # Fully transparent
                new_data.append((255, 255, 255, 0))
            elif g > max_rb and (g - max_rb) > 10:
                # Feathering for edges
                alpha = 255 - ((g - max_rb) * 10)
                new_data.append((max_rb, max_rb, max_rb, max(0, alpha)))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        out_path = r"C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_alpha.png"
        img.save(out_path, "PNG")
        print(f"Successfully saved to {out_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    remove_green()
