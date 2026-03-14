Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImageProcessorClean2 {
    public static void RemoveBackground(string inFile, string outFile) {
        Bitmap bmp = new Bitmap(inFile);
        
        BitmapData data = bmp.LockBits(new Rectangle(0, 0, bmp.Width, bmp.Height), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int bytes = Math.Abs(data.Stride) * bmp.Height;
        byte[] rgbValues = new byte[bytes];
        Marshal.Copy(data.Scan0, rgbValues, 0, bytes);
        
        for(int i=0; i<bytes; i+=4) {
            byte b = rgbValues[i];
            byte g = rgbValues[i+1];
            byte r = rgbValues[i+2];
            byte a = rgbValues[i+3];
            
            // Chroma Key Green is roughly: R < 80, G > 180, B < 80
            // Generously target green shades
            if (g > 150 && r <= 150 && b <= 150) {
                rgbValues[i+3] = 0; // Make Transparent
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
    [ImageProcessorClean2]::RemoveBackground($pathIn, $pathOut)
    Write-Host "Success removing green background"
} catch {
    Write-Host "Error: $_"
}
