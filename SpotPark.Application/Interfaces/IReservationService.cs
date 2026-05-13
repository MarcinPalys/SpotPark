using SpotPark.Application.DTOs.Reservations;

namespace SpotPark.Application.Interfaces;

public interface IReservationService
{
    Task<IEnumerable<ReservationResponse>> GetUserReservationsAsync(string userId);
    Task<ReservationResponse?> GetByIdAsync(int id, string userId);
    Task<(ReservationResponse? Reservation, string? Error)> CreateAsync(string driverId, CreateReservationRequest request);
    Task<bool> CancelAsync(int id, string userId);
}
