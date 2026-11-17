namespace BugTrack.Api.Entities;

public class Team
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public required string InviteCode { get; set; }

    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    public Guid LeaderId { get; set; }

    public Developer Leader { get; set; } = null!;

    public ICollection<Developer> Members { get; set; }
        = new List<Developer>();

    public Chat Chat { get; set; } = null!;
}