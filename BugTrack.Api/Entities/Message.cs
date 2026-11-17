namespace BugTrack.Api.Entities;

public class Message
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public required string Text { get; set; }

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public Guid ChatId { get; set; }

    public Chat Chat { get; set; } = null!;

    public Guid AuthorId { get; set; }

    public User Author { get; set; } = null!;

    public ICollection<Attachment> Attachments { get; set; }
        = new List<Attachment>();
}