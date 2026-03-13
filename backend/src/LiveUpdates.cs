using System.Collections.Concurrent;

public static class LiveUpdates
{
  private static readonly ConcurrentDictionary<string, SseConnection> _connections = new();

  public static void Start()
  {
    // Start the background heartbeat when the app starts
    _ = StartHeartbeatAsync();

    App.MapGet("/api/remote-booking/{showingId}", async (string showingId) =>
    {
      await BroadcastUpdateAsync(showingId);
      return Results.Ok();
    });

    App.MapGet("/api/book-sse/{showingId}", async (HttpContext ctx, string showingId) =>
    {
      ctx.Response.ContentType = "text/event-stream";
      ctx.Response.Headers.CacheControl = "no-cache";
      ctx.Response.Headers.Connection = "keep-alive";

      var connectionId = Guid.NewGuid().ToString();
      var connection = new SseConnection(ctx, showingId);
      _connections[connectionId] = connection;

      try
      {
        await ctx.Response.WriteAsync(": welcome\n\n");
        await ctx.Response.Body.FlushAsync();

        // Wait until the client leaves
        await Task.Delay(Timeout.Infinite, ctx.RequestAborted);
      }
      catch (OperationCanceledException) { }
      finally
      {
        _connections.TryRemove(connectionId, out _);
      }
    });
  }

  private static async Task StartHeartbeatAsync()
  {
    using var timer = new PeriodicTimer(TimeSpan.FromSeconds(20));
    while (await timer.WaitForNextTickAsync())
    {
      foreach (var (_, conn) in _connections)
      {
        try
        {
          // SSE comments (starting with :) are ignored by the browser 
          // but keep the TCP connection active.
          await conn.Context.Response.WriteAsync(": heartbeat\n\n");
          await conn.Context.Response.Body.FlushAsync();
        }
        catch { /* Cleaned up by the endpoint's finally block */ }
      }
    }
  }

  private static async Task BroadcastUpdateAsync(string showingId)
  {
    foreach (var (_, conn) in _connections)
    {
      if (conn.ShowingId == showingId)
      {
        try
        {
          await conn.Context.Response.WriteAsync("data: {\"update\": true}\n\n");
          await conn.Context.Response.Body.FlushAsync();
        }
        catch { }
      }
    }
  }

  record SseConnection(HttpContext Context, string ShowingId);
}