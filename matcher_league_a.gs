/* * AUTOMATION FOR LEAGUE A (Fuzzy Matching Logic)
 * Matches games based on team name similarity using Levenshtein Distance.
 */

function processLeagueA_Channels() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Using generic names for privacy
  const matchSheet = ss.getSheetByName("LeagueA_Schedule"); 
  const sourceSheet = ss.getSheetByName("LeagueA_SourceData");

  const matchData = matchSheet.getRange(2, 1, matchSheet.getLastRow() - 1, 17).getDisplayValues();
  const sourceData = sourceSheet.getRange(2, 1, sourceSheet.getLastRow() - 1, 12).getDisplayValues();

  for (let i = 0; i < matchData.length; i++) {
    const row = matchData[i];
    const targetCell = matchSheet.getRange(i + 2, 17); // Target Column for Channel Code

    const homeTeam = row[12];
    const awayTeam = row[13];
    
    // Extract player aliases for comparison
    const homeName = extractAlias(homeTeam);
    const awayName = extractAlias(awayTeam);

    let matched = false;

    for (let j = 0; j < sourceData.length; j++) {
      const sourceRow = sourceData[j];
      const sourceAlias1 = sourceRow[2] || "";
      const sourceAlias2 = sourceRow[3] || "";
      const broadcastChannel = sourceRow[10];

      // FUZZY MATCHING LOGIC
      // We check if (Home == Source1 AND Away == Source2) OR (Home == Source2 AND Away == Source1)
      const playersMatch =
        (fuzzyCompare(homeName, sourceAlias1) && fuzzyCompare(awayName, sourceAlias2)) ||
        (fuzzyCompare(homeName, sourceAlias2) && fuzzyCompare(awayName, sourceAlias1));

      if (playersMatch) {
        // Normalize Channel Name (e.g., "TV 1" -> "T1")
        const finalChannel = broadcastChannel ? broadcastChannel.replace("TV", "T").trim().toUpperCase() : "";
        
        if (finalChannel && finalChannel.match(/^T\d$/)) {
          targetCell.setValue(finalChannel);
          matched = true;
          break; // Stop searching once found
        }
      }
    }

    if (!matched) {
      targetCell.setValue(""); // Clear cell if no match found
    }
  }
}

// --- HELPER ALGORITHMS ---

/**
 * Calculates similarity between two strings using Levenshtein Distance.
 * Returns true if similarity is > 70%.
 */
function fuzzyCompare(str1, str2) {
  if (!str1 || !str2) return false;
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  const distance = levenshtein(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  
  return (1 - distance / maxLen) > 0.7; // Threshold: 70% similarity
}

function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => []);
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;
  for (let j = 0; j <= an; ++j) matrix[0][j] = j;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[bn][an];
}
