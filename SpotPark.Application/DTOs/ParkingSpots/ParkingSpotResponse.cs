namespace SpotPark.Application.DTOs.ParkingSpots;

public class ParkingSpotResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public decimal PricePerHour { get; set; }
    public bool IsAvailable { get; set; }
    public string OwnerId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<string> ImageUrls { get; set; } = [];
    public double? AverageRating { get; set; }
    public int ReviewCount { get; set; }
}
