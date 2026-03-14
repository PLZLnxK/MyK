Add-Type -AssemblyName System.Drawing

try {
    $pathIn = "C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_3d.png"
    $pathOut = "C:\Users\Lnx\Documents\Web 14 febrero\img\ginger_3d_alpha.png"
    
    $img = [System.Drawing.Image]::FromFile($pathIn)
    $bmp = New-Object System.Drawing.Bitmap $img
    
    # Get the color of the top-left pixel (should be the solid background color)
    $bgColor = $bmp.GetPixel(0, 0)
    
    # Actually, let's manually clear pixels close to white to avoid hard edges,
    # or just use MakeTransparent which is fastest for pure white.
    $bmp.MakeTransparent([System.Drawing.Color]::White)
    
    $bmp.Save($pathOut, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    $bmp.Dispose()
    Write-Host "Success"
} catch {
    Write-Host "Error: $_"
}
