using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class LeadReviewConfiguration : IEntityTypeConfiguration<LeadReview>
{
    public void Configure(EntityTypeBuilder<LeadReview> builder)
    {
        builder.Property(r => r.ReviewerId)
            .HasColumnName("LeadReviewerId");

        builder.HasOne(r => r.Reviewer)
            .WithMany()
            .HasForeignKey(r => r.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}