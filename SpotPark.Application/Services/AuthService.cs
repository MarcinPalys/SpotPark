using SpotPark.Application.DTOs.Auth;
using SpotPark.Application.Interfaces;

namespace SpotPark.Application.Services;

public class AuthService : IAuthService
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;

    public AuthService(IIdentityService identityService, ITokenService tokenService)
    {
        _identityService = identityService;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var (success, userId, errors) = await _identityService.CreateUserAsync(
            request.Email, request.Password, request.FirstName, request.LastName);

        if (!success)
            return new AuthResponse { Success = false, Errors = errors };

        var token = _tokenService.GenerateToken(userId, request.Email, request.FirstName, request.LastName);
        return new AuthResponse { Success = true, Token = token, Message = "Registration successful" };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var (success, userId) = await _identityService.ValidateUserAsync(request.Email, request.Password);

        if (!success)
            return new AuthResponse { Success = false, Message = "Invalid email or password" };

        var token = _tokenService.GenerateToken(userId, request.Email, string.Empty, string.Empty);
        return new AuthResponse { Success = true, Token = token };
    }
}
