using BugTrack.Api.Entities.Enums;

namespace BugTrack.Api.Entities;

public class Ticket
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public required string Description { get; set; }

    public List<string> ReproSteps { get; set; } = new List<string>();

    public required Priority Priority { get; set; }

    public TicketStatus Status { get; set; } = TicketStatus.Open;

    public required DateTime Deadline { get; set; }

    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    public Guid AuthorId { get; set; }

    public QA Author { get; set; } = null!;

    public Reservation? Reservation { get; set; }

    public ICollection<FixSubmission> FixSubmissions { get; set; }
        = new List<FixSubmission>();
    
    public ICollection<Attachment> Attachments { get; set; }
        = new List<Attachment>();
}