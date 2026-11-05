# SpotPark - Aplikacja do wynajmu miejsc parkingowych

## 📋 Opis projektu
SpotPark to aplikacja webowa ułatwiająca wynajęcie prywatnych miejsc parkingowych. Kierowcy mogą szybko znaleźć miejsce parkingowe na mapie, a gospodarze mogą wynajem swoje puste miejsca zarabiając na tym.

Projekt jest realizowany jako **praca inżynierska** przez dwuosobowy zespół.

---

## 👥 Podział pracy w zespole — ZASADY OBOWIĄZUJĄCE AGENTA

> ⚠️ **WAŻNE — PRZECZYTAJ PRZED JAKĄKOLWIEK ZMIANĄ W KODZIE**
>
> Projekt jest realizowany przez dwie osoby, każda z nich ma ściśle wydzieloną odpowiedzialność. Agent Claude Code **musi respektować ten podział** i nie wolno mu wprowadzać zmian poza przydzielonym obszarem.

### 🧑‍💻 Marcin — Backend
- **Email**: marcinpatys40@gmail.com
- **Odpowiedzialność**: Warstwa serwerowa, baza danych, API, logika biznesowa
- **Zakres pracy**:
  - Cały katalog `SpotPark.Api/` (Controllers, Models, Services, Implementations, Repositories, DTOs, Data, Extensions, ExceptionHandling, Program.cs, appsettings.json)
  - Migracje Entity Framework Core i schemat bazy danych PostgreSQL
  - Konfiguracja autentykacji (ASP.NET Core Identity + JWT)
  - Integracje zewnętrzne po stronie backendu (Przelewy24, Cloudinary — część serwerowa)
  - Testy jednostkowe i integracyjne backendu (xUnit)

### 🎨 Damian — Frontend
- **Imię i nazwisko**: Damian Juruś
- **Email**: damian.jurus03@gmail.com
- **Git username**: Damian09876
- **Odpowiedzialność**: Interfejs użytkownika, logika kliencka, integracja z API
- **Zakres pracy**:
  - Cały katalog `spotpark-frontend/` (components, pages, services, context, styles, hooks, utils)
  - Konfiguracja Vite, `package.json`, `.env` (zmienne frontendowe)
  - Routing (React Router DOM), zarządzanie stanem, AuthContext
  - Integracja Google Maps (część kliencka), formularze, UX, style CSS/SCSS
  - Wywołania API przez Axios (konsumpcja endpointów przygotowanych przez Marcina)
  - Testy UI (Cypress/Selenium)

### 🚦 Zasady dla agenta Claude Code

**Kiedy agent uruchamia się dla Marcina (backend):**
- ✅ Wolno: modyfikować pliki wyłącznie w `SpotPark.Api/` oraz pliki konfiguracyjne backendu
- ❌ Zabronione: dotykanie `spotpark-frontend/` (żadnych edycji komponentów React, stylów, konfiguracji Vite, package.json frontendu)
- 📖 Można: czytać kod frontendu wyłącznie do celów referencyjnych (np. żeby zrozumieć, jakich pól oczekuje klient w DTO) — ale **bez wprowadzania zmian**

**Kiedy agent uruchamia się dla Damiana (frontend):**
- ✅ Wolno: modyfikować pliki wyłącznie w `spotpark-frontend/` oraz pliki konfiguracyjne frontendu
- ❌ Zabronione: dotykanie `SpotPark.Api/` (żadnych edycji kontrolerów, serwisów, repozytoriów, modeli, migracji, DbContext, Program.cs)
- 📖 Można: czytać kod backendu wyłącznie do celów referencyjnych (np. żeby sprawdzić kształt DTO lub endpoint API) — ale **bez wprowadzania zmian**

### 🔍 Jak agent rozpozna, dla kogo pracuje

Agent powinien ustalić swoją rolę na początku sesji w następującej kolejności:
1. Sprawdzić git user:
   - `Marcin Pałys` lub email `marcinpatys40@gmail.com` → **Marcin → backend**
   - `Damian Juruś` / username `Damian09876` / email `damian.jurus03@gmail.com` → **Damian → frontend**
2. Jeśli kontekst rozmowy jasno wskazuje na jeden z obszarów (np. użytkownik mówi "popraw komponent React" → frontend; "dodaj endpoint" → backend)
3. **Zapytać użytkownika**, jeśli nadal nie jest to jednoznaczne: *"Jesteś Marcinem (backend) czy Damianem (frontend)?"*

Po ustaleniu roli agent **nie wprowadza zmian poza swoim obszarem** nawet jeśli zauważy błąd po drugiej stronie — zamiast tego powinien poinformować użytkownika, że problem jest w obszarze drugiego członka zespołu, i zasugerować kontakt.

### 🤝 Współpraca między członkami zespołu

- **Kontrakt API** (endpointy, DTO, kody statusu) jest wspólnym punktem styku — zmiany w nim powinny być komunikowane między Marcinem a Damianem poza narzędziem.
- Agent może pomóc w opisaniu kontraktu (np. wygenerować dokumentację endpointu z backendu, żeby frontend wiedział, co konsumować) — ale samej implementacji nie przenosi między obszarami.
- Repozytorium git jest wspólne — każdy commituje tylko swoje zmiany we własnym obszarze.

### 🔒 Techniczny bezpiecznik — hook PreToolUse

W `.claude/settings.json` zarejestrowany jest hook `PreToolUse` wywołujący `.claude/hooks/check-area-permissions.ps1`, który **twardo blokuje** próby edycji (`Edit`, `Write`, `MultiEdit`, `NotebookEdit`) w `SpotPark.Api/` gdy `git config user.email` / `user.name` wskazują na Damiana (`damian.jurus03@gmail.com`, `Damian Juruś`, `Damian09876`).

- **Marcin** — hook nie uruchamia blokady, pełny dostęp do obu obszarów.
- **Damian** — próba edycji backendu zwraca `permissionDecision: deny` z czytelnym komunikatem. Edycje w `spotpark-frontend/` i poza tymi dwoma obszarami nie są blokowane.

Wymogi techniczne hooka:
- Windows + `powershell.exe` (Windows PowerShell 5.1 lub nowszy) w PATH — standard na Windows 11.
- `git` w PATH (używany do odczytu `user.email` / `user.name`).

Jeśli hook zacznie blokować niesłusznie (np. Marcin omyłkowo skonfigurował lokalnie `user.email` zawierający `damian`) — sprawdź `git config user.email` i `git config user.name`. Hook można też podejrzeć/edytować przez slash command `/hooks` w Claude Code.

> ⚠️ Nawet gdyby hook został wyłączony lub ominięty, **zasada ustalona wyżej w tym pliku pozostaje obowiązująca** — podział ról jest regułą zespołową, nie tylko mechanizmem technicznym.

---

## 🛠️ Technologie

### Backend
- **Framework**: .NET 9 WebAPI (C#)
- **Baza danych**: PostgreSQL
- **ORM**: Entity Framework Core
- **Autentykacja**: ASP.NET Core Identity

### Frontend
- **Framework**: React (z Vite lub Create React App)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Mapy**: Google Maps React

### Usługi zewnętrzne
- **Google Maps Platform**: Maps API, Places API, Geocoding API
- **Płatności**: Przelewy24
- **Storage zdjęć**: Cloudinary
- **Hosting**: Chmura (Azure)

---

## 📁 Struktura projektu

```
spotpark/
├── SpotPark.Api/                 # .NET 9 WebAPI Backend
│   ├── Controllers/              # API Kontrolery (zależne od Services)
│   ├── Models/                   # Entity modele (User, ParkingSpot, itd.)
│   ├── Data/                     # DbContext i migracje
│   ├── Services/                 # Interfejsy serwisów
│   │   ├── IAuthService.cs
│   │   ├── IParkingSpotService.cs
│   │   ├── IReservationService.cs
│   │   ├── IPaymentService.cs
│   │   └── IUserService.cs
│   ├── Implementations/          # Implementacje serwisów
│   │   ├── AuthService.cs
│   │   ├── ParkingSpotService.cs
│   │   ├── ReservationService.cs
│   │   ├── PaymentService.cs
│   │   └── UserService.cs
│   ├── Repositories/             # Interfejsy repozytoriów (Pattern Repository)
│   │   ├── IRepository.cs (generic)
│   │   ├── IParkingSpotRepository.cs
│   │   └── IReservationRepository.cs
│   ├── Repositories/Implementations/
│   │   ├── Repository.cs (generic)
│   │   ├── ParkingSpotRepository.cs
│   │   └── ReservationRepository.cs
│   ├── DTOs/                     # Data Transfer Objects
│   ├── ExceptionHandling/        # Middleware obsługi wyjątków
│   ├── Extensions/               # Extension methods (DI setup)
│   ├── appsettings.json          # Konfiguracja (DB, API keys)
│   ├── Program.cs                # Konfiguracja aplikacji i DI Container
│   └── SpotPark.Api.csproj       # Plik projektu
│
├── spotpark-frontend/            # React Frontend
│   ├── src/
│   │   ├── components/           # Komponenty React
│   │   ├── pages/                # Strony (Login, Home, Dashboard)
│   │   ├── services/             # API calls (axios)
│   │   ├── context/              # AuthContext dla autoryzacji
│   │   ├── styles/               # CSS/SCSS
│   │   ├── App.jsx               # Główny komponent
│   │   └── main.jsx              # Entry point
│   ├── package.json              # Zależności
│   └── vite.config.js            # Konfiguracja Vite
│
├── .gitignore                    # Git ignore
└── README.md                     # Dokumentacja projektu
```

---

## 🔗 Dependency Injection & Service Layer Pattern

### Architektura bez silnych powiązań

Projekt będzie używać **DI Container** zabudowanego w .NET Core do zarządzania zależnościami:

```
Controller (HTTP layer)
    ↓ (zależy od)
IService (abstraction)
    ↓ (implementuje)
Service (business logic)
    ↓ (zależy od)
IRepository (abstraction)
    ↓ (implementuje)
Repository (data access)
    ↓ (zależy od)
DbContext (Entity Framework)
```

### Rejestracja usług w Program.cs

```csharp
// Program.cs - Example DI Configuration

var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<SpotParkDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<SpotParkDbContext>()
    .AddDefaultTokenProviders();

// Repositories - Rejestracja repozytoriów
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IParkingSpotRepository, ParkingSpotRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();

// Services - Rejestracja usług biznesowych
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IParkingSpotService, ParkingSpotService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IUserService, UserService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"])),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Przykład Service Layer z DI

**IAuthService.cs** (Interface)
```csharp
namespace SpotPark.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<bool> ValidateTokenAsync(string token);
    }
}
```

**AuthService.cs** (Implementation)
```csharp
namespace SpotPark.Api.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IRepository<User> _userRepository;

        // Dependency Injection - wszystkie zależności przez konstruktor
        public AuthService(
            UserManager<User> userManager,
            IConfiguration configuration,
            IRepository<User> userRepository)
        {
            _userManager = userManager;
            _configuration = configuration;
            _userRepository = userRepository;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Implementacja bez silnych powiązań
            var user = new User 
            { 
                UserName = request.Email, 
                Email = request.Email 
            };
            var result = await _userManager.CreateAsync(user, request.Password);
            
            if (result.Succeeded)
            {
                return new AuthResponse { Success = true, Message = "Registration successful" };
            }

            return new AuthResponse { Success = false, Errors = result.Errors.Select(e => e.Description) };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) return new AuthResponse { Success = false };

            var result = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!result) return new AuthResponse { Success = false };

            var token = GenerateJwtToken(user);
            return new AuthResponse { Success = true, Token = token };
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            // Logika walidacji tokena
            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: new[] { new Claim(ClaimTypes.NameIdentifier, user.Id) },
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
```

### Przykład Repository Pattern z Generic Repository

**IRepository.cs** (Generic Interface)
```csharp
namespace SpotPark.Api.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task SaveChangesAsync();
    }
}
```

**Repository.cs** (Generic Implementation)
```csharp
namespace SpotPark.Api.Repositories.Implementations
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly SpotParkDbContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(SpotParkDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
        }

        public async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
```

**IParkingSpotRepository.cs** (Specialized Interface)
```csharp
namespace SpotPark.Api.Repositories
{
    public interface IParkingSpotRepository : IRepository<ParkingSpot>
    {
        Task<IEnumerable<ParkingSpot>> GetByLocationAsync(double latitude, double longitude, double radiusKm);
        Task<IEnumerable<ParkingSpot>> GetAvailableByDateAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ParkingSpot>> GetByOwnerAsync(string userId);
    }
}
```

**ParkingSpotRepository.cs**
```csharp
namespace SpotPark.Api.Repositories.Implementations
{
    public class ParkingSpotRepository : Repository<ParkingSpot>, IParkingSpotRepository
    {
        private readonly SpotParkDbContext _context;

        public ParkingSpotRepository(SpotParkDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ParkingSpot>> GetByLocationAsync(double latitude, double longitude, double radiusKm)
        {
            // Logika wyszukiwania po lokalizacji
            return await _context.ParkingSpots
                .Where(p => CalculateDistance(p.Latitude, p.Longitude, latitude, longitude) <= radiusKm)
                .ToListAsync();
        }

        public async Task<IEnumerable<ParkingSpot>> GetAvailableByDateAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.ParkingSpots
                .Where(p => !p.Reservations.Any(r => 
                    r.StartDate <= endDate && r.EndDate >= startDate))
                .ToListAsync();
        }

        public async Task<IEnumerable<ParkingSpot>> GetByOwnerAsync(string userId)
        {
            return await _context.ParkingSpots
                .Where(p => p.OwnerId == userId)
                .ToListAsync();
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Haversine formula
            var dLat = (lat2 - lat1) * Math.PI / 180.0;
            var dLon = (lon2 - lon1) * Math.PI / 180.0;
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180.0) * Math.Cos(lat2 * Math.PI / 180.0) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return 6371 * c; // Radius of the earth in km
        }
    }
}
```

### Przykład Controller z DI

```csharp
namespace SpotPark.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Dependency Injection - zależność wstrzykiwana przez konstruktor
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            return response.Success ? Ok(response) : Unauthorized(response);
        }
    }
}
```

### Zalety DI w tym projekcie

✅ **Testowanie** - Łatwo mockować serwisy w testach jednostkowych  
✅ **Maintenance** - Zmiana implementacji bez modyfikacji kontrolerów  
✅ **Loosely Coupled** - Komponenty zależą od abstrakcji, nie od konkretnych klas  
✅ **Reusability** - Serwisy można używać w wielu kontrolerach  
✅ **Scalability** - Łatwo dodawać nowe usługi bez refaktoringu  
✅ **SOLID Principles** - Szczególnie Dependency Inversion Principle  

---

### Faza 1: Backend - Setup i Baza danych (2-3 tygodnie)
1. Utwórz projekt .NET 8 WebAPI w Visual Studio
2. Zainstaluj NuGet packages:
   - `Microsoft.EntityFrameworkCore`
   - `Npgsql.EntityFrameworkCore.PostgreSQL`
   - `Microsoft.AspNetCore.Identity`
   - `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
3. Skonfiguruj PostgreSQL connection string w `appsettings.json`
4. Utwórz Entity modele:
   - `User` (identyfikator, email, hasło, imię, nazwisko)
   - `ParkingSpot` (lokalizacja, cena, zdjęcia, opis, właściciel)
   - `Reservation` (kierowca, miejsce, data/godzina, koszt)
   - `Payment` (rezerwacja, kwota, status, metoda)
   - `Review` (ocena, komentarz)
5. Utwórz `DbContext` i przeprowadź migracje
6. Skonfiguruj CORS dla React'a

### Faza 2: Backend - API Endpoints (2-3 tygodnie)
Utwórz kontrolery z endpointami:

#### AuthController
```
POST   /api/auth/register          - Rejestracja użytkownika
POST   /api/auth/login             - Logowanie
POST   /api/auth/refresh-token     - Odświeżenie tokenu
POST   /api/auth/logout            - Wylogowanie
POST   /api/auth/forgot-password   - Odzyskiwanie hasła
```

#### ParkingSpotController
```
GET    /api/parking-spots                    - Lista miejsc z filtrowaniem
GET    /api/parking-spots/{id}               - Szczegóły miejsca
POST   /api/parking-spots                    - Dodanie nowego miejsca
PUT    /api/parking-spots/{id}               - Edycja miejsca
DELETE /api/parking-spots/{id}               - Usunięcie miejsca
GET    /api/parking-spots/search?lat&lng    - Wyszukiwanie po lokalizacji
```

#### ReservationController
```
GET    /api/reservations                     - Historia rezerwacji użytkownika
GET    /api/reservations/{id}                - Szczegóły rezerwacji
POST   /api/reservations                     - Utworzenie rezerwacji
PUT    /api/reservations/{id}/cancel         - Anulowanie rezerwacji
POST   /api/reservations/{id}/extend         - Przedłużenie rezerwacji
```

#### PaymentController
```
POST   /api/payments/create-transaction      - Inicjowanie płatności (Przelewy24)
GET    /api/payments/{id}/status             - Status płatności
POST   /api/payments/webhook                 - Webhook od Przelewy24
```

#### UserController
```
GET    /api/users/profile                    - Profil użytkownika
PUT    /api/users/profile                    - Edycja profilu
GET    /api/users/{id}/earnings              - Zarobki (dla gospodarzy)
GET    /api/users/{id}/reviews               - Opinie użytkownika
```

### Faza 3: Frontend - Setup i Autentykacja (1-2 tygodnie)
1. Utwórz projekt React z Vite
2. Zainstaluj zależności
3. Skonfiguruj routing (React Router)
4. Utwórz `AuthContext` do zarządzania autentykacją
5. Strony:
   - Rejestracja (`/register`)
   - Logowanie (`/login`)
   - Odzyskiwanie hasła (`/forgot-password`)
   - Home Page (`/`)

### Faza 4: Frontend - Mapa i Wyszukiwanie (2 tygodnie)
1. Integracja Google Maps API
2. Wyświetlanie pinezek (publiczne vs. prywatne)
3. Wyszukiwarka adresów
4. Filtrowanie (cena, dostępność)
5. Szczegółowy widok miejsca

### Faza 5: Frontend - Rezerwacje i Panel użytkownika (2 tygodnie)
1. Formularz rezerwacji
2. Potwierdzenie rezerwacji
3. Panel użytkownika:
   - Historia rezerwacji
   - Aktywne najmy
   - Zarobki (dla gospodarzy)
4. Zarządzanie ofertą

### Faza 6: Integracja Przelewy24 i Cloudinary (1 tydzień)
1. Integracja bramki płatności
2. Upload zdjęć do Cloudinary
3. Widok potwierdzenia płatności

### Faza 7: Testy i Wdrożenie (1-2 tygodnie)
1. Testy jednostkowe (xUnit dla C#)
2. Testy integracyjne
3. Testy UI (Selenium/Cypress)
4. Wdrożenie na serwer produkcyjny

---

## 🔐 Wymogi funkcjonalne

- ✅ Autoryzacja: Rejestracja, logowanie, odzyskiwanie hasła
- ✅ Interaktywna mapa z pinezkami
- ✅ Filtrowanie miejsc po cenie i dostępności
- ✅ Dodawanie i zarządzanie ofertami (gospodarz)
- ✅ Rezerwacja miejsc (kierowca)
- ✅ System płatności (Przelewy24)
- ✅ Panel użytkownika z historią
- ✅ Przechowywanie zdjęć (Cloudinary)

---

## ⚙️ Wymogi niefunkcjonalne

- **Wydajność**: Ładowanie mapy < 2-3 sekundy na mobilnych, obsługa 100 zapytań/minutę
- **Bezpieczeństwo**: Szyfrowanie haseł, zgodność z RODO, HTTPS
- **UI/UX**: Mobile First design, duże przyciski, intuicyjny interfejs
- **Skalowanie**: Aplikacja powinna obsługiwać wzrost liczby użytkowników

---

## 🔧 Konfiguracja i zmienne środowiska

### Backend - appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=spotpark;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "SecretKey": "your_secret_key_min_32_chars",
    "ExpirationMinutes": 60
  },
  "GoogleMaps": {
    "ApiKey": "your_google_maps_api_key"
  },
  "Przelewy24": {
    "MerchantId": "your_merchant_id",
    "ApiKey": "your_api_key",
    "Sandbox": true
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  }
}
```

### Frontend - .env
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 📝 Konwencje kodowania

### Backend (C#)
- PascalCase dla nazw klas, metod, właściwości
- camelCase dla zmiennych lokalnych
- Komentarze w angielskim
- Struktura folderów: Controllers, Models, Services, Data, DTOs
- Entity Framework migrations

### Frontend (React)
- PascalCase dla nazw komponentów
- camelCase dla zmiennych i funkcji
- Functional components + React Hooks
- Struktura: components, pages, services, context, styles
- Axios interceptors dla API calls

### Git Commits
- Po angielsku
- Format: `[Faza] Opis zmiany`
- Przykład: `[Backend] Add ParkingSpot controller endpoints`

---

## 🚀 Polecenia startowe

### Backend
```bash
cd SpotPark.Api
dotnet restore
dotnet ef database update
dotnet run
# Server: http://localhost:5000
```

### Frontend
```bash
cd spotpark-frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

---

## 📞 Kontakt i dokumentacja

- API Documentation: Swagger UI (http://localhost:5000/swagger)
- Specyfikacja projektu: /docs/SpotPark_specification.pdf
- Status: W trakcie realizacji

---

## ✅ Checklist - Przed uruchomieniem

- [ ] PostgreSQL zainstalowany i uruchomiony
- [ ] Visual Studio z .NET 8 SDK
- [ ] Node.js i npm zainstalowane
- [ ] Google Maps API key
- [ ] Konto Przelewy24 (sandbox)
- [ ] Konto Cloudinary
- [ ] Zmienne środowiska skonfigurowane