using SpotPark.Application.DTOs.ParkingSpots;

namespace SpotPark.Application.Interfaces;

public interface IParkingSpotService
{
    Task<IEnumerable<ParkingSpotResponse>> GetAllAsync();
    Task<ParkingSpotResponse?> GetByIdAsync(int id);
    Task<ParkingSpotResponse> CreateAsync(string ownerId, CreateParkingSpotRequest request);
    Task<ParkingSpotResponse?> UpdateAsync(int id, string ownerId, UpdateParkingSpotRequest request);
    Task<bool> DeleteAsync(int id, string ownerId);
    Task<IEnumerable<ParkingSpotResponse>> SearchByLocationAsync(double latitude, double longitude, double radiusKm);
    Task<IEnumerable<ParkingSpotResponse>> GetByOwnerAsync(string ownerId);
}
