using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
{
    public void Configure(EntityTypeBuilder<Attachment> builder)
    {
        builder.ToTable(t =>
        {
            t.HasCheckConstraint(
                "CK_Attachment_SingleOwner",
                """num_nonnulls("MessageId", "TicketId", "FixSubmissionId") = 1"""
            );
            t.HasCheckConstraint(
                "CK_Attachment_SizeBytes",
                """ "SizeBytes" >= 0 """
            );
        });
    }
}