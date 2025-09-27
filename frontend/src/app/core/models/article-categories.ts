export interface ArticleCategories {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
}

export const CATEGORIES: ArticleCategories[] = [
  {
    id: 1,
    name: 'Dnevna Soba',
    subcategories: [
      { id: 1, name: 'Sofe & Kauči' },
      { id: 2, name: 'Klub Stolovi' },
      { id: 3, name: 'TV Stalci' },
      { id: 4, name: 'Fotelje & Naslonjači' },
      { id: 5, name: 'Police za Knjige' },
    ],
  },
  {
    id: 2,
    name: 'Spavaća Soba',
    subcategories: [
      { id: 6, name: 'Kreveti' },
      { id: 7, name: 'Komode & Ormarići' },
      { id: 8, name: 'Noćni Ormarići' },
      { id: 9, name: 'Ormari' },
      { id: 10, name: 'Toaletni Stolići' },
    ],
  },
  {
    id: 3,
    name: 'Blagovaonica',
    subcategories: [
      { id: 11, name: 'Blagovaonski Stolovi' },
      { id: 12, name: 'Blagovaonske Stolice' },
      { id: 13, name: 'Barske Stolice' },
      { id: 14, name: 'Kredenci & Komode' },
      { id: 15, name: 'Vitrine za Posuđe' },
    ],
  },
  {
    id: 4,
    name: 'Kućni Ured',
    subcategories: [
      { id: 16, name: 'Radni Stolovi' },
      { id: 17, name: 'Uredske Stolice' },
      { id: 18, name: 'Police za Knjige' },
      { id: 19, name: 'Ormarići za Dokumente' },
      { id: 20, name: 'Regali & Police' },
    ],
  },
];
