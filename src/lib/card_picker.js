// export default class CardPicker {
export class CardPicker {
    constructor(cardStates) {
        this.cardStates = cardStates;
    }

    static fromDeckSize(numberOfCards) {
        return new CardPicker(Array(numberOfCards).fill(CardState.new));
    }

    static fromStringified(serializedCardStates) {
        return new CardPicker(JSON.parse(serializedCardStates));
    }

    stringify() {
        return JSON.stringify(this.cardStates);
    }

    reset() {
        this.cardStates.fill(CardState.new);
    }

    countKnown() {
        return this.cardStates.filter(state => state === CardState.known).length;
    }

    allKnown() {
        return this.cardStates.every(state => state === CardState.known);
    }

    markIndex(cardIndex, cardState) {
        this.cardStates[cardIndex] = cardState;
    }

    markUnknown(cardIndex) {
        this.markIndex(cardIndex, CardState.unknown);
    }
    
    markKnown(cardIndex) {
        this.markIndex(cardIndex, CardState.known);
    }

    getStateOf(cardIndex) {
        return this.cardStates[cardIndex];
    }

    // TODO: clean this up
    getNextCardIndex(currentIndex) {
        const cardStateCounts = this.cardStates.reduce((counts, state) => { counts[state] = (counts[state] || 0) + 1; return counts }, {});

        const newCardCount = cardStateCounts[CardState.new] || 0;
        const unknownCardCount = cardStateCounts[CardState.unknown] || 0;

        const firstUnknownCardIndex = this.cardStates.findIndex((cardState, index) => index >= 0 && cardState === CardState.unknown)

        if (newCardCount !== 0 && unknownCardCount !== 0) {
            const targetCardState = Math.random() < 0.7 || currentIndex === firstUnknownCardIndex ? CardState.new : CardState.unknown;
            const findAheadOfIndex = targetCardState === CardState.new ? currentIndex + 1 : 0;

            return this.cardStates.findIndex((cardState, index) => index >= findAheadOfIndex && cardState === targetCardState);
        } else if (newCardCount !== 0) {
            return this.cardStates.findIndex((cardState, index) => index >= currentIndex + 1 && cardState === CardState.new);
        } else {
            return firstUnknownCardIndex;
        }
    }
}

export const CardState = {
    new: 0,
    unknown: 1,
    known: 2,
};