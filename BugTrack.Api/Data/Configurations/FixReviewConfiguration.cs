using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class FixReviewConfiguration : IEntityTypeConfiguration<FixReview>
{
    public void Configure(EntityTypeBuilder<FixReview> builder)
    {
        builder.HasDiscriminator<string>("Discriminator")
            .HasValue<LeadReview>(nameof(LeadReview))
            .HasValue<QAReview>(nameof(QAReview));

        builder.HasIndex("FixSubmissionId", "Discriminator")
            .IsUnique();

        builder.Property(r => r.Decision)
            .HasConversion<string>();
        
        builder.HasOne(r => r.FixSubmission)
            .WithMany(fs => fs.Reviews)
            .HasForeignKey(r => r.FixSubmissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}