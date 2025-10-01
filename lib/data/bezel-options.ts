// Rolex Bezel Types
// Commonly used bezel types in Rolex watches

export const BEZEL_OPTIONS = [
  'Ceramic Bezel',
  'Diamond Bezel',
  'Gold Bezel',
  'Sapphire Bezel',
  'Stainless Steel Bezel',
  'Fluted Bezel',
  'Smooth Bezel',
  'Engine-Turned Bezel',
  'Polished Bezel',
  'Gem-Set Bezel',
  'Ceramic Black',
  'Ceramic Blue',
  'Ceramic Green',
  'Ceramic Brown',
  'Cerachrom Black',
  'Cerachrom Blue',
  'Cerachrom Green',
  'Cerachrom Pepsi',
  'Cerachrom Batman',
  'White Gold Fluted',
  'Yellow Gold Fluted',
  'Rose Gold Fluted',
  'Platinum Fluted',
  'Two-Tone Fluted',
  'Aluminum Insert',
  'Bakelite Insert',
  'Matte Black',
  'Polished Black',
  'Diamond Set',
  'Baguette Diamond',
];

export function searchBezelOptions(query: string): string[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return BEZEL_OPTIONS.filter(bezel => 
    bezel.toLowerCase().includes(lowerQuery)
  );
}



