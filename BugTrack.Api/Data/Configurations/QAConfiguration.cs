using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class QAConfiguration : IEntityTypeConfiguration<QA>
{
    public void Configure(EntityTypeBuilder<QA> builder)
    {
        builder.HasMany(qa => qa.TestedProjects)
            .WithOne(p => p.Tester)
            .HasForeignKey(p => p.TesterId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(qa => qa.CreatedTickets)
            .WithOne(t => t.Author)
            .HasForeignKey(t => t.AuthorId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}