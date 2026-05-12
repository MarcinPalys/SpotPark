namespace SpotPark.Domain.Entities;

public class ParkingSpotImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    public int ParkingSpotId { get; set; }
    public ParkingSpot ParkingSpot { get; set; } = null!;
}
