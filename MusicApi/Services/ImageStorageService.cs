namespace MusicApi.Services;

public class ImageStorageService
{
    public async Task<byte[]> GetImageAsync(string filename)
    {
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        var filePath = Path.Combine(uploadsFolder, filename);

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("File not found.", filePath);
        }

        return await File.ReadAllBytesAsync(filePath);
    }

    public async Task<string> SaveImageAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream, cancellationToken);
        }

        return uniqueFileName;
    }
}