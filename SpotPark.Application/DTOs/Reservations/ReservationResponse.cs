using SpotPark.Domain.Enums;

namespace SpotPark.Application.DTOs.Reservations;

public class ReservationResponse
{
    public int Id { get; set; }
    public int ParkingSpotId { get; set; }
    public string ParkingSpotTitle { get; set; } = string.Empty;
    public string ParkingSpotAddress { get; set; } = string.Empty;
    public string DriverId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalCost { get; set; }
    public ReservationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
