using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class DeveloperConfiguration : IEntityTypeConfiguration<Developer>
{
    public void Configure(EntityTypeBuilder<Developer> builder)
    {
        builder.HasMany(d => d.Reservations)
            .WithOne(r => r.Assignee)
            .HasForeignKey(r => r.AssigneeId)
            .IsRequired(true)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.CreatedReservations)
            .WithOne(r => r.AssignedBy)
            .HasForeignKey(r => r.AssignedById)
            .IsRequired(true)
            .OnDelete(DeleteBehavior.Restrict);
    }
}