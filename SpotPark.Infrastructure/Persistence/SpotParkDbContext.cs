using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SpotPark.Domain.Entities;
using SpotPark.Domain.Enums;
using SpotPark.Infrastructure.Identity;

namespace SpotPark.Infrastructure.Persistence;

public class SpotParkDbContext : IdentityDbContext<ApplicationUser>
{
    public SpotParkDbContext(DbContextOptions<SpotParkDbContext> options) : base(options) { }

    public DbSet<ParkingSpot> ParkingSpots { get; set; }
    public DbSet<ParkingSpotImage> ParkingSpotImages { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ParkingSpot>(e =>
        {
            e.Property(p => p.PricePerHour).HasColumnType("decimal(10,2)");
            e.HasOne<ApplicationUser>().WithMany().HasForeignKey(p => p.OwnerId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Reservation>(e =>
        {
            e.Property(r => r.TotalCost).HasColumnType("decimal(10,2)");
            e.HasOne<ApplicationUser>().WithMany().HasForeignKey(r => r.DriverId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Payment>(e =>
        {
            e.Property(p => p.Amount).HasColumnType("decimal(10,2)");
        });

        modelBuilder.Entity<Review>(e =>
        {
            e.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", "\"Rating\" BETWEEN 1 AND 5"));
            e.HasOne<ApplicationUser>().WithMany().HasForeignKey(r => r.AuthorId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
