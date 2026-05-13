using SpotPark.Application.DTOs.Users;
using SpotPark.Application.Interfaces;

namespace SpotPark.Application.Services;

public class UserService : IUserService
{
    private readonly IIdentityService _identityService;

    public UserService(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserProfileResponse?> GetProfileAsync(string userId)
    {
        var user = await _identityService.GetUserByIdAsync(userId);
        if (user == null) return null;

        return new UserProfileResponse
        {
            Id = user.Value.Id,
            Email = user.Value.Email,
            FirstName = user.Value.FirstName,
            LastName = user.Value.LastName,
            ProfileImageUrl = user.Value.ProfileImageUrl,
            CreatedAt = user.Value.CreatedAt
        };
    }

    public async Task<UserProfileResponse?> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var success = await _identityService.UpdateUserAsync(userId, request.FirstName, request.LastName);
        if (!success) return null;
        return await GetProfileAsync(userId);
    }
}
