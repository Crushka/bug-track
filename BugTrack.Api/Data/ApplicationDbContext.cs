using Microsoft.EntityFrameworkCore;
using BugTrack.Api.Entities;

namespace BugTrack.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){}
    public DbSet<User> Users { get; set; }
    public DbSet<QA> QAs { get; set; }
    public DbSet<Developer> Developers { get; set; }

    public DbSet<FixReview> FixReviews { get; set; }
    public DbSet<QAReview> QAReviews { get; set; }
    public DbSet<LeadReview> LeadReviews { get; set; }

    public DbSet<Project> Projects { get; set; }
    public DbSet<Team> Teams { get; set; }

    public DbSet<Chat> Chats { get; set; }
    public DbSet<Message> Messages { get; set; }

    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<FixSubmission> FixSubmissions { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<DeadlineChangeRequest> DeadlineChangeRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}