using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpotPark.Application.DTOs.Users;
using SpotPark.Application.Interfaces;

namespace SpotPark.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    public UserController(IUserService service)
    {
        _service = service;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileResponse>> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var profile = await _service.GetProfileAsync(userId);
        return profile == null ? NotFound() : Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileResponse>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var profile = await _service.UpdateProfileAsync(userId, request);
        return profile == null ? NotFound() : Ok(profile);
    }
}
