namespace WebApp;

public static class SpecialRoutes
{
  public static void Start()
  {
    App.MapPost("/api/send-email", (
      HttpContext context,
      JsonElement bodyJson
    ) =>
    {
      var body = JSON.Parse(bodyJson.ToString());

      // get values form the body
      string email = body.email?? "";
      string movieName = body.movieName?? "Film namn";
      string selectedSeats = body.selectedSeats?? "Inga platser valda";
      // amount of tickets
    // Ticket counts - med bättre felhantering
    int childCount = 0;
    int adultCount = 0;
    int seniorCount = 0;
    int totalTickets = 0;
    
    // Försök parse:a varje värde
    if (body.childCount != null) int.TryParse(body.childCount.ToString(), out childCount);
    if (body.adultCount != null) int.TryParse(body.adultCount.ToString(), out adultCount);
    if (body.seniorCount != null) int.TryParse(body.seniorCount.ToString(), out seniorCount);
    if (body.totalTickets != null) int.TryParse(body.totalTickets.ToString(), out totalTickets);



      try
      {
        string subject = $"Bokningsbekräftelse – {movieName}, [Datum]";
        string htmlBody = $@"
          <h1>Hej!</h1>

          <h3>Tack för din bokning hos CineSharp. Nedan finner du en sammanfattning av din reservation:</h3>
          
          <h2>Bokningsinformation</h2>

          <p><strong>Film:</strong> {movieName}</p>
          <p><strong>Datum:</strong> [Datum]</p>
          <p><strong>Tid:</strong> [Starttid]</p>
          <p><strong>Antal biljetter:</strong> {totalTickets} </p>
          <p><strong>Plats/Platser:</strong> {selectedSeats}</p>
          <p><strong>Salong:</strong> 1 </p>
          <br>

          <h2>Adress till biografen</h2>
          <p>CineSharp AB</p>
          <p>Linjegatan 12,</p>
          <p>302 50, Halmstad</p>

          <hr>
          <p><strong>Vänligen visa denna bekräftelse vid ankomst. Insläpp påbörjas cirka [X] minuter innan föreställningen.</strong></p>

          <br>

          <p>För frågor eller ändringar, kontakta oss gärna på:</p>
          <p>cinesharp.info@gmail.com</p>

          <br>

          <p>Tack för att du valt CineSharp. Vi ser fram emot att välkomna dig till föreställningen.</p>
          <p>Referens nummer: placeholder</p>

          <p>Avboka</p>

          <br>
        
          <p>Vänliga hälsningar,</p>
          <p>CineSharp AB</p>
          
        ";

        EmailService.SendEmail(email, subject, htmlBody);
      }
      catch (Exception ex)
      {
        Console.WriteLine("Mail misslyckades: " + ex.Message);
      }
    });
  }
}