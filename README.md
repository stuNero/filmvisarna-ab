# Vilka har arbetat med github konton

- https://github.com/amirhamza247
  ➡️ Amir Jafari
- https://github.com/jacoblasse
  ➡️ Jacob Larsson
- https://github.com/stuNero
  ➡️ Max Vemic
- https://github.com/OscarWEdu
  ➡️ Oscar Ward
- https://github.com/Piercor
  ➡️ Pierino Corona

# Kort Beskrivning av Projektet

FilmvisarnaAB/CineSharp är ett webbprojekt för en biosalong där användare kan se filmer, boka biljetter, läsa reviews och hantera sina bokningar. I det här projektet har vi använt oss av både frontend React och backend C#. Webbsidan är byggd för att ge en modern och användarvänlig upplevelse. Styling är gjord med Tailwind CSS.

# Hur installerar man och kör?

1. Klona projektet från GitHub.
2. Installera Node.js och .NET 10 om du inte redan har det.
3. Kör en npm install i projektmappen för att installera alla packages och annat som krävs för att applikationen ska kunna köras.
4. Kontrollera att konfigurationsfilen backend/db-config.json är ifylld med korrekt information.
5. Starta applikation med npm run dev som kommer starta både frontend och backenden.

Nu kan du öppna webbsidan på http://localhost:5173

# DB Konfiguration

- innuti backend/db-config.json så måste du ha med följande för att applikationen ska fungera

```
{
  "host": "5.189.183.23",
  "port": 4567,
  "username": "h25halmstad-grupp3",
  "password": "GCKGK16393",
  "database": "h25halmstad-grupp3",
  "createTablesIfNotExist": true,
  "seedDataIfEmpty": true,
  "aiAccessToken": "h@@B[LL6j54f",
  "smtpServer": "smtp.gmail.com",
  "smtpPort": 587,
  "emailUsername": "cinesharp.info@gmail.com",
  "emailPassword": "uvsa fzgc tcsv mapn"
}
```

# Projektstruktur

```
filmvisarna-ab
|-- backend/            # backendkod, API, databaslogik och databas konfiguration
|-- public/             # bilder till frontend kod
|-- src/                # all frontend kod
|   |-- interfaces/     # datamodeller
|   |-- pages/          # olika pages
|   |-- partials/       # återanävndbara delar som t.ex footer, header
|   |-- parts/          # mindre användbara komponenter
|   |-- utils/          # hooks och hjälpfunktioner
|-- index.html
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
```

# Viktigt att veta

- Saker som vi lagt till som skolan inte gett oss
