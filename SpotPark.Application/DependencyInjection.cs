using Microsoft.Extensions.DependencyInjection;
using SpotPark.Application.Interfaces;
using SpotPark.Application.Services;

namespace SpotPark.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
