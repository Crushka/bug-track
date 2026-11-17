using BugTrack.Api.Entities.Enums;

namespace BugTrack.Api.Entities;

public class Notification
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public Guid RecipientId { get; set; }

    public User Recipient { get; set; } = null!;

    public required NotificationType Type { get; set; }

    public required string Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReadAt { get; set; }

    public Guid? TicketId { get; set; }

    public Ticket? Ticket { get; set; }
}