using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace MusicApi.Extensions;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private const string AuthorizationHeaderName = "Authorization";
    private const string BasicSchemeName = "Basic";

    private readonly IConfiguration _configuration;

    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IConfiguration configuration)
        : base(options, logger, encoder)
    {
        _configuration = configuration;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey(AuthorizationHeaderName))
        {
            return AuthenticateResult.Fail("Missing Authorization Header");
        }

        if (AuthenticationHeaderValue.TryParse(Request.Headers[AuthorizationHeaderName]!, out var authHeader) == false)
        {
            return AuthenticateResult.Fail("Invalid Authorization Header");
        }

        if (authHeader.Scheme != BasicSchemeName)
        {
            return AuthenticateResult.Fail("Invalid Authorization Scheme");
        }

        var buffer = new Span<byte>(new byte[authHeader.Parameter?.Length ?? 0]);
        if (Convert.TryFromBase64String(authHeader.Parameter ?? string.Empty, buffer, out int bytesRead) == false)
        {
            return AuthenticateResult.Fail("Invalid Base64 Encoding");
        }

        var credentialBytes = buffer.Slice(0, bytesRead);
        var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);

        if (credentials.Length != 2)
        {
            return AuthenticateResult.Fail("Invalid Authorization Header");
        }

        var username = credentials[0];
        var password = credentials[1];


        await Task.Delay(50); // Simulate async work, e.g., database call
        var configUsername = _configuration["BasicAuth:Username"];
        var configPassword = _configuration["BasicAuth:Password"];

        if (username != configUsername || password != configPassword)
        {
            return AuthenticateResult.Fail("Invalid Username or Password");
        }

        Claim[] claims = new[] { new Claim(ClaimTypes.Name, username) };
        ClaimsIdentity identity = new ClaimsIdentity(claims, Scheme.Name);
        ClaimsPrincipal principal = new ClaimsPrincipal(identity);
        AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}