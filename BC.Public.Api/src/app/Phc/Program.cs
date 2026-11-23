// The public PHC API: GET /form (the open project and its choices) and POST /applications.
// No sign-in. It has its own spam checks and rate limits, sends the confirmation email, and
// reads and writes BC_Phc through a narrow SQL login. The rules are in the intake contract
// (architecture doc, PHC section).

using BC.Public.Phc.Data;
using BC.Public.Phc.Features.Applications;
using BC.Public.Phc.Features.Form;
using BC.Public.Phc.Shared.Email;
using BC.Public.Phc.Shared.Errors;
using BC.Public.Phc.Shared.Spam;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var generatingOpenApi = Assembly.GetEntryAssembly()?.GetName().Name == "GetDocument.Insider";

// Settings, checked at startup where a wrong value would otherwise fail quietly later.
var phcOptions = builder.Services.AddOptions<PhcOptions>()
    .Bind(builder.Configuration.GetSection(PhcOptions.Section))
    .ValidateDataAnnotations();
var emailOptions = builder.Services.AddOptions<EmailOptions>()
    .Bind(builder.Configuration.GetSection(EmailOptions.Section))
    .ValidateDataAnnotations();
if (!generatingOpenApi)
{
    phcOptions.ValidateOnStart();
    emailOptions.ValidateOnStart();
}
builder.Services.Configure<SpamOptions>(builder.Configuration.GetSection(SpamOptions.Section));
var spam = builder.Configuration.GetSection(SpamOptions.Section).Get<SpamOptions>() ?? new SpamOptions();

// Errors: services throw, the handler answers, always as problem-details JSON.
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

// Controllers. Validation errors are keyed by the JSON names ("firstName", not "FirstName"),
// the same as the errors the services add.
builder.Services
    .AddControllers(o => o.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider()))
    .AddJsonOptions(o => ConfigureJson(o.JsonSerializerOptions));
builder.Services.ConfigureHttpJsonOptions(o => ConfigureJson(o.SerializerOptions));
builder.Services.AddOpenApi();

// Form tokens are signed with Data Protection keys. On the server the keys must live in a folder
// that survives app pool recycles, or every open form's token stops working.
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("BC.Public.Phc");
var keysPath = builder.Configuration["DataProtection:KeysPath"];
if (!string.IsNullOrWhiteSpace(keysPath))
{
    dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keysPath));
}

builder.Services.AddPublicRateLimits(spam);

// PHC's database. No audit interceptor: the public login has no rights on the audit tables.
builder.Services.AddDbContext<PhcDbContext>(options => options
    .UseSqlServer(builder.Configuration.GetConnectionString("Phc")));

// Features and shared services
builder.Services.AddSingleton<FormTokens>();
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddScoped<FormService>();
builder.Services.AddScoped<ApplicationService>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseRateLimiter();
app.MapControllers();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.Run();

static void ConfigureJson(JsonSerializerOptions options)
{
    options.Converters.Add(new JsonStringEnumConverter());
    // Numbers must be sent as numbers, so the API description says "number", not "number or string".
    options.NumberHandling = JsonNumberHandling.Strict;
}
