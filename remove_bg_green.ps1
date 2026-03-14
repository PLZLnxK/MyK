Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImageProcessorClean {
    public static void RemoveBackground(string inFile, string outFile) {
        Bitmap bmp = new Bitmap(inFile);
        Color bgColor = bmp.GetPixel(0,0);
        
        int tol = 100;
        
        BitmapData data = bmp.LockBits(new Rectangle(0, 0, bmp.Width, bmp.Height), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int bytes = Math.Abs(data.Stride) * bmp.Height;
        byte[] rgbValues = new byte[bytes];
        Marshal.Copy(data.Scan0, rgbValues, 0, bytes);
        
        for(int i=0; i<bytes; i+=4) {
            byte b = rgbValues[i];
            byte g = rgbValues[i+1];
            byte r = rgbValues[i+2];
            byte a = rgbValues[i+3];
            
            if (a > 0) {
                // If the pixel is close to the top-left background color
                if (Math.Abs(r - bgColor.R) < tol && Math.Abs(g - bgColor.G) < tol && Math.Abs(b - bgColor.B) < tol) {
                    rgbValues[i+3] = 0; // Transparent
                } else if (g > 150 && r < 120 && b < 120) {
                    // Fallback for bright green
                    rgbValues[i+3] = 0;
                }
            }
        }
        Marshal.Copy(rgbValues, 0, data.Scan0, bytes);
        bmp.UnlockBits(data);
        bmp.Save(outFile, ImageFormat.Png);
        bmp.Dispose();
    }
}
"@ -ReferencedAssemblies System.Drawing

try {
    $pathIn = "C:\Users\Lnx\.gemini\antigravity\brain\28af9d66-f2fe-4343-8dbc-d4cc3fa0133a\rottweiler_green_1773459885340.png"
    $pathOut = "C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_clean.png"
    [ImageProcessorClean]::RemoveBackground($pathIn, $pathOut)
    Write-Host "Success"
} catch {
    Write-Host "Error: $_"
}
