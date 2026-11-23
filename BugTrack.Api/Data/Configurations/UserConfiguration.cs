using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Login)
            .IsUnique();
        
        builder.HasDiscriminator<string>("Discriminator")
            .HasValue<QA>(nameof(QA))
            .HasValue<Developer>(nameof(Developer));
    }
}