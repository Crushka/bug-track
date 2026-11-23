using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.Property(t => t.Status)
            .HasConversion<string>();
        
        builder.Property(t => t.Priority)
            .HasConversion<string>();
        
        builder.HasMany(t => t.FixSubmissions)
            .WithOne(fs => fs.Ticket)
            .HasForeignKey(fs => fs.TicketId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.Attachments)
            .WithOne(a => a.Ticket)
            .HasForeignKey(a => a.TicketId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);
    }
}