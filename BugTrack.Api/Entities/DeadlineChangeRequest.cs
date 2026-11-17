using BugTrack.Api.Entities.Enums;

namespace BugTrack.Api.Entities;

public class DeadlineChangeRequest
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public Guid TicketId { get; set; }

    public Ticket Ticket { get; set; } = null!;

    public Guid RequestedById { get; set; }

    public Developer RequestedBy { get; set; } = null!;

    public Guid ReviewerId { get; set; }

    public QA Reviewer { get; set; } = null!;

    public required DateTime PreviousDeadline { get; set; }

    public required DateTime NewDeadline { get; set; }

    public required string Reason { get; set; }

    public RequestStatus Status { get; set; }
        = RequestStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? DecidedAt { get; set; }
}