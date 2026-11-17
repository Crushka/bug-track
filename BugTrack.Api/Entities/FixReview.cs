using BugTrack.Api.Entities.Enums;

namespace BugTrack.Api.Entities;

public abstract class FixReview
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public ReviewDecision Decision { get; set; }
        = ReviewDecision.Pending;

    public string? Reason { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public Guid FixSubmissionId { get; set; }

    public FixSubmission FixSubmission { get; set; } = null!;
}