namespace BugTrack.Api.Entities;

public class Reservation
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public Guid TicketId { get; set; }

    public Ticket Ticket { get; set; } = null!;

    public Guid AssigneeId { get; set; }

    public Developer Assignee { get; set; } = null!;

    public Guid AssignedById { get; set; }

    public Developer AssignedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? EndedAt { get; set; }
}