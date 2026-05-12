using SpotPark.Domain.Entities;

namespace SpotPark.Domain.Interfaces.Repositories;

public interface IReservationRepository : IRepository<Reservation>
{
    Task<IEnumerable<Reservation>> GetByDriverAsync(string driverId);
    Task<IEnumerable<Reservation>> GetByParkingSpotAsync(int parkingSpotId);
}
