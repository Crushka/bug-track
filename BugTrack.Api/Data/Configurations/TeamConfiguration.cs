using BugTrack.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BugTrack.Api.Data.Configurations;

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.HasIndex(t => t.InviteCode)
            .IsUnique();

        builder.HasOne(t => t.Project)
            .WithOne(p => p.Team)
            .HasForeignKey<Team>(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Leader)
            .WithOne(d => d.LedTeam)
            .HasForeignKey<Team>(t => t.LeaderId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(t => t.Members)
            .WithOne(d => d.Team)
            .HasForeignKey(d => d.TeamId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}