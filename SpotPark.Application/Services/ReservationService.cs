using SpotPark.Application.DTOs.Reservations;
using SpotPark.Application.Interfaces;
using SpotPark.Domain.Entities;
using SpotPark.Domain.Enums;
using SpotPark.Domain.Interfaces.Repositories;

namespace SpotPark.Application.Services;

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IParkingSpotRepository _parkingSpotRepository;

    public ReservationService(IReservationRepository reservationRepository, IParkingSpotRepository parkingSpotRepository)
    {
        _reservationRepository = reservationRepository;
        _parkingSpotRepository = parkingSpotRepository;
    }

    public async Task<IEnumerable<ReservationResponse>> GetUserReservationsAsync(string userId)
    {
        var reservations = await _reservationRepository.GetByDriverAsync(userId);
        return reservations.Select(MapToResponse);
    }

    public async Task<ReservationResponse?> GetByIdAsync(int id, string userId)
    {
        var reservation = await _reservationRepository.GetByIdWithDetailsAsync(id);
        if (reservation == null || reservation.DriverId != userId) return null;
        return MapToResponse(reservation);
    }

    public async Task<(ReservationResponse? Reservation, string? Error)> CreateAsync(string driverId, CreateReservationRequest request)
    {
        if (request.StartDate >= request.EndDate)
            return (null, "Start date must be before end date");

        if (request.StartDate < DateTime.UtcNow)
            return (null, "Start date cannot be in the past");

        var spot = await _parkingSpotRepository.GetByIdAsync(request.ParkingSpotId);
        if (spot == null) return (null, "Parking spot not found");
        if (!spot.IsAvailable) return (null, "Parking spot is not available");

        var availableSpots = await _parkingSpotRepository.GetAvailableByDateAsync(request.StartDate, request.EndDate);
        if (!availableSpots.Any(s => s.Id == request.ParkingSpotId))
            return (null, "Parking spot is already reserved for the selected dates");

        var hours = (decimal)(request.EndDate - request.StartDate).TotalHours;
        var totalCost = Math.Round(hours * spot.PricePerHour, 2);

        var reservation = new Reservation
        {
            DriverId = driverId,
            ParkingSpotId = request.ParkingSpotId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TotalCost = totalCost,
            Status = ReservationStatus.Confirmed
        };

        await _reservationRepository.AddAsync(reservation);
        await _reservationRepository.SaveChangesAsync();

        reservation.ParkingSpot = spot;
        return (MapToResponse(reservation), null);
    }

    public async Task<bool> CancelAsync(int id, string userId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id);
        if (reservation == null || reservation.DriverId != userId) return false;
        if (reservation.Status is ReservationStatus.Cancelled or ReservationStatus.Completed) return false;

        reservation.Status = ReservationStatus.Cancelled;
        _reservationRepository.Update(reservation);
        await _reservationRepository.SaveChangesAsync();
        return true;
    }

    private static ReservationResponse MapToResponse(Reservation r) => new()
    {
        Id = r.Id,
        ParkingSpotId = r.ParkingSpotId,
        ParkingSpotTitle = r.ParkingSpot?.Title ?? string.Empty,
        ParkingSpotAddress = r.ParkingSpot?.Address ?? string.Empty,
        DriverId = r.DriverId,
        StartDate = r.StartDate,
        EndDate = r.EndDate,
        TotalCost = r.TotalCost,
        Status = r.Status,
        CreatedAt = r.CreatedAt
    };
}
