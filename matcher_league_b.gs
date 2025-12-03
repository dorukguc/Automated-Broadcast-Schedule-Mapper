/* * AUTOMATION FOR LEAGUE B (Pattern Matching Logic)
 * Matches games based on exact player aliases extracted via Regex.
 */

function processLeagueB_Channels() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var bridgeSheet = ss.getSheetByName("LeagueB_Schedule");
  var botSheet = ss.getSheetByName("LeagueB_SourceData");
  
  var bridgeData = bridgeSheet.getDataRange().getValues();
  var botData = botSheet.getDataRange().getValues();

  // Iterate through the main schedule
  for (var i = 1; i < bridgeData.length; i++) {
    var homeTeam = bridgeData[i][12]; 
    var awayTeam = bridgeData[i][13]; 
    
    // Regex extraction: Get text inside parentheses
    var homePlayer = homeTeam.match(/\(([^)]+)\)/);
    var awayPlayer = awayTeam.match(/\(([^)]+)\)/);
    
    if (homePlayer && awayPlayer) {
      homePlayer = homePlayer[1].toLowerCase();
      awayPlayer = awayPlayer[1].toLowerCase();
      
      // Search in the source bot data
      for (var j = 1; j < botData.length; j++) {
        var botHome = botData[j][5]; 
        var botAway = botData[j][6]; 
        
        var botHomePlayer = botHome.match(/\(([^)]+)\)/);
        var botAwayPlayer = botAway.match(/\(([^)]+)\)/);
        
        if (botHomePlayer && botAwayPlayer) {
          botHomePlayer = botHomePlayer[1].toLowerCase();
          botAwayPlayer = botAwayPlayer[1].toLowerCase();
          
          // Exact Match Check
          if (homePlayer == botHomePlayer && awayPlayer == botAwayPlayer) {
            
            var rawStreamName = botData[j][10]; // e.g., "STREAM 1"
            
            // Normalize Stream Names to Standard Codes (T1, T2...)
            var standardCode = rawStreamName.replace("STREAM1", "T1")
                                            .replace("STREAM2", "T2")
                                            .replace("STREAM3", "T3")
                                            .replace("STREAM4", "T4");
            
            // Update the master sheet
            bridgeSheet.getRange(i + 1, 17).setValue(standardCode); 
            break; 
          }
        }
      }
    }
  }
}
