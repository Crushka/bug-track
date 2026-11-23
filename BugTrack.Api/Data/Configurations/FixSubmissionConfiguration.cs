using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class FixSubmissionConfiguration : IEntityTypeConfiguration<FixSubmission>
{
    public void Configure(EntityTypeBuilder<FixSubmission> builder)
    {
        builder.HasOne(fs => fs.Developer)
            .WithMany()
            .HasForeignKey(fs => fs.DeveloperId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(fs => fs.Attachments)
            .WithOne(a => a.FixSubmission)
            .HasForeignKey(a => a.FixSubmissionId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);
    }
}