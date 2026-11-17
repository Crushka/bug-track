namespace BugTrack.Api.Entities;

public class Developer : User
{
    public Guid? TeamId { get; set; }

    public Team? Team { get; set; }

    public Team? LedTeam { get; set; }

    public ICollection<Reservation> Reservations { get; set; }
        = new List<Reservation>();

    public ICollection<Reservation> CreatedReservations { get; set; }
        = new List<Reservation>();
}