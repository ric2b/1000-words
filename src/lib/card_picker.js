// export default class CardPicker {
export class CardPicker {
    #DEFAULT_RATING = 1200;
    
    constructor(cards) {
        this.cards = cards;
        this.seen_cards = new Set();
        for (const card of this.cards) { card.rating ||= this.#DEFAULT_RATING }
    }

    selectNextCard() {
        const totalWeight = this.cards.reduce((sum, card) => sum + card.rating, 0);
        const randomNumber = Math.random() * totalWeight;
        let runningTotal = 0;
        
        // Could be replaced by a binary search to improve performance
        for (const card of this.cards) {
          runningTotal += card.rating;
          if (runningTotal >= randomNumber) {
            return card;
          }
        }
        
        // Fallback in case of rounding errors
        const fallback_card  = this.cards[this.cards.length - 1];
        return fallback_card;
    }

    stringifyScores() {
        return JSON.stringify(this.cards.map((card) => [card.face, card.rating]));
    }

    stringifySeen() {
        return JSON.stringify(Array.from(this.seen_cards));
    }

    loadStringifiedScores(stringifiedScores) {
        const scores = new Map(JSON.parse(stringifiedScores));

        for (const card of this.cards) {
            if (scores.has(card.face)) {
                card.rating = scores.get(card.face)
            }
        }
    }

    loadSeen(stringifiedSeen) {
        this.seen_cards = new Set(JSON.parse(stringifiedSeen));
    }

    progress() {
        return this.seen_cards.size / this.cards.length;
    }

    markSeen(card_face) {
        return this.seen_cards.add(card_face);
    }

    newCard(card_face) {
        return !this.seen_cards.has(card_face);
    }
}
