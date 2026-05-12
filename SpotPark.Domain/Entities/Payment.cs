using SpotPark.Domain.Enums;

namespace SpotPark.Domain.Entities;

public class Payment
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? TransactionId { get; set; }
    public PaymentMethod Method { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int ReservationId { get; set; }
    public Reservation Reservation { get; set; } = null!;
}
