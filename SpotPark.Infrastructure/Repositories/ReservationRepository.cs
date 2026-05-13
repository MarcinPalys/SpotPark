using Microsoft.EntityFrameworkCore;
using SpotPark.Domain.Entities;
using SpotPark.Domain.Interfaces.Repositories;
using SpotPark.Infrastructure.Persistence;

namespace SpotPark.Infrastructure.Repositories;

public class ReservationRepository : Repository<Reservation>, IReservationRepository
{
    private readonly SpotParkDbContext _context;

    public ReservationRepository(SpotParkDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reservation>> GetByDriverAsync(string driverId)
    {
        return await _context.Reservations
            .Where(r => r.DriverId == driverId)
            .Include(r => r.ParkingSpot)
            .Include(r => r.Payment)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetByParkingSpotAsync(int parkingSpotId)
    {
        return await _context.Reservations
            .Where(r => r.ParkingSpotId == parkingSpotId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Reservation?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Reservations
            .Where(r => r.Id == id)
            .Include(r => r.ParkingSpot)
            .Include(r => r.Payment)
            .FirstOrDefaultAsync();
    }
}
