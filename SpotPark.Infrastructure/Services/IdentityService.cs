using Microsoft.AspNetCore.Identity;
using SpotPark.Application.Interfaces;
using SpotPark.Infrastructure.Identity;

namespace SpotPark.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<(bool Success, string UserId, IEnumerable<string> Errors)> CreateUserAsync(
        string email, string password, string firstName, string lastName)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName
        };

        var result = await _userManager.CreateAsync(user, password);
        return result.Succeeded
            ? (true, user.Id, [])
            : (false, string.Empty, result.Errors.Select(e => e.Description));
    }

    public async Task<(bool Success, string UserId)> ValidateUserAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            return (false, string.Empty);

        return (true, user.Id);
    }

    public async Task<(string Id, string Email, string FirstName, string LastName, string? ProfileImageUrl, DateTime CreatedAt)?> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;
        return (user.Id, user.Email!, user.FirstName, user.LastName, user.ProfileImageUrl, user.CreatedAt);
    }

    public async Task<bool> UpdateUserAsync(string userId, string firstName, string lastName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        user.FirstName = firstName;
        user.LastName = lastName;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }
}
