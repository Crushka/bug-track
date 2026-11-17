namespace BugTrack.Api.Entities;

public class QA : User
{
    public ICollection<Project> TestedProjects { get; set; }
        = new List<Project>();

    public ICollection<Ticket> CreatedTickets { get; set; }
        = new List<Ticket>();
}