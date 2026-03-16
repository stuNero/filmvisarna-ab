using System.ComponentModel.Design;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography.X509Certificates;
using Org.BouncyCastle.Asn1.X509.SigI;

namespace WebApp;

public static class SpecialRoutes
{

  private static string DOMAIN_IN_MAIL = "http://localhost:5173";

  public static void Start()
  {
    // special route for sending the recovery link for forgotten password
    App.MapPost("api/forgot-password/",
    (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());

      // finding user by email
      var user = SQLQueryOne(
        "SELECT * FROM users WHERE email = @email",
        new { body.email }
      );

      // visar medelande oavsett om user finns i databasen eller inte
      if (user == null)
      {
        return RestResult.Parse(context, new
        {
          message = "Om e-postadressen finns i systemet har en återställningslänk skickats"
        });
      }

      // creating reset token 
      var token = Guid.NewGuid().ToString();
      SQLQuery($"""
        INSERT INTO passwordResets (userId, token, expires)
        VALUES (@userId, @token, Date_Add(NOW(), INTERVAL 1 Hour))
      """,
      new
      {
        userId = user.id,
        token = token
      }
      );


      // send email with the reset link
      var resetLink = $"{DOMAIN_IN_MAIL}/återställ-lösenord?token={token}";
      var subject = "Återställ ditt lösenord";
      var htmlBody = $@"
      <h2>Återställ lösenord</h2>
      <p>Klicka på länken för att återställa ditt lösenord:</p>
      <a href='{resetLink}'>{resetLink}</a>
      <p>Länken är giltig i 1 timme.</p>

      <br>
      
      <p>Vänliga hälsningar,</p>
      <p>CineSharp AB</p>     
";

      EmailService.SendEmail(body.email, subject, htmlBody);
      return RestResult.Parse(context, new
      {
        message = "Om e-postadressen finns i systemet har en återställningslänk skickats"
      });
    });


    App.MapGet("/api/comingSoon", (
                HttpContext context, string table
            ) =>
            {
              var query = RestQuery.Parse(context.Request.Query);
              if (query.error != null)
              {
                return RestResult.Parse(context, Arr(Obj(new { error = query.error })));
              }

              var sql = $"""
                 SELECT f.* FROM showings s, films f
                 WHERE s.filmId = f.id
                 AND s.timeSlot >= NOW() + INTERVAL 15 MINUTE
                 AND s.timeSlot <= NOW() + INTERVAL 30 DAY
                 GROUP BY f.id
                 ; 
                 """ + query.sql;

              return RestResult.Parse(context, SQLQuery(sql, query.parameters, context));
            });

    App.MapPost("/api/send-confirm/{table}", (
            HttpContext context, string table, JsonElement bodyJson
        ) =>
        {
          var body = JSON.Parse(bodyJson.ToString());
          var parsed = ReqBodyParse(table, body);
          var columns = parsed.insertColumns;
          var values = parsed.insertValues;
          var sql = $"INSERT INTO {table}({columns}) VALUES({values})";
          var result = SQLQueryOne(sql, parsed.body, context);
          if (!result.HasKey("error"))
          {
            // Get the insert id and add to our result
            result.insertId = SQLQueryOne(
              @$"SELECT id AS __insertId 
              FROM {table} ORDER BY id DESC LIMIT 1"
            ).__insertId;
          }
          return RestResult.Parse(context, result);
        });


// special route for sending email when a users has confirmed and booked tickets.
    App.MapPost("/api/send-email", (
      HttpContext context,
      JsonElement bodyJson
    ) =>
    {
      // Deserialize JsonElement to dynamic object to access properties correctly
      var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
      var bodyDict = JsonSerializer.Deserialize<Dictionary<string, object>>(bodyJson.GetRawText(), options) ?? new();

      // get values form the body

      string bookingID = bodyDict.ContainsKey("bookingID") ? bodyDict["bookingID"]?.ToString() ?? "Boknings ID saknas" : "Boknings ID saknas";
      string email = bodyDict.ContainsKey("email") ? bodyDict["email"]?.ToString() ?? "" : "";
      string movieName = bodyDict.ContainsKey("movieName") ? bodyDict["movieName"]?.ToString() ?? "Film namn" : "Film namn";
      string selectedSeats = bodyDict.ContainsKey("selectedSeats") ? bodyDict["selectedSeats"]?.ToString() ?? "Inga platser valda" : "Inga platser valda";
      string date = bodyDict.ContainsKey("date") ? bodyDict["date"]?.ToString() ?? "Okänt datum" : "Okänt datum";
      string time = bodyDict.ContainsKey("time") ? bodyDict["time"]?.ToString() ?? "Okänt tid" : "Okänt tid";
      string venue = bodyDict.ContainsKey("venue") ? bodyDict["venue"]?.ToString() ?? "Okänt salong" : "Okänt salong";


      // amount of tickets set to zero to avoid having null value
      int childCount = 0;
      int adultCount = 0;
      int seniorCount = 0;
      int totalTickets = 0;


      // tryparsing to int
      if (bodyDict.ContainsKey("childCount") && bodyDict["childCount"] != null)
        int.TryParse(bodyDict["childCount"].ToString(), out childCount);
      if (bodyDict.ContainsKey("adultCount") && bodyDict["adultCount"] != null)
        int.TryParse(bodyDict["adultCount"].ToString(), out adultCount);
      if (bodyDict.ContainsKey("seniorCount") && bodyDict["seniorCount"] != null)
        int.TryParse(bodyDict["seniorCount"].ToString(), out seniorCount);
      if (bodyDict.ContainsKey("totalTickets") && bodyDict["totalTickets"] != null)
        int.TryParse(bodyDict["totalTickets"].ToString(), out totalTickets);

      string GetTicketDisplay(int child, int adult, int senior)
      {
        var display = new List<string>();
        if (child > 0) display.Add($"Barn: {child}");
        if (adult > 0) display.Add($"Vuxen: {adult}");
        if (senior > 0) display.Add($"Pensionär: {senior}");

        string ticketText = display.Count > 0
            ? string.Join(",    ", display)
            : "Inga biljetter";

        return ticketText;
      }

      string ticketDisplay = GetTicketDisplay(childCount, adultCount, seniorCount);


      try
      {
        string subject = $"Bokningsbekräftelse – {movieName}, {date}";
        string htmlBody = $@"
          <h1>Hej!</h1>

          <h3>Tack för din bokning hos CineSharp. Nedan finner du en sammanfattning av din reservation:</h3>
          
          <h2>Bokningsinformation</h2>

          <p><strong>Film:</strong> {movieName}</p>
          <p><strong>Datum:</strong> {date}</p>
          <p><strong>Tid:</strong> {time}</p>
          <p><strong>Antal biljetter:</strong> {totalTickets} st </p>
          <p>{ticketDisplay}</p>
          <p><strong>Plats/Platser:</strong> {selectedSeats}</p>
          <p><strong>Salong:</strong> {venue} </p>
          <br>

          <h2>Adress till biografen</h2>
          <p>CineSharp AB</p>
          <p>Linjegatan 12,</p>
          <p>302 50, Halmstad</p>

          <hr>
          <p><strong>Vänligen visa denna bekräftelse vid ankomst. Insläpp påbörjas cirka 15 minuter innan föreställningen.</strong></p>

          <br>

          <p>För frågor eller ändringar, kontakta oss gärna på:</p>
          <p>cinesharp.info@gmail.com</p>

          <br>

          <p>Tack för att du valt CineSharp. Vi ser fram emot att välkomna dig till föreställningen.</p>
          <p>Referens nummer: {bookingID}</p>

          <p><a href=""{DOMAIN_IN_MAIL}/avboka?email={email}&bookingID={bookingID}"">Avboka<a/></p>

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