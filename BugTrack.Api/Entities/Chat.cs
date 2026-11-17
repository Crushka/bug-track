namespace BugTrack.Api.Entities;

public class Chat
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public Guid TeamId { get; set; }

    public Team Team { get; set; } = null!;

    public ICollection<Message> Messages { get; set; }
        = new List<Message>();
}