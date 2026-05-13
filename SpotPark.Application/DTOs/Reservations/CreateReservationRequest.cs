namespace SpotPark.Application.DTOs.Reservations;

public class CreateReservationRequest
{
    public int ParkingSpotId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
