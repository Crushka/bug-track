using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class DeadlineChangeRequestConfiguration :IEntityTypeConfiguration<DeadlineChangeRequest>
{
    public void Configure(EntityTypeBuilder<DeadlineChangeRequest> builder)
    {
        builder.Property(dcr => dcr.Status)
            .HasConversion<string>();

        builder.HasOne(dcr => dcr.Ticket)
            .WithMany()
            .HasForeignKey(dcr => dcr.TicketId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(dcr => dcr.RequestedBy)
            .WithMany()
            .HasForeignKey(dcr => dcr.RequestedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(dcr => dcr.Reviewer)
            .WithMany()
            .HasForeignKey(dcr => dcr.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}