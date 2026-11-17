namespace BugTrack.Api.Entities;

public class Project
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public required string Description { get; set; }

    public string? GitLink { get; set; }

    public Guid? TesterId { get; set; }

    public QA? Tester { get; set; }

    public Team Team { get; set; } = null!;

    public ICollection<Ticket> Tickets { get; set; }
        = new List<Ticket>();
}