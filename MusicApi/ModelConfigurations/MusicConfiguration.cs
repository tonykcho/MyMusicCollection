using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MusicApi.Models;

namespace MusicApi.ModelConfigurations;

public class MusicConfiguration : IEntityTypeConfiguration<Music>
{
    public void Configure(EntityTypeBuilder<Music> builder)
    {
        builder.ToTable("musics");

        builder.HasKey(m => m.Id);
    }
}
