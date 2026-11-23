using System.Security.Claims;
using BugTrack.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BugTrack.Api.Controllers;

public sealed record LoginRequest(string? Login, string? Password);

[ApiController]
[Route("api/auth")]
public sealed class AuthController(ILoginService loginService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    [Consumes("application/json")]
    public async Task<IActionResult> login(
        [FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await loginService.AuthenticateAsync(request.Login, request.Password, cancellationToken);

        if (user is null)
            return Unauthorized(new { message = "неверный логин или пароль" });
        
        var identity = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Login)
            ],
            CookieAuthenticationDefaults.AuthenticationScheme);
        
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity));
        
        return NoContent();
    }
}