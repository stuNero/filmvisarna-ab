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

            CREATE TABLE IF NOT EXISTS Venues (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                VenueName VARCHAR(255) NOT NULL,
                VenueInfo TEXT
            );

            CREATE TABLE IF NOT EXISTS Seats (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                SeatRow INT NOT NULL,
                SeatColumn INT NOT NULL,
                VenueID INT NOT NULL,
                FOREIGN KEY (VenueID) REFERENCES Venues(ID)
            );

            CREATE TABLE IF NOT EXISTS Films (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                Title VARCHAR(255) NOT NULL,
                ProductionYear INT,
                Length INT,
                Genre VARCHAR(255),
                Distributor VARCHAR(255),
                Audio VARCHAR(255),
                Subtitles VARCHAR(255),
                Director VARCHAR(255),
                FilmDescription TEXT,
                Youtube VARCHAR(255)
            );

            CREATE TABLE IF NOT EXISTS Reviews (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                ReviewSource VARCHAR(255) NOT NULL,
                Quote TEXT NOT NULL,
                Stars VARCHAR(255) NOT NULL,
                FilmID INT NOT NULL,
                FOREIGN KEY (FilmID) REFERENCES Films(ID)
            );

            CREATE TABLE IF NOT EXISTS Showings (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                TimeSlot DATETIME NOT NULL,
                FilmID INT NOT NULL,
                VenueID INT NOT NULL,
                FOREIGN KEY (FilmID) REFERENCES Films(ID),
                FOREIGN KEY (VenueID) REFERENCES Venues(ID)
            );

            CREATE TABLE IF NOT EXISTS Images (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                FileName VARCHAR(255) NOT NULL,
                FilmID INT NOT NULL,
                FOREIGN KEY (FilmID) REFERENCES Films(ID)
            );

            CREATE TABLE IF NOT EXISTS Actors (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                ActorName VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS FilmActors (
                FilmID INT NOT NULL,
                ActorID INT NOT NULL,
                PRIMARY KEY (FilmID, ActorID),
                FOREIGN KEY (FilmID) REFERENCES Films(ID),
                FOREIGN KEY (ActorID) REFERENCES Actors(ID)
            );

            CREATE TABLE IF NOT EXISTS Products (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                ProductName VARCHAR(255) NOT NULL,
                InStock BOOL DEFAULT 1,
                Price INT NOT NULL,
                Description TEXT
            );

            CREATE TABLE IF NOT EXISTS Bookings (
                ID INT PRIMARY KEY UNIQUE,
                Cost INT NOT NULL,
                CreatedAt TIMESTAMP NOT NULL,
                ShowingID INT NOT NULL,
                FOREIGN KEY (ShowingID) REFERENCES Showings(ID)
            );

            CREATE TABLE IF NOT EXISTS BookedSeat (
                SeatID INT NOT NULL,
                BookingID INT NOT NULL,
                PRIMARY KEY (SeatID, BookingID),
                FOREIGN KEY (SeatID) REFERENCES Seats(ID),
                FOREIGN KEY (BookingID) REFERENCES Bookings(ID)
            );

            CREATE TABLE IF NOT EXISTS Users (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                Email VARCHAR(254) NOT NULL,
                Pass VARCHAR(255) NOT NULL,
                firstName VARCHAR(255),
                lastName VARCHAR(255),
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                created TIMESTAMP NOT NULL,
                LastVisited DATETIME NOT NULL
            );

            CREATE TABLE IF NOT EXISTS UserBookings (
                Email VARCHAR(255) NOT NULL,
                PRIMARY KEY (BookingID),
                FOREIGN KEY (BookingID) REFERENCES Bookings(ID)
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
                ('visitor,user,admin', 'GET', 'allow', '/api/products', 'true', 'Allow all user roles to read products');
            ";
            command.CommandText = aclData;
            command.ExecuteNonQuery();
        }

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
