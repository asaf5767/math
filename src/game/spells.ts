import type { Spell } from '../types/game';

export const SPELLS: Record<string, Spell> = {
  lumos: {
    id: 'lumos',
    nameHe: 'לומוס',
    nameEn: 'Lumos',
    emoji: '🕯️',
    description: 'קסם אור רך שמאיר את המספרים בזהב עדין, כדי שתראי כל תרגיל ברור ורגוע.',
  },
  wingardiumLeviosa: {
    id: 'wingardium-leviosa',
    nameHe: 'ווינגרדיום לוויוסה',
    nameEn: 'Wingardium Leviosa',
    emoji: '🪶',
    description: 'קסם מרחף שמרים נוצות, עפרונות וחיוכים באוויר בכל פעם שאת פותרת נכון.',
  },
  expectoPatronum: {
    id: 'expecto-patronum',
    nameHe: 'אקספקטו פטרונום',
    nameEn: 'Expecto Patronum',
    emoji: '🦌',
    description: 'מזמן פטרונוס נוצץ ששומר עלייך, מחזק את הלב ונותן אומץ מול אתגרים חדשים.',
  },
  maraudersMap: {
    id: 'marauders-map',
    nameHe: 'מפת הנווטים',
    nameEn: "Marauder's Map",
    emoji: '🗺️',
    description: 'מגלה שבילים סודיים אל הפתרון עם רמזים קטנים וחכמים, ממש כמו במסדרונות הוגוורטס.',
  },
  accio: {
    id: 'accio',
    nameHe: 'אקסיו',
    nameEn: 'Accio',
    emoji: '✨',
    description: 'קורא לתשובה הנכונה להתקרב אלייך במהירות, כאילו הקסם כבר יודע מה את עומדת לגלות.',
  },
  houseCup: {
    id: 'house-cup',
    nameHe: 'גביע הבית',
    nameEn: 'House Cup',
    emoji: '🏆',
    description: 'ממלא את האולם בניצוצות זהב וחוגג שאת אלופת החשבון של הבית שלך בהוגוורטס.',
  },
};

export const SPELL_LIST: Spell[] = Object.values(SPELLS);
