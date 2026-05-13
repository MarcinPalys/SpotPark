using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpotPark.Application.DTOs.ParkingSpots;
using SpotPark.Application.Interfaces;

namespace SpotPark.Controllers;

[ApiController]
[Route("api/parking-spots")]
public class ParkingSpotController : ControllerBase
{
    private readonly IParkingSpotService _service;

    public ParkingSpotController(IParkingSpotService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParkingSpotResponse>>> GetAll()
    {
        var spots = await _service.GetAllAsync();
        return Ok(spots);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ParkingSpotResponse>> GetById(int id)
    {
        var spot = await _service.GetByIdAsync(id);
        return spot == null ? NotFound() : Ok(spot);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ParkingSpotResponse>>> Search(
        [FromQuery] double lat,
        [FromQuery] double lng,
        [FromQuery] double radius = 5.0)
    {
        var spots = await _service.SearchByLocationAsync(lat, lng, radius);
        return Ok(spots);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ParkingSpotResponse>>> GetMySpots()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var spots = await _service.GetByOwnerAsync(userId);
        return Ok(spots);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ParkingSpotResponse>> Create([FromBody] CreateParkingSpotRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var spot = await _service.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetById), new { id = spot.Id }, spot);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ParkingSpotResponse>> Update(int id, [FromBody] UpdateParkingSpotRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var spot = await _service.UpdateAsync(id, userId, request);
        return spot == null ? NotFound() : Ok(spot);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var deleted = await _service.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }
}
