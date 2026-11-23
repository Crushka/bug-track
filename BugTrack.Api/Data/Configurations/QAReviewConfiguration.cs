using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;
public class QAReviewConfiguration : IEntityTypeConfiguration<QAReview>
{
    public void Configure(EntityTypeBuilder<QAReview> builder)
    {
        builder.Property(r => r.ReviewerId)
            .HasColumnName("QAReviewerId");

        builder.HasOne(r => r.Reviewer)
            .WithMany()
            .HasForeignKey(r => r.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}