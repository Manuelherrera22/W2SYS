import * as XLSX from 'xlsx';
import { RolexProduct } from './types-rolex';
import { RolexModel } from './rolex-data';

/**
 * Estructura esperada del Excel:
 * 
 * | Case | Model | Material | Bezel | Brazalete | Provider | Serial | Year | End Piece Code | Movement Number | Cost | Price | Description | Card | Papers | Services Papers | Has Box | Third Party |
 * |------|-------|----------|-------|-----------|----------|--------|------|----------------|-----------------|------|-------|-------------|------|--------|-----------------|---------|-------------|
 * 
 */

export interface ExcelRow {
  Case?: string;
  Model?: string;
  Material?: string;
  Bezel?: string;
  Brazalete?: string;
  Provider?: string;
  Serial?: string;
  Year?: string | number;
  'End Piece Code'?: string;
  'Movement Number'?: string;
  Cost?: string | number;
  Price?: string | number;
  Description?: string;
  Card?: string | boolean;
  Papers?: string | boolean;
  'Services Papers'?: string | boolean;
  'Has Box'?: string | boolean;
  'Third Party'?: string | boolean;
  Image?: string;
  
  // Alternativas en español
  Caja?: string;
  Modelo?: string;
  Bisel?: string;
  Proveedor?: string;
  Año?: string | number;
  'Código Pieza'?: string;
  'Número Movimiento'?: string;
  Costo?: string | number;
  Precio?: string | number;
  Descripción?: string;
  Tarjeta?: string | boolean;
  Papeles?: string | boolean;
  'Papeles Servicio'?: string | boolean;
  'Tiene Caja'?: string | boolean;
  'Terceros'?: string | boolean;
  Imagen?: string;
}

/**
 * Convert Excel boolean values to actual boolean
 */
function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === 'sí' || lower === 'si' || lower === '1' || lower === 'x';
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

/**
 * Convert Excel row to RolexProduct
 */
export function excelRowToProduct(row: ExcelRow, index: number): RolexProduct {
  const now = new Date().toISOString();
  
  return {
    id: `excel-import-${Date.now()}-${index}`,
    case: (row.Case || row.Caja || '').toString(),
    model: (row.Model || row.Modelo || '').toString(),
    material: (row.Material || '').toString(),
    bezel: (row.Bezel || row.Bisel || '').toString(),
    brazalete: (row.Brazalete || '').toString(),
    provider: (row.Provider || row.Proveedor || '').toString(),
    serial: (row.Serial || '').toString().toUpperCase(),
    year: (row.Year || row.Año || '').toString(),
    end_piece_code: (row['End Piece Code'] || row['Código Pieza'] || '').toString(),
    movement_number: (row['Movement Number'] || row['Número Movimiento'] || '').toString(),
    cost: parseFloat((row.Cost || row.Costo || '0').toString()) || 0,
    price: parseFloat((row.Price || row.Precio || '0').toString()) || 0,
    description: (row.Description || row.Descripción || '').toString(),
    in_card: parseBoolean(row.Card || row.Tarjeta),
    in_papers: parseBoolean(row.Papers || row.Papeles),
    in_services_papers: parseBoolean(row['Services Papers'] || row['Papeles Servicio']),
    in_has_box: parseBoolean(row['Has Box'] || row['Tiene Caja']),
    in_third_party_inventory: parseBoolean(row['Third Party'] || row['Terceros']),
    images: row.Image || row.Imagen ? [String(row.Image || row.Imagen)] : [],
    status: 'New' as const,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Import products from Excel file
 */
export async function importFromExcel(file: File): Promise<RolexProduct[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
        
        // Convert to RolexProduct array
        const products = jsonData.map((row, index) => excelRowToProduct(row, index));
        
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsBinaryString(file);
  });
}

/**
 * Export products to Excel
 */
export function exportToExcel(products: RolexProduct[], filename: string = 'rolex-products.xlsx') {
  // Convert products to Excel format
  const excelData = products.map(product => ({
    'Case': product.case,
    'Model': product.model,
    'Material': product.material,
    'Bezel': product.bezel,
    'Brazalete': product.brazalete,
    'Provider': product.provider,
    'Serial': product.serial,
    'Year': product.year,
    'End Piece Code': product.end_piece_code,
    'Movement Number': product.movement_number,
    'Cost': product.cost,
    'Price': product.price,
    'Description': product.description,
    'Card': product.in_card ? 'Yes' : 'No',
    'Papers': product.in_papers ? 'Yes' : 'No',
    'Services Papers': product.in_services_papers ? 'Yes' : 'No',
    'Has Box': product.in_has_box ? 'Yes' : 'No',
    'Third Party': product.in_third_party_inventory ? 'Yes' : 'No',
    'Image': product.images?.[0] || '',
    'Created At': product.createdAt,
    'Updated At': product.updatedAt,
  }));
  
  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Download
  XLSX.writeFile(workbook, filename);
}

/**
 * Generate Excel template for import
 */
export function downloadExcelTemplate() {
  const template = [
    {
      'Case': '114060',
      'Model': 'Submariner',
      'Material': 'Stainless Steel',
      'Bezel': 'Ceramic Black',
      'Brazalete': 'Oyster',
      'Provider': 'Official Dealer',
      'Serial': 'ABC123XYZ',
      'Year': '2020',
      'End Piece Code': 'EP001',
      'Movement Number': 'MV3130',
      'Cost': '8000',
      'Price': '12000',
      'Description': 'Full set with box and papers',
      'Card': 'Yes',
      'Papers': 'Yes',
      'Services Papers': 'No',
      'Has Box': 'Yes',
      'Third Party': 'No',
      'Image': 'https://example.com/image.jpg'
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  
  XLSX.writeFile(workbook, 'rolex-import-template.xlsx');
}



