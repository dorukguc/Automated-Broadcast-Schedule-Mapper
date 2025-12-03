Automated Broadcast Schedule Mapper (Google Apps Script)

Project Overview:

In my Data Operations role, matching daily e-sports match schedules with their corresponding TV broadcast channels was a challenging manual process. We receive data from different tournament organizers in various formats (Excel, APIs), and manually adding them into our main files took almost 1 hour every day.
I builded this automation tool using **Google Apps Script** to instantly combine these separete data sources.
During the development process, I used AI tools to brainstorm ideas and get recommendations for code optimization. This approach helped me learn new libraries and apply best practices to build a more efficient and reliable script.
I chose the methods based on data quality to save time. League A had messy team names, so it required "Fuzzy Logic". League B was clean, so I used "Exact Matching" (Regex) because it is faster and uses less power.

Key Features:

To solve the different namings between data sources, i implemented advanced logic instead of simple lookups via AI:
Fuzzy Logic (Levenshtein): Matches team names even if they are written differently; example, "Galaxy Esports" / "Team Galaxy".
Regex (Regular Expressions): Extracts clean player names and IDs from raw text.
Google Sheets API: Reads/writes data automatically without opening files.
