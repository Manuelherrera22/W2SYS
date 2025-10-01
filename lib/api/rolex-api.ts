import { RolexModel } from '../rolex-data';

// Try to import extracted data, fallback to hardcoded if not available
let ROLEX_CASES_IMPORTED: any[] = [];
let ROLEX_BRACELETS_IMPORTED: any[] = [];

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://w2sys.net/api';
const USE_LOCAL_DATA = !process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch Rolex models from API or local data
 */
export async function fetchRolexModels(): Promise<RolexModel[]> {
  if (USE_LOCAL_DATA) {
    // Usar data local si no hay API configurada
    const { ROLEX_MODELS } = await import('../rolex-data');
    return ROLEX_MODELS;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/basic/rolex`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching Rolex models from API, falling back to local data:', error);
    // Fallback a data local si falla el API
    const { ROLEX_MODELS } = await import('../rolex-data');
    return ROLEX_MODELS;
  }
}

/**
 * Load extracted data once
 */
async function loadExtractedData() {
  if (ROLEX_CASES_IMPORTED.length > 0) return;
  
  try {
    const casesModule = await import('../data/rolex-cases-data');
    ROLEX_CASES_IMPORTED = casesModule.ROLEX_CASES || [];
  } catch (error) {
    console.log('Extracted data not found. Using hardcoded data.');
  }
  
  try {
    const braceletsModule = await import('../data/rolex-bracelets-data');
    ROLEX_BRACELETS_IMPORTED = braceletsModule.ROLEX_BRACELETS_DATA || [];
  } catch (error) {
    console.log('Bracelets data not found.');
  }
}

/**
 * Search Rolex models by query
 */
export async function searchRolexModelsAPI(query: string): Promise<RolexModel[]> {
  if (!query || query.length < 2) return [];

  if (USE_LOCAL_DATA) {
    await loadExtractedData();
    
    // Try to use extracted data first
    if (ROLEX_CASES_IMPORTED.length > 0) {
      const lowerQuery = query.toLowerCase();
      return ROLEX_CASES_IMPORTED.filter((model: any) => {
        const reference = String(model.Reference || '');
        const modelName = String(model.Model || '');
        const materials = String(model.Materials || '');
        
        return reference.toLowerCase().includes(lowerQuery) ||
               modelName.toLowerCase().includes(lowerQuery) ||
               materials.toLowerCase().includes(lowerQuery);
      }).map((m: any) => ({
        case: String(m.Reference || ''),
        model: String(m.Model || ''),
        size: String(m['Case Size (mm)'] || ''),
        material: String(m.Materials || ''),
        fullDescription: `${m.Reference} Model:${m.Model}, Size: ${m['Case Size (mm)']}, Material: ${m.Materials}`
      }));
    }
    
    // Fallback to hardcoded data
    const { searchRolexModels } = await import('../rolex-data');
    return searchRolexModels(query);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/basic/rolex/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error searching Rolex models from API, falling back to local search:', error);
    const { searchRolexModels } = await import('../rolex-data');
    return searchRolexModels(query);
  }
}

/**
 * Get Rolex model by case number
 */
export async function getRolexModelByCaseAPI(caseNumber: string): Promise<RolexModel | undefined> {
  if (USE_LOCAL_DATA) {
    const { getRolexModelByCase } = await import('../rolex-data');
    return getRolexModelByCase(caseNumber);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/basic/rolex/${caseNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching Rolex model from API, falling back to local data:', error);
    const { getRolexModelByCase } = await import('../rolex-data');
    return getRolexModelByCase(caseNumber);
  }
}

