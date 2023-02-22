import { describe, it, expect } from 'vitest';
import { calculateEloRating } from './elo_rating';

describe('elo rating', () => {
    it('updates the ratings correctly when the user gets a card right', () => {
        const userEloRating = 1000;
        const cardEloRating = 300;
        const correct = true;       
        const actualOutcome = correct ? 1 : 0;
        const { newUserEloRating, newCardEloRating } = calculateEloRating({ userEloRating, cardEloRating, actualOutcome })

        expect(newUserEloRating).toBeCloseTo(userEloRating + 2, 0);
        expect(newCardEloRating).toBeCloseTo(cardEloRating - 2, 0);
    })

    it('updates the ratings correctly when the user gets a card wrong', () => {
        const userEloRating = 1000;
        const cardEloRating = 300;
        const correct = false;
        const actualOutcome = correct ? 1 : 0;
        const { newUserEloRating, newCardEloRating } = calculateEloRating({ userEloRating, cardEloRating, actualOutcome })
                    
        expect(newUserEloRating).toBeCloseTo(userEloRating - 98, 0);
        expect(newCardEloRating).toBeCloseTo(cardEloRating + 98, 0);
    })
})