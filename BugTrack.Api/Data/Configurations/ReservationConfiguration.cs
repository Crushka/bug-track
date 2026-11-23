using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.HasIndex(r => r.TicketId)
            .IsUnique();

        builder.HasOne(r => r.Ticket)
            .WithOne(t => t.Reservation)
            .HasForeignKey<Reservation>(r => r.TicketId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
            
    }
}