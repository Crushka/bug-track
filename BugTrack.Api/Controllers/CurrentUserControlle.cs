using System.Security.Claims;
using BugTrack.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BugTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/auth/me")]
public sealed class CurrentUserController(IUserProfileService profiles) : ControllerBase
{
    [HttpGet]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return Unauthorized();

        var profile = await profiles.GetAsync(userId, cancellationToken);

        if (profile is null)
            return Unauthorized();

        return Ok(profile);
    }
}