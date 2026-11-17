namespace BugTrack.Api.Entities;

public class FixSubmission
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public required string Description { get; set; }

    public Guid TicketId { get; set; }

    public Ticket Ticket { get; set; } = null!;

    public Guid DeveloperId { get; set; }

    public required string CommitUrl { get; set; }

    public Developer Developer { get; set; } = null!;

    public ICollection<FixReview> Reviews { get; set; }
        = new List<FixReview>();
    
    public ICollection<Attachment> Attachments { get; set; }
        = new List<Attachment>();
}