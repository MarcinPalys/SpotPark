using SpotPark.Domain.Entities;

namespace SpotPark.Domain.Interfaces.Repositories;

public interface IParkingSpotRepository : IRepository<ParkingSpot>
{
    Task<IEnumerable<ParkingSpot>> GetByLocationAsync(double latitude, double longitude, double radiusKm);
    Task<IEnumerable<ParkingSpot>> GetAvailableByDateAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<ParkingSpot>> GetByOwnerAsync(string userId);
}
