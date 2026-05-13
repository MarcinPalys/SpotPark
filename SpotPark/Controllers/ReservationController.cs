using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpotPark.Application.DTOs.Reservations;
using SpotPark.Application.Interfaces;

namespace SpotPark.Controllers;

[ApiController]
[Route("api/reservations")]
[Authorize]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _service;

    public ReservationController(IReservationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReservationResponse>>> GetMyReservations()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var reservations = await _service.GetUserReservationsAsync(userId);
        return Ok(reservations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReservationResponse>> GetById(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var reservation = await _service.GetByIdAsync(id, userId);
        return reservation == null ? NotFound() : Ok(reservation);
    }

    [HttpPost]
    public async Task<ActionResult<ReservationResponse>> Create([FromBody] CreateReservationRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var (reservation, error) = await _service.CreateAsync(userId, request);
        if (error != null) return BadRequest(new { error });
        return CreatedAtAction(nameof(GetById), new { id = reservation!.Id }, reservation);
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var cancelled = await _service.CancelAsync(id, userId);
        return cancelled ? NoContent() : NotFound();
    }
}
