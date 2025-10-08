using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MusicApi.Models;

namespace MusicApi.ModelConfigurations;

public class AlbumConfiguration : IEntityTypeConfiguration<Album>
{
    public void Configure(EntityTypeBuilder<Album> builder)
    {
        builder.ToTable("albums");

        builder.HasKey(a => a.Id);

        builder.HasMany(a => a.Musics)
               .WithOne()
               .HasForeignKey(m => m.AlbumId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}