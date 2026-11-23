using BugTrack.Api.Data;
using BugTrack.Api.Entities;
using BugTrack.Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = Path.Combine(AppContext.BaseDirectory, "wwwroot")
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/autoriztion/autorization.html";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;
    });
builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();

    var testPassword = app.Configuration["LocalTestUserPassword"];

    if (app.Environment.IsDevelopment()
        && !string.IsNullOrEmpty(testPassword)
        && !context.Users.Any(user => user.Login == "test-qa"))
    {
        var user = new QA { Login = "test-qa", Name = "ТестовыйQA", PasswordHash = "" };
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

        user.PasswordHash = passwordHasher.HashPassword(user, testPassword);
        context.Users.Add(user);
        context.SaveChanges();
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();