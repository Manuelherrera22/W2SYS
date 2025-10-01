// Rolex Watch Models Data
export interface RolexModel {
  case: string;
  model: string;
  size: string;
  material: string;
  fullDescription: string;
}

export const ROLEX_MODELS: RolexModel[] = [
  {
    case: '114060',
    model: 'Submariner',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '114060 Model:Submariner, Size: 40, Material: Stainless Steel'
  },
  {
    case: '116334',
    model: 'Datejust II',
    size: '41',
    material: 'Stainless Steel & White Gold',
    fullDescription: '116334 Model:Datejust II, Size: 41, Material: Stainless Steel & White Gold'
  },
  {
    case: '116400GV',
    model: 'Milgauss',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '116400GV Model:Milgauss, Size: 40, Material: Stainless Steel'
  },
  {
    case: '116500LN',
    model: 'Daytona',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '116500LN Model:Daytona, Size: 40, Material: Stainless Steel'
  },
  {
    case: '126600',
    model: 'Sea-Dweller',
    size: '43',
    material: 'Stainless Steel',
    fullDescription: '126600 Model:Sea-Dweller, Size: 43, Material: Stainless Steel'
  },
  {
    case: '116610LN',
    model: 'Submariner Date',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '116610LN Model:Submariner Date, Size: 40, Material: Stainless Steel'
  },
  {
    case: '116610LV',
    model: 'Submariner Date',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '116610LV Model:Submariner Date, Size: 40, Material: Stainless Steel (Green Bezel)'
  },
  {
    case: '126710BLRO',
    model: 'GMT-Master II',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '126710BLRO Model:GMT-Master II, Size: 40, Material: Stainless Steel'
  },
  {
    case: '116710LN',
    model: 'GMT-Master II',
    size: '40',
    material: 'Stainless Steel',
    fullDescription: '116710LN Model:GMT-Master II, Size: 40, Material: Stainless Steel'
  },
  {
    case: '116660',
    model: 'Sea-Dweller Deepsea',
    size: '44',
    material: 'Stainless Steel',
    fullDescription: '116660 Model:Sea-Dweller Deepsea, Size: 44, Material: Stainless Steel'
  },
  {
    case: '114300',
    model: 'Oyster Perpetual',
    size: '39',
    material: 'Stainless Steel',
    fullDescription: '114300 Model:Oyster Perpetual, Size: 39, Material: Stainless Steel'
  },
  {
    case: '116234',
    model: 'Datejust',
    size: '36',
    material: 'Stainless Steel & White Gold',
    fullDescription: '116234 Model:Datejust, Size: 36, Material: Stainless Steel & White Gold'
  },
  {
    case: '126300',
    model: 'Datejust',
    size: '41',
    material: 'Stainless Steel',
    fullDescription: '126300 Model:Datejust, Size: 41, Material: Stainless Steel'
  },
  {
    case: '116233',
    model: 'Datejust',
    size: '36',
    material: 'Stainless Steel & Yellow Gold',
    fullDescription: '116233 Model:Datejust, Size: 36, Material: Stainless Steel & Yellow Gold'
  },
  {
    case: '116518',
    model: 'Daytona',
    size: '40',
    material: 'Yellow Gold',
    fullDescription: '116518 Model:Daytona, Size: 40, Material: Yellow Gold'
  },
  {
    case: '116508',
    model: 'Daytona',
    size: '40',
    material: 'Yellow Gold',
    fullDescription: '116508 Model:Daytona, Size: 40, Material: Yellow Gold'
  },
  {
    case: '116613LB',
    model: 'Submariner Date',
    size: '40',
    material: 'Stainless Steel & Yellow Gold',
    fullDescription: '116613LB Model:Submariner Date, Size: 40, Material: Stainless Steel & Yellow Gold'
  },
  {
    case: '116618LB',
    model: 'Submariner Date',
    size: '40',
    material: 'Yellow Gold',
    fullDescription: '116618LB Model:Submariner Date, Size: 40, Material: Yellow Gold'
  },
  {
    case: '116758SA',
    model: 'GMT-Master II',
    size: '40',
    material: 'Yellow Gold',
    fullDescription: '116758SA Model:GMT-Master II, Size: 40, Material: Yellow Gold'
  }
];

export function searchRolexModels(query: string): RolexModel[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return ROLEX_MODELS.filter(model => 
    model.case.toLowerCase().includes(lowerQuery) ||
    model.model.toLowerCase().includes(lowerQuery) ||
    model.material.toLowerCase().includes(lowerQuery) ||
    model.fullDescription.toLowerCase().includes(lowerQuery)
  );
}

export function getRolexModelByCase(caseNumber: string): RolexModel | undefined {
  return ROLEX_MODELS.find(model => model.case === caseNumber);
}

