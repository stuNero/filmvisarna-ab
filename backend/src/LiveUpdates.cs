using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

// --- In-memory chat state ---


public static class LiveUpdates
{

  public static void Start()
  {
    var bookedSeats = new List<BookedSeat>();
    var openConnections = new ConcurrentDictionary<string, SseConnection>();
    var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    // --- POST /api/chat-message  –  ta emot nytt meddelande ---

    App.MapPost("/api/booked-seat/", async (NewSeat input) =>
    {
      var seat = new BookedSeat(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(), input.SeatId, input.ShowingId, input.Occupied);

      lock (bookedSeats) { bookedSeats.Add(seat); }

      await BroadcastAsync();

      return Results.Json(new { status = "ok" });
    });

    // --- GET /api/chat-sse  –  öppna SSE-ström ---

    App.MapGet("/api/book-sse", async (HttpContext ctx) =>
    {
      // Sätt SSE-headers
      ctx.Response.ContentType = "text/event-stream";
      ctx.Response.Headers.CacheControl = "no-cache";
      ctx.Response.Headers.Connection = "keep-alive";

      // Stäng av output-buffring
      await ctx.Response.Body.FlushAsync();

      // Välkomstkommentar (SSE-kommentarer börjar med ':')
      await ctx.Response.WriteAsync(": welcome\n\n");
      await ctx.Response.Body.FlushAsync();

      // Registrera anslutningen
      var connectionId = Guid.NewGuid().ToString();
      var connection = new SseConnection(ctx, 0);
      openConnections[connectionId] = connection;

      try
      {
        // Skicka befintliga meddelanden direkt
        await BroadcastToConnectionAsync(connection);

        // Håll anslutningen öppen tills klienten stänger
        var tcs = new TaskCompletionSource();
        ctx.RequestAborted.Register(() => tcs.TrySetResult());
        await tcs.Task;
      }
      finally
      {
        openConnections.TryRemove(connectionId, out _);
      }
    });

    // --- Keepalive: skicka kommentar var 15:e sekund ---

    _ = Task.Run(async () =>
    {
      var timer = new PeriodicTimer(TimeSpan.FromSeconds(15));
      while (await timer.WaitForNextTickAsync())
      {
        foreach (var (_, conn) in openConnections)
        {
          try
          {
            await conn.Context.Response.WriteAsync(": keepalive\n\n");
            await conn.Context.Response.Body.FlushAsync();
          }
          catch { /* klienten har stängt */ }
        }
      }
    });


    // --- Broadcast-logik ---

    async Task BroadcastAsync()
    {
      foreach (var (_, conn) in openConnections)
      {
        await BroadcastToConnectionAsync(conn);
      }
    }

    async Task BroadcastToConnectionAsync(SseConnection conn)
    {
      List<BookedSeat> snapshot;
      lock (bookedSeats) { snapshot = bookedSeats.ToList(); }

      foreach (var booking in snapshot)
      {
        if (booking.Timestamp > conn.TimestampOfLastBooking)
        {
          var json = JsonSerializer.Serialize(booking, jsonOptions);
          try
          {
            await conn.Context.Response.WriteAsync($"data:{json}\n\n");
            await conn.Context.Response.Body.FlushAsync();
            conn.TimestampOfLastBooking = booking.Timestamp;
          }
          catch { /* klienten har stängt */ }
        }
      }
    }
  }

  // --- Modeller ---

  record NewSeat(int SeatId, int ShowingId, bool Occupied);
  record BookedSeat(long Timestamp, int SeatId, int ShowingId, bool Occupied);
  class SseConnection
  {
    public SseConnection(HttpContext context, long timestampOfLastBooking)
    {
      Context = context;
      TimestampOfLastBooking = timestampOfLastBooking;
    }

    public HttpContext Context { get; }
    public long TimestampOfLastBooking { get; set; }
  }
}
