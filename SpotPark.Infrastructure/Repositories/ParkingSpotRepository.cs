using Microsoft.EntityFrameworkCore;
using SpotPark.Domain.Entities;
using SpotPark.Domain.Enums;
using SpotPark.Domain.Interfaces.Repositories;
using SpotPark.Infrastructure.Persistence;

namespace SpotPark.Infrastructure.Repositories;

public class ParkingSpotRepository : Repository<ParkingSpot>, IParkingSpotRepository
{
    private readonly SpotParkDbContext _context;

    public ParkingSpotRepository(SpotParkDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ParkingSpot>> GetAllWithDetailsAsync()
    {
        return await _context.ParkingSpots
            .Include(p => p.Images)
            .Include(p => p.Reviews)
            .ToListAsync();
    }

    public async Task<ParkingSpot?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.ParkingSpots
            .Where(p => p.Id == id)
            .Include(p => p.Images)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<ParkingSpot>> GetByLocationAsync(double latitude, double longitude, double radiusKm)
    {
        var spots = await _context.ParkingSpots.Include(p => p.Images).ToListAsync();
        return spots.Where(p => CalculateDistance(p.Latitude, p.Longitude, latitude, longitude) <= radiusKm);
    }

    public async Task<IEnumerable<ParkingSpot>> GetAvailableByDateAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.ParkingSpots
            .Where(p => p.IsAvailable && !p.Reservations.Any(r =>
                r.Status != ReservationStatus.Cancelled &&
                r.StartDate < endDate && r.EndDate > startDate))
            .Include(p => p.Images)
            .ToListAsync();
    }

    public async Task<IEnumerable<ParkingSpot>> GetByOwnerAsync(string userId)
    {
        return await _context.ParkingSpots
            .Where(p => p.OwnerId == userId)
            .Include(p => p.Images)
            .ToListAsync();
    }

    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = (lat2 - lat1) * Math.PI / 180.0;
        var dLon = (lon2 - lon1) * Math.PI / 180.0;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180.0) * Math.Cos(lat2 * Math.PI / 180.0) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return 6371 * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }
}
