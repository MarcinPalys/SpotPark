namespace SpotPark.Application.DTOs.ParkingSpots;

public class UpdateParkingSpotRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
    public bool IsAvailable { get; set; }
}
