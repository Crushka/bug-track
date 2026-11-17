namespace BugTrack.Api.Entities;

public class QAReview : FixReview
{
    public Guid ReviewerId { get; set; }

    public QA Reviewer { get; set; } = null!;
}