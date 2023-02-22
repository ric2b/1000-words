export function calculateEloRating({userEloRating, cardEloRating, actualOutcome, kFactor = 100}) {
    let expectedOutcome = 1 / (1 + Math.pow(10, (cardEloRating- userEloRating) / 400));
  
    return {
        newUserEloRating: userEloRating + kFactor * (actualOutcome - expectedOutcome),
        newCardEloRating: cardEloRating - kFactor * (actualOutcome - expectedOutcome),
    };
}
