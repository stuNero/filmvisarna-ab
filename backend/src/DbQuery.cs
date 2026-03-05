namespace WebApp;

public static class DbQuery
{
    // Setup the database connection from config
    private static string connectionString;

    // JSON columns for _CONTAINS_ validation
    public static Arr JsonColumns = Arr(new[] { "categories" });

    public static bool IsJsonColumn(string column) => JsonColumns.Includes(column);

    static DbQuery()
    {
        var configPath = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "db-config.json"
        );
        var configJson = File.ReadAllText(configPath);
        var config = JSON.Parse(configJson);

        connectionString =
            $"Server={config.host};Port={config.port};Database={config.database};" +
            $"User={config.username};Password={config.password};";

        var db = new MySqlConnection(connectionString);
        db.Open();

        // Create tables if they don't exist
        if (config.createTablesIfNotExist == true)
        {
            CreateTablesIfNotExist(db);
        }

        // Seed data if tables are empty
        if (config.seedDataIfEmpty == true)
        {
            SeedDataIfEmpty(db);
        }

        db.Close();
    }

    private static void CreateTablesIfNotExist(MySqlConnection db)
    {
        var createTablesSql = @"
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                data JSON
            );

            CREATE TABLE IF NOT EXISTS acl (
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                userRoles VARCHAR(255) NOT NULL,
                method VARCHAR(50) NOT NULL DEFAULT 'GET',
                allow ENUM('allow', 'disallow') NOT NULL DEFAULT 'allow',
                route VARCHAR(255) NOT NULL,
                `match` ENUM('true', 'false') NOT NULL DEFAULT 'true',
                comment VARCHAR(500) NOT NULL DEFAULT '',
                UNIQUE KEY unique_acl (userRoles, method, route)
            );

            CREATE TABLE IF NOT EXISTS venues (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                info TEXT
            );

            CREATE TABLE IF NOT EXISTS seats (
                id INT PRIMARY KEY AUTO_INCREMENT,
                rowNr INT NOT NULL,
                columnNr INT NOT NULL,
                venueId INT NOT NULL,
                FOREIGN KEY (venueId) REFERENCES venues(id)
            );

            CREATE TABLE IF NOT EXISTS films (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                productionYear INT,
                length INT,
                ageRating INT,
                genre VARCHAR(255),
                distributor VARCHAR(255),
                audio VARCHAR(255),
                subtitles VARCHAR(255),
                director VARCHAR(255),
                filmDescription TEXT,
                youtube VARCHAR(255),
                coverImage VARCHAR(255)
            );

            CREATE TABLE IF NOT EXISTS reviews (
                id INT PRIMARY KEY AUTO_INCREMENT,
                source VARCHAR(255) NOT NULL,
                quote TEXT NOT NULL,
                stars VARCHAR(255) NOT NULL,
                filmId INT NOT NULL,
                FOREIGN KEY (filmId) REFERENCES films(id)
            );

            CREATE TABLE IF NOT EXISTS showings (
                id INT PRIMARY KEY AUTO_INCREMENT,
                timeSlot DATETIME NOT NULL,
                filmId INT NOT NULL,
                venueID INT NOT NULL,
                FOREIGN KEY (filmId) REFERENCES films(id),
                FOREIGN KEY (venueId) REFERENCES venues(id)
            );

            CREATE TABLE IF NOT EXISTS actors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS filmActors (
                filmId INT NOT NULL,
                actorId INT NOT NULL,
                PRIMARY KEY (filmId, actorId),
                FOREIGN KEY (filmId) REFERENCES films(id),
                FOREIGN KEY (actorId) REFERENCES actors(id)
            );

            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                productName VARCHAR(255) NOT NULL,
                inStock BOOL DEFAULT 1,
                price INT NOT NULL,
                description TEXT
            );

            CREATE TABLE IF NOT EXISTS bookings (
                id VARCHAR(10) PRIMARY KEY,
                cost INT NOT NULL,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                showingId INT NOT NULL,
                FOREIGN KEY (showingId) REFERENCES showings(id)
            );

            CREATE TABLE IF NOT EXISTS bookedSeat (
                seatId INT NOT NULL,
                bookingId VARCHAR(10) NOT NULL,
                ticketType ENUM ('child', 'adult', 'senior') NOT NULL DEFAULT('adult'),
                PRIMARY KEY (seatId, bookingId),
                FOREIGN KEY (seatId) REFERENCES seats(id),
                FOREIGN KEY (bookingId) REFERENCES bookings(id)
                ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(254) NOT NULL,
                pass VARCHAR(255) NOT NULL,
                firstName VARCHAR(255),
                lastName VARCHAR(255),
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                lastVisited DATETIME NOT NULL
            );

            CREATE TABLE IF NOT EXISTS userBookings (
                bookingId VARCHAR(10) PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                FOREIGN KEY (bookingId) REFERENCES bookings(id)
                ON DELETE CASCADE
            );
        ";
        // Execute each statement separately
        foreach (var sql in createTablesSql.Split(';'))
        {
            var trimmed = sql.Trim();
            if (!string.IsNullOrEmpty(trimmed))
            {
                var command = db.CreateCommand();
                command.CommandText = trimmed;
                command.ExecuteNonQuery();
            }
        }
        var createViews = @"
            DROP VIEW IF EXISTS bookingInfo;
                CREATE VIEW bookingInfo AS
                SELECT
                    s.rowNr,
                    s.columnNr,
                    sh.timeSlot,
                    v.name AS venueName,
                    v.info AS venueInfo,
                    f.title AS filmTitle,
                    bs.ticketType,
                    b.id AS bookingId,
                    b.cost AS totalPrice
                FROM bookedSeat bs
                JOIN bookings b ON bs.bookingId = b.id
                JOIN seats s ON bs.seatId = s.id
                JOIN showings sh ON b.showingId = sh.id
                JOIN venues v ON sh.venueId = v.id
                JOIN films f ON sh.filmId = f.id
            ;
            DROP VIEW IF EXISTS showingsAllSeats;
            CREATE VIEW showingsAllSeats AS
                SELECT sh.id, s.id AS seatId, s.rowNr, s.columnNr
                FROM showings sh,
                    seats s
                WHERE s.venueId = sh.venueID
            ;
            DROP VIEW IF EXISTS movieShowings;
            CREATE VIEW movieShowings AS
                SELECT
                f.id, f.title, s.id AS showingId,
                DATE(s.timeSlot) AS date,
                TIME(s.timeSlot) AS time,
                s.venueID, v.name
                FROM films f, showings s, venues v
                WHERE f.id = s.filmId
                AND s.venueID = v.id
            ;

            DROP VIEW IF EXISTS bookedSeatsWithShowings;
            CREATE VIEW bookedSeatsWithShowings AS
                SELECT bs.seatId, bs.bookingId, bs.ticketType,
                    b.showingId,
                    s.rowNr, s.columnNr
                FROM bookedSeat bs,
                    bookings b,
                    seats s
                WHERE bs.bookingId = b.id AND s.id = bs.seatId
            ;

            DROP VIEW IF EXISTS showingsWithOccupiedSeats;
            CREATE VIEW showingsWithOccupiedSeats AS
                SELECT movieShowings.*,
                    rowNr,columnNr
                FROM movieShowings,
                    bookedSeatsWithShowings
                WHERE movieShowings.showingId = bookedSeatsWithShowings.showingId
            ;
            
            DROP VIEW IF EXISTS comingFilms;
            CREATE VIEW comingFilms AS
                SELECT f.*  FROM showings s, films f
                WHERE s.filmId = f.id
                AND s.timeSlot >= NOW() + INTERVAL 15 MINUTE
                GROUP BY f.id
            ;
            
            DROP VIEW IF EXISTS movieActors;
            CREATE VIEW movieActors AS
            SELECT f.id, a.name FROM filmActors fa, films f, actors a
            WHERE f.id = fa.filmId
            AND fa.actorId = a.id
            ;
        ";
        // Execute each statement separately
        foreach (var sql in createViews.Split(';'))
        {
            var trimmed = sql.Trim();
            if (!string.IsNullOrEmpty(trimmed))
            {
                var command = db.CreateCommand();
                command.CommandText = trimmed;
                command.ExecuteNonQuery();
            }
        }
    }

    private static void SeedDataIfEmpty(MySqlConnection db)
    {
        // Check if tables are empty and seed if needed
        var command = db.CreateCommand();

        // Seed ACL rules
        command.CommandText = "SELECT COUNT(*) FROM acl";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var aclData = @"
                INSERT INTO acl (userRoles, method, allow, route, `match`, comment) VALUES
                ('visitor, user', 'GET', 'disallow', '/secret.html', 'true', 'No access to /secret.html for visitors and normal users'),
                ('visitor,user, admin', 'GET', 'allow', '/api', 'false', 'Allow access to all routes not starting with /api'),
                ('visitor', 'POST', 'allow', '/api/users', 'true', 'Allow registration as new user for visitors'),
                ('visitor, user,admin', '*', 'allow', '/api/login', 'true', 'Allow access to all login routes'),
                ('admin', '*', 'allow', '/api/users', 'true', 'Allow admins to see and edit users'),
                ('admin', '*', 'allow', '/api/sessions', 'true', 'Allow admins to see and edit sessions'),
                ('admin', '*', 'allow', '/api/acl', 'true', 'Allow admins to see and edit acl rules'),
                ('visitor,user,admin', 'GET', 'allow', '/api/products', 'true', 'Allow all user roles to read products'),
                ('visitor,user,admin', 'GET', 'allow', '/api/films', 'true', 'Allow all user roles to read products');
            ";
            command.CommandText = aclData;
            command.ExecuteNonQuery();
        }

        // Seed Venues
        command.CommandText = "SELECT COUNT(*) FROM venues";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var venuesData = @"
                INSERT IGNORE INTO venues (name, info) VALUES
                ('Sal 1', 'Premium sal'),('Sal 2', 'Mysigt sal');
            ";
            command.CommandText = venuesData;
            command.ExecuteNonQuery();
        }

        // Seed Seats
        command.CommandText = "SELECT COUNT(*) FROM seats";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var seatsData = @"
            INSERT IGNORE INTO seats (rowNr, columnNr, venueId) VALUES
                -- Sal 1
                (1,1,1),(1,2,1),(1,3,1),(1,4,1),(1,5,1),(1,6,1),(1,7,1),(1,8,1),(2,1,1),(2,2,1),(2,3,1),(2,4,1),
                (2,5,1),(2,6,1),(2,7,1),(2,8,1),(2,9,1),(3,1,1),(3,2,1),(3,3,1),(3,4,1),(3,5,1),(3,6,1),(3,7,1),
                (3,8,1),(3,9,1),(3,10,1),(4,1,1),(4,2,1),(4,3,1),(4,4,1),(4,5,1),(4,6,1),(4,7,1),(4,8,1),(4,9,1),
                (4,10,1),(5,1,1),(5,2,1),(5,3,1),(5,4,1),(5,5,1),(5,6,1),(5,7,1),(5,8,1),(5,9,1),(5,10,1),(6,1,1),
                (6,2,1),(6,3,1),(6,4,1),(6,5,1),(6,6,1),(6,7,1),(6,8,1),(6,9,1),(6,10,1),(7,1,1),(7,2,1),(7,3,1),
                (7,4,1),(7,5,1),(7,6,1),(7,7,1),(7,8,1),(7,9,1),(7,10,1),(7,11,1),(7,12,1),(8,1,1),(8,2,1),(8,3,1),
                (8,4,1),(8,5,1),(8,6,1),(8,7,1),(8,8,1),(8,9,1),(8,10,1),(8,11,1),(8,12,1),
                -- Sal 2
                (1,1,2),(1,2,2),(1,3,2),(1,4,2),(1,5,2),(1,6,2),(2,1,2),(2,2,2),(2,3,2),(2,4,2),(2,5,2),(2,6,2),
                (2,7,2),(2,8,2),(3,1,2),(3,2,2),(3,3,2),(3,4,2),(3,5,2),(3,6,2),(3,7,2),(3,8,2),(3,9,2),(4,1,2),
                (4,2,2),(4,3,2),(4,4,2),(4,5,2),(4,6,2),(4,7,2),(4,8,2),(4,9,2),(4,10,2),(5,1,2),(5,2,2),(5,3,2),
                (5,4,2),(5,5,2),(5,6,2),(5,7,2),(5,8,2),(5,9,2),(5,10,2),(6,1,2),(6,2,2),(6,3,2),(6,4,2),(6,5,2),
                (6,6,2),(6,7,2),(6,8,2),(6,9,2),(6,10,2),(6,11,2),(6,12,2);
            ";
            command.CommandText = seatsData;
            command.ExecuteNonQuery();
        }

        // Seed Films
        command.CommandText = "SELECT COUNT(*) FROM films";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var filmsData = @"
                INSERT IGNORE INTO films (title, productionYear, length, ageRating , genre, distributor, audio, subtitles, director, filmDescription, youtube, coverImage) VALUES
                ('Top Secret!', 1984, 90, 11, 'Komedi', 'Paramount Pictures', 'Engelska', 'Svenska',
                'Zucker & Abrahams', 'En amerikansk popstjärna ska framträda i Östtyskland, men dras istället in i en internationell
                intrig i denna knasiga spionparodi från skaparna av Titta vi flyger.', 'zoT28BPzVcI',
                'https://storage.googleapis.com/pod_public/1300/262813.jpg'),
                ('Dune: Part Two',2024,165, 11,'Sci-Fi','Warner Bros.','Engelska','Svenska','Denis Villeneuve',
                'Paul Atreides förenar sig med Fremen-folket medan han är ute på en hämndlysten krigsfärd mot konspiratörerna som förstörde hans familj.
                Ställd inför ett val mellan sitt livs kärlek och universums öde, försöker han förhindra en fruktansvärd framtid.','RaB32onQdeI',
                'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cqTlNDznTNOhqONRtkEnbQHaNK%3Fcb%3Ddefcachec2%26pid%3DApi&f=1&ipt=7d6d2074a065eebfb3fa2e725b34da10772faafbd4d2b31d7ef66a39d80bb6ce&ipo=images'),
                ('Pulp Fiction', 1994, 154, 15,'Mörk komedi','Miramax Films', 'Engelska', 'Svenska',
                'Quentin Tarantino', 'Livet för två maffiatorrödrar, en boxare, en gangster och hans fru, och ett par dinerbanditer flätas
                samman i fyra berättelser om våld och försoning.', 'yMXB9u4z8Ic','https://storage.googleapis.com/pod_public/750/262754.jpg'),
                ('12 Angry Men',1957,96,15 ,'Drama','Metro-Goldwyn-Meyer','Engelska','Svenska','Sidney Lumet',
                'Juryn i en mordrättegång i New York blir frustrerade av en enda medlem vars skeptiska försiktighet tvingar dem att noggrant överväga bevisen
                innan de fäller en förhastad dom.','_13J_9B5jEk','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.mrChsuFytZXo6KLN-k8tpQHaLH%3Fpid%3DApi&f=1&ipt=a71345fd69c19342bbe1643bea3dee1a0a1e3ce56b6a3b132fad5222de8a0db4&ipo=images'),
                ('Terminator 2: Judgment Day',1991,137,15,'Action','Tri-Star Pictures','Engelska',
                'Svenska','James Cameron','En cyborg från framtiden, identisk med den som misslyckades med att döda Sarah Connor,
                måste nu skydda sin tioårige son John från en ännu mer avancerad och kraftfull cyborg.', 'CRRlbK5w8AE','https://image.tmdb.org/t/p/original/nRIfVniMh6FcJievGnNGpZdsN7d.jpg');
            ";
            command.CommandText = filmsData;
            command.ExecuteNonQuery();
        }

        // Seed Reviews
        command.CommandText = "SELECT COUNT(*) FROM reviews";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var reviewsData = @"
                INSERT IGNORE INTO reviews (source, quote, stars, filmId) VALUES
                ('Variety','Den här gången är det försökta målet en kombination av den traditionella spionfilmen och
                Elvis Presleys musikaliska upptåg, vilket i sig är roligt till en början. Och Val Kilmer visar sig vara en perfekt
                blandning av trofast hjälte och drivkraftsfull hjärtekrossare.','4',1),
                ('The AV Club','Top Secret! ersätter den spridda parodimetoden med en mer exakt återskapning av den
                tokiga enkelheten i andra världskrigets romanser och Elvis-filmer.','3,5',1),
                ('The Independient','Del två är lika storslagen som den är intim, och medan Hans Zimmers musik återigen
                får dina trumhinnor att ge efter, och teatersätena mullrar av varje sandmask som springer i luften, är det de utvalda
                ögonblicken av tystnad som verkligen sätter sina spår.','5',2),
                ('Los Angeles Times','Villeneuve har lyckats med en av Hollywoods stora satsningar på senare tid och
                levererat ett tvådelat epos med litterära nyanser, aktuell betydelse och kanske till och med löftet om ytterligare
                en film eller två.','4,5',2),
                ('Rolling Stone', 'Kriminalfilmernas nya King Kong... Grym underhållning utan ett spår av försiktighet,
                självbelåtenhet eller politisk korrekthet som hämmar dess 154 ljuvligt makabra minuter.','5',3),
                ('Wall Street Journal','Den mest fantasifulla filmen på evigheter.','5',3),
                ('The New York Times','En genomträngande, känslig och ibland chockerande dissektion av hjärtan och sinnen
                hos män som uppenbarligen är något mindre än gudar. Det skapar ett spänt, fängslande och fängslande drama som når långt
                bortom juryrummets snäva ramar.','5',4),
                ('Chicago Tribune','Baserad på Reginald Roses legendariska TV-pjäs, under Sidney Lumets sympatiska hand,
                är detta en av 50-talets största skådespelare.','5',4),
                ('San Francisco Chronicle', 'Terminator 2 föreställer sig saker du troligtvis inte ens skulle drömma om och får dessa visioner
                upp på skärmen med en sömlöshet som är häpnadsväckande.','5',5),
                ('Entertaiment Weekly','Filmen är en stor festmåltid av vrakspill. Men det är också det som gör den lite avdomnande.',
                '4',5);
            ";
            command.CommandText = reviewsData;
            command.ExecuteNonQuery();
        }

        // Seed Showings
        command.CommandText = "SELECT COUNT(*) FROM showings";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var showingsData = @"
                INSERT IGNORE INTO showings (timeSlot, filmId, venueId) VALUES

                -- Day 1 (Mars 20)
                ('2026-03-20 17:15:00', 1, 1),
                ('2026-03-20 20:15:00', 1, 2),
                ('2026-03-20 17:15:00', 2, 2),
                ('2026-03-20 20:15:00', 2, 1),
                ('2026-03-20 17:15:00', 3, 1),
                ('2026-03-20 20:15:00', 3, 2),
                ('2026-03-20 17:15:00', 4, 2),
                ('2026-03-20 20:15:00', 4, 1),

                -- Day 2 (Mars 21) – swapped venues
                ('2026-03-21 17:15:00', 1, 2),
                ('2026-03-21 20:15:00', 1, 1),
                ('2026-03-21 17:15:00', 2, 1),
                ('2026-03-21 20:15:00', 2, 2),
                ('2026-03-21 17:15:00', 3, 2),
                ('2026-03-21 20:15:00', 3, 1),
                ('2026-03-21 17:15:00', 4, 1),
                ('2026-03-21 20:15:00', 4, 2),

                -- Day 3 (Mars 22) – same as Day 1
                ('2026-03-22 17:15:00', 1, 1),
                ('2026-03-22 20:15:00', 1, 2),
                ('2026-03-22 17:15:00', 2, 2),
                ('2026-03-22 20:15:00', 2, 1),
                ('2026-03-22 17:15:00', 3, 1),
                ('2026-03-22 20:15:00', 3, 2),
                ('2026-03-22 17:15:00', 4, 2),
                ('2026-03-22 20:15:00', 4, 1),

                -- Day 4 (Mars 23) – same as Day 2
                ('2026-03-23 17:15:00', 1, 2),
                ('2026-03-23 20:15:00', 1, 1),
                ('2026-03-23 17:15:00', 2, 1),
                ('2026-03-23 20:15:00', 2, 2),
                ('2026-03-23 17:15:00', 3, 2),
                ('2026-03-23 20:15:00', 3, 1),
                ('2026-03-23 17:15:00', 4, 1),
                ('2026-03-23 20:15:00', 4, 2);
            ";
            command.CommandText = showingsData;
            command.ExecuteNonQuery();
        }

        // Seed Actors
        command.CommandText = "SELECT COUNT(*) FROM actors";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var actorsData = @"
                INSERT IGNORE INTO actors (name) VALUES
                ('Val Kilmer'),('Lucy Gutteridge'),('Omar Sharif'),
                ('Timotheé Chalamet'),('Zendaya'),('Rebecca Ferguson'),
                ('John Travolta'),('Uma Thurman'),('Samuel L. Jackson'),('Bruce Willis'),
                ('Henry Fonda'),('Lee J. Cobb'),('Martin Balsam'),
                ('Arnold Schwarzenegger'),('Linda Hamilton'),('Robert Patrick');
            ";
            command.CommandText = actorsData;
            command.ExecuteNonQuery();
        }

        // Seed Film Actors
        command.CommandText = "SELECT COUNT(*) FROM filmActors";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var filmActorsData = @"
            INSERT IGNORE INTO filmActors (filmId, actorId) VALUES
                (1,1),(1,2),(1,3),(2,4),(2,5),(2,6),
                (3,7),(3,8),(3,9),(3,10),(4,11),(4,12),(4,13),
                (5,14),(5,15),(5,16);
            ";
            command.CommandText = filmActorsData;
            command.ExecuteNonQuery();
        }

        // Seed the rest of the tables/views here. 

        /* // Seed users
        command.CommandText = "SELECT COUNT(*) FROM users";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var usersData = @"
                INSERT INTO users (created, email, firstName, lastName, role, password) VALUES
                ('2024-04-02', 'thomas@nodehill.com', 'Thomas', 'Frank', 'admin', '$2a$13$IahRVtN2pxc1Ne1NzJUPpOQO5JCtDZvXpSF.IF8uW85S6VoZKCwZq'),
                ('2024-04-02', 'olle@nodehill.com', 'Olle', 'Olofsson', 'user', '$2a$13$O2Gs3FME3oA1DAzwE0FkOuMAOOAgRyuvNQq937.cl7D.xq0IjgzN.'),
                ('2024-04-02', 'maria@nodehill.com', 'Maria', 'Mårtensson', 'user', '$2a$13$p4sqCN3V3C1wQXspq4eN0eYwK51ypw7NPL6b6O4lMAOyATJtKqjHS');
            ";
            command.CommandText = usersData;
            command.ExecuteNonQuery();
        } */
    }

    // Helper to create an object from the DataReader
    private static dynamic ObjFromReader(MySqlDataReader reader)
    {
        var obj = Obj();
        for (var i = 0; i < reader.FieldCount; i++)
        {
            var key = reader.GetName(i);
            var value = reader.GetValue(i);

            // Handle NULL values
            if (value == DBNull.Value)
            {
                obj[key] = null;
            }
            // Handle DateTime - convert to ISO string
            else if (value is DateTime dt)
            {
                obj[key] = dt.ToString("yyyy-MM-ddTHH:mm:ss");
            }
            // Handle boolean (MySQL returns sbyte for TINYINT(1))
            else if (value is sbyte sb)
            {
                obj[key] = sb != 0;
            }
            else if (value is bool b)
            {
                obj[key] = b;
            }
            // Handle JSON columns (MySQL returns JSON as string starting with [ or {)
            else if (value is string strValue && (strValue.StartsWith("[") || strValue.StartsWith("{")))
            {
                // Special case: Don't parse 'data' column from sessions - keep as string
                if (key == "data")
                {
                    obj[key] = strValue;
                }
                else
                {
                    try
                    {
                        obj[key] = JSON.Parse(strValue);
                    }
                    catch
                    {
                        // If parsing fails, keep the original value and try to convert to number
                        obj[key] = strValue.TryToNum();
                    }
                }
            }
            else
            {
                // Normal handling - convert to string and try to parse as number
                obj[key] = value.ToString().TryToNum();
            }
        }
        return obj;
    }

    // Run a query - rows are returned as an array of objects
    public static Arr SQLQuery(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        var paras = parameters == null ? Obj() : Obj(parameters);
        using var db = new MySqlConnection(connectionString);
        db.Open();
        var command = db.CreateCommand();
        command.CommandText = @sql;
        var entries = (Arr)paras.GetEntries();
        entries.ForEach(x => command.Parameters.AddWithValue("@" + x[0], x[1]));
        if (context != null)
        {
            DebugLog.Add(context, new
            {
                sqlQuery = sql.Regplace(@"\s+", " "),
                sqlParams = paras
            });
        }
        var rows = Arr();
        try
        {
            if (sql.StartsWith("SELECT ", true, null))
            {
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    rows.Push(ObjFromReader(reader));
                }
                reader.Close();
            }
            else
            {
                rows.Push(new
                {
                    command = sql.Split(" ")[0].ToUpper(),
                    rowsAffected = command.ExecuteNonQuery()
                });
            }
        }
        catch (Exception err)
        {
            rows.Push(new { error = err.Message });
        }
        return rows;
    }

    // Run a query - only return the first row, as an object
    public static dynamic SQLQueryOne(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        return SQLQuery(sql, parameters, context)[0];
    }
}
