using SpotPark.Application.DTOs.ParkingSpots;
using SpotPark.Application.Interfaces;
using SpotPark.Domain.Entities;
using SpotPark.Domain.Interfaces.Repositories;

namespace SpotPark.Application.Services;

public class ParkingSpotService : IParkingSpotService
{
    private readonly IParkingSpotRepository _repository;

    public ParkingSpotService(IParkingSpotRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ParkingSpotResponse>> GetAllAsync()
    {
        var spots = await _repository.GetAllWithDetailsAsync();
        return spots.Select(MapToResponse);
    }

    public async Task<ParkingSpotResponse?> GetByIdAsync(int id)
    {
        var spot = await _repository.GetByIdWithDetailsAsync(id);
        return spot == null ? null : MapToResponse(spot);
    }

    public async Task<ParkingSpotResponse> CreateAsync(string ownerId, CreateParkingSpotRequest request)
    {
        var spot = new ParkingSpot
        {
            Title = request.Title,
            Description = request.Description,
            Address = request.Address,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            PricePerHour = request.PricePerHour,
            OwnerId = ownerId
        };

        await _repository.AddAsync(spot);
        await _repository.SaveChangesAsync();

        return MapToResponse(spot);
    }

    public async Task<ParkingSpotResponse?> UpdateAsync(int id, string ownerId, UpdateParkingSpotRequest request)
    {
        var spot = await _repository.GetByIdAsync(id);
        if (spot == null || spot.OwnerId != ownerId) return null;

        spot.Title = request.Title;
        spot.Description = request.Description;
        spot.Address = request.Address;
        spot.PricePerHour = request.PricePerHour;
        spot.IsAvailable = request.IsAvailable;

        _repository.Update(spot);
        await _repository.SaveChangesAsync();

        return MapToResponse(spot);
    }

    public async Task<bool> DeleteAsync(int id, string ownerId)
    {
        var spot = await _repository.GetByIdAsync(id);
        if (spot == null || spot.OwnerId != ownerId) return false;

        _repository.Delete(spot);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<ParkingSpotResponse>> SearchByLocationAsync(double latitude, double longitude, double radiusKm)
    {
        var spots = await _repository.GetByLocationAsync(latitude, longitude, radiusKm);
        return spots.Select(MapToResponse);
    }

    public async Task<IEnumerable<ParkingSpotResponse>> GetByOwnerAsync(string ownerId)
    {
        var spots = await _repository.GetByOwnerAsync(ownerId);
        return spots.Select(MapToResponse);
    }

    private static ParkingSpotResponse MapToResponse(ParkingSpot spot) => new()
    {
        Id = spot.Id,
        Title = spot.Title,
        Description = spot.Description,
        Address = spot.Address,
        Latitude = spot.Latitude,
        Longitude = spot.Longitude,
        PricePerHour = spot.PricePerHour,
        IsAvailable = spot.IsAvailable,
        OwnerId = spot.OwnerId,
        CreatedAt = spot.CreatedAt,
        ImageUrls = spot.Images.Select(i => i.ImageUrl).ToList(),
        AverageRating = spot.Reviews.Any() ? spot.Reviews.Average(r => r.Rating) : null,
        ReviewCount = spot.Reviews.Count
    };
}
