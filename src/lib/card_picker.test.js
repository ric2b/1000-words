import { describe, it, expect } from 'vitest';
import { CardPicker } from './card_picker';
import { faker } from '@faker-js/faker';

describe('card picker', () => {

    it('can be instatiated and returns cards', () => {
        const cards = [
            { face: faker.helpers.unique(faker.random.words), rating: 300, answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), rating: 800, answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), rating: 1200, answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), rating: 2000, answer: faker.random.words() },
        ];

        const selected_card = new CardPicker(cards).selectNextCard();
        expect(cards).toContain(selected_card);
    })

    it('adds default ratings if missing', () => {
        const cards = [
            { face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
        ];

        expect(new CardPicker(cards).selectNextCard().rating).toEqual(1200);
    })

    it('can serialize scores', () => {
        const cards = [
            { face: faker.helpers.unique(faker.random.words), rating: 300, answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), rating: 800, answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), rating: 1200, answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), rating: 2000, answer: faker.random.words() },
        ];

        expect(new Map(JSON.parse(new CardPicker(cards).stringifyScores())))
            .toEqual(new Map(cards.map((card) => [card.face, card.rating])));
    })

    it('loads ratings from a stringified version of the scores', () => {
        const cards = [
            { face: 'a', answer: faker.random.words() },
            { face: 'b', answer: faker.random.words() },
            { face: 'c', answer: faker.random.words() },
            { face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
        ];

        const stringifiedScores = JSON.stringify([
            ['a', 500],
            ['c', 700],
        ]);

        const cardPicker = new CardPicker(cards);
        cardPicker.loadStringifiedScores(stringifiedScores);

        expect(JSON.parse(cardPicker.stringifyScores()))
            .toEqual(cards.map((card) => {
                if (card.face === 'a') { card.rating = 500 }
                if (card.face === 'c') { card.rating = 700 }
                
                return [card.face, card.rating];
            }));
    })

    describe('selecting cards based on rating', () => {
        it('handles empty input', () => {
            const result = (new CardPicker([])).selectNextCard();
            expect(result).toBeUndefined();
        })

        it('selects a card from the list', () => {
            const cards = [
                { rating: 100, face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
                { rating: 200, face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
                { rating: 300, face: faker.helpers.unique(faker.random.words), answer: faker.random.words() },
            ];

            const selected_card = new CardPicker(cards).selectNextCard()
            expect(cards).toContain(selected_card);
        })

        it('selects higher-rated cards more often', () => {
            const cards = [
                { id: 1, rating: 300 },
                { id: 2, rating: 800 },  
                { id: 3, rating: 1200 },
                { id: 4, rating: 2000 },
            ];

            const numTrials = 10000;
            const totalRatings = cards.reduce((sum, card) => sum + card.rating, 0);
            const expectedCounts = cards.map((card) => {
                return { cardId: card.id, expectedCount: numTrials * card.rating / totalRatings };
            });
          
            const counts = cards.reduce((counts, card) => {
              counts[card.id] = 0;
              return counts;
            }, {});

            const cardPicker = new CardPicker(cards)
          
            for (let i = 0; i < numTrials; i++) {
              const card = cardPicker.selectNextCard(cards);
              counts[card.id]++;
            }
          
            for (const expectedCount of expectedCounts) {
              const actualCount = counts[expectedCount.cardId];
              const error = Math.abs(actualCount - expectedCount.expectedCount) / numTrials;
              expect(error).toBeLessThan(0.05);
            }
        })
    })
});
