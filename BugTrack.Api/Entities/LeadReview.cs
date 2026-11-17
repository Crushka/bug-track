namespace BugTrack.Api.Entities;

public class LeadReview : FixReview
{
    public Guid ReviewerId { get; set; }

    public Developer Reviewer { get; set; } = null!;
}