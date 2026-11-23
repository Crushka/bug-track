using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class ChatConfiguration : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.HasMany(ch => ch.Messages)
            .WithOne(m => m.Chat)
            .HasForeignKey(m => m.ChatId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(ch => ch.Team)
            .WithOne(t => t.Chat)
            .HasForeignKey<Chat>(ch => ch.TeamId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}