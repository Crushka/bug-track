using BugTrack.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace BugTrack.Api.Services;

public sealed record UserProfile(string Name, string Role);

public interface IUserProfileService
{
    Task<UserProfile?> GetAsync(Guid userId, CancellationToken cancellationToken);
}

public sealed class UserProfileService(ApplicationDbContext db) : IUserProfileService
{
    public Task<UserProfile?> GetAsync(Guid userId, CancellationToken cancellationToken)
    {
        return db.Users
            .Where(user => user.Id == userId)
            .Select(user => new UserProfile(
                user.Name,
                EF.Property<string>(user, "Discriminator")))
            .SingleOrDefaultAsync(cancellationToken);
    }
}