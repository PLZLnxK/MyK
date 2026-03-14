Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImageProcessorPerfect {
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
            
            int maxRB = Math.Max((int)r, (int)b);
            if (g > maxRB) {
                int greenness = g - maxRB;
                // If it's very green, make it fully transparent
                if (greenness > 40) {
                    rgbValues[i+3] = 0;
                }
                // If it's somewhat green (edge spill), reduce alpha to feather it
                else if (greenness > 10) {
                    // Reduce green channel slightly to kill the fringe
                    rgbValues[i+1] = (byte)maxRB; 
                    
                    int newAlpha = 255 - (greenness * 6);
                    if (newAlpha < 0) newAlpha = 0;
                    rgbValues[i+3] = (byte)newAlpha;
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
    $pathIn = "C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_green.png"
    $pathOut = "C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_perfect.png"
    [ImageProcessorPerfect]::RemoveBackground($pathIn, $pathOut)
    Write-Host "Success removing green background perfectly"
} catch {
    Write-Host "Error: $_"
}
