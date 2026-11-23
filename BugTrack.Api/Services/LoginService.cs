using BugTrack.Api.Data;
using BugTrack.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BugTrack.Api.Services;

public interface ILoginService
{
    Task<User?> AuthenticateAsync(
        string? login, string? password, CancellationToken cancellationToken);
}

public sealed class LoginService(
    ApplicationDbContext db,
    IPasswordHasher<User> passwordHasher) : ILoginService
{
    public async Task<User?> AuthenticateAsync(
        string? login, string? password, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(login) || string.IsNullOrEmpty(password))
            return null;
        
        var user = await db.Users.AsNoTracking()
            .SingleOrDefaultAsync(user => user.Login == login, cancellationToken);
        
        if (user is null) return null;

        try
        {
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            return result == PasswordVerificationResult.Failed ? null : user;
        }
        catch (FormatException)
        {
            return null;
        }
    }
}