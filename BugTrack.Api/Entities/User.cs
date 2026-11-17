namespace BugTrack.Api.Entities;

public abstract class User
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public required string Login { get; set; }

    public required string Name { get; set; }

    public required string PasswordHash { get; set; }
}