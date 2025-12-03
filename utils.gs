/* * UTILITY FUNCTIONS
 * Text cleaning and normalization helpers.
 */

function extractAlias(name) {
  // Extracts player name from format: "Team Name (PlayerName)"
  const match = String(name || "").match(/\((.*?)\)/); 
  return match ? match[1].toLowerCase().trim() : "";
}

function normalizeTournament(name) {
  // Removes specific tournament tags and standardizes format
  return String(name || "")
    .toLowerCase()
    .replace(/\s*\[\d+\]/g, "") // Removes [95] type IDs
    .replace(/\s*-\s*t\d+/g, "") // Removes "- T2"
    .replace(/league\s*/g, "") 
    .replace(/[-–—]+/g, "") // Removes dashes
    .replace(/\s+/g, ' ')
    .trim();
}
