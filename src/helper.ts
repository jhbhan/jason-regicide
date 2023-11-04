import _, { shuffle } from 'underscore';
import { CardDetail } from './type/CardDetail';

const TAVERN_VALUES =
[
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
];

const BOSS_VALUES =
[
    'J',
    'Q',
    'K'
];

const SUITS = 
[
    'Diamond',
    'Heart',
    'Club',
    'Spade'
];

export const getTavernDeck = () => {
    let retval:CardDetail[] = [];

    TAVERN_VALUES.forEach(value => {
        SUITS.forEach(suit => {
            retval.push({value:value, suit:suit});
        });
    });
    return _.shuffle(retval);
};

export const getBossDeck = () => {
    let retval: CardDetail[] = [];
    BOSS_VALUES.forEach(value => {
        let boss_level: CardDetail[] = [];
        SUITS.forEach(suit => {
            boss_level.push({value:value, suit:suit});
        });
        retval = retval.concat(_.shuffle(boss_level));
    });
    return retval;
}

export const getValue = (card: string) => {
    switch(card){
        case 'A':
            return 1;
        case 'J':
            return 10;
        case 'Q':
            return 15;
        case 'K':
            return 20;
        default:
            return Number(card);
    }
}

export const getBossAttack = (card: string) => {
    switch(card){
        case 'J':
            return 10;
        case 'Q':
            return 15;
        case 'K':
            return 20;
        default:
            return Number(card);
    }
};

export const getBossHealth = (card: string) => {
    switch(card){
        case 'J':
            return 20;
        case 'Q':
            return 30;
        case 'K':
            return 40;
        default:
            return Number(card);
    }
};