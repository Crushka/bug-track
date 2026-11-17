namespace BugTrack.Api.Entities;

public class Attachment
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public required string FileName { get; set; }

    public required string StorageKey { get; set; }

    public required string MimeType { get; set; }

    public long SizeBytes { get; set; }

    public Guid? MessageId { get; set; }

    public Message? Message { get; set; }

    public Guid? TicketId { get; set; }

    public Ticket? Ticket { get; set; }

    public Guid? FixSubmissionId { get; set; }

    public FixSubmission? FixSubmission { get; set; }
}