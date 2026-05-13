namespace SpotPark.Application.Interfaces;

public interface IIdentityService
{
    Task<(bool Success, string UserId, IEnumerable<string> Errors)> CreateUserAsync(
        string email, string password, string firstName, string lastName);

    Task<(bool Success, string UserId)> ValidateUserAsync(string email, string password);

    Task<(string Id, string Email, string FirstName, string LastName, string? ProfileImageUrl, DateTime CreatedAt)?> GetUserByIdAsync(string userId);

    Task<bool> UpdateUserAsync(string userId, string firstName, string lastName);
}
