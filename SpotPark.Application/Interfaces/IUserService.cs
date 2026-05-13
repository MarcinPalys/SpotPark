using SpotPark.Application.DTOs.Users;

namespace SpotPark.Application.Interfaces;

public interface IUserService
{
    Task<UserProfileResponse?> GetProfileAsync(string userId);
    Task<UserProfileResponse?> UpdateProfileAsync(string userId, UpdateProfileRequest request);
}
