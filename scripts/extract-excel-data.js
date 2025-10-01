/**
 * Script para extraer datos de los archivos Excel en Datosytest
 * Ejecutar con: node scripts/extract-excel-data.js
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('📊 Extrayendo datos de archivos Excel...\n');

// Create lib/data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'lib', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Creada carpeta: lib/data/\n');
}

// Paths to Excel files
const excelFiles = [
  'Datosytest/Rolex Case.xlsx',
  'Datosytest/Rolex Models.xlsx',
  'Datosytest/Rolex Bracelets.xlsx',
  'Datosytest/Rolex Case Merged.xlsx'
];

const results = {};

excelFiles.forEach(filePath => {
  try {
    console.log(`📂 Leyendo: ${filePath}`);
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    const fileName = path.basename(filePath, '.xlsx');
    results[fileName] = data;
    
    console.log(`   ✅ ${data.length} filas extraídas`);
    console.log(`   📋 Columnas: ${Object.keys(data[0] || {}).join(', ')}\n`);
    
    // Show first row as sample
    if (data.length > 0) {
      console.log('   📄 Muestra de datos:');
      console.log('   ', JSON.stringify(data[0], null, 2));
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

// Save to TypeScript file
console.log('\n💾 Guardando datos extraídos...');

// Save Rolex Cases
if (results['Rolex Case'] || results['Rolex Case Merged']) {
  const cases = results['Rolex Case Merged'] || results['Rolex Case'] || [];
  
  // Clean and normalize column names for TypeScript
  const cleanKey = (key) => {
    return key
      .replace(/\s+/g, '_')        // Espacios → _
      .replace(/[()]/g, '')        // Quitar paréntesis
      .replace(/[^\w]/g, '_')      // Caracteres especiales → _
      .replace(/_+/g, '_')         // Múltiples _ → uno solo
      .replace(/^_|_$/g, '');      // Quitar _ del inicio/fin
  };
  
  const firstRow = cases[0] || {};
  const interfaceProps = Object.keys(firstRow).map(key => {
    const cleanedKey = cleanKey(key);
    return `  '${key}': string | number;`;
  }).join('\n');
  
  const tsContent = `// Auto-generated from Excel files
// Generated: ${new Date().toISOString()}

export interface RolexCaseData {
${interfaceProps}
}

export const ROLEX_CASES: RolexCaseData[] = ${JSON.stringify(cases, null, 2)};
`;
  
  fs.writeFileSync('lib/data/rolex-cases-data.ts', tsContent);
  console.log(`✅ Guardado: lib/data/rolex-cases-data.ts (${cases.length} registros)`);
}

// Save Rolex Models
if (results['Rolex Models']) {
  const models = results['Rolex Models'];
  
  const firstRow = models[0] || {};
  const interfaceProps = Object.keys(firstRow).map(key => {
    return `  '${key}': string | number;`;
  }).join('\n');
  
  const tsContent = `// Auto-generated from Excel files
// Generated: ${new Date().toISOString()}

export interface RolexModelData {
${interfaceProps}
}

export const ROLEX_MODELS_DATA: RolexModelData[] = ${JSON.stringify(models, null, 2)};
`;
  
  fs.writeFileSync('lib/data/rolex-models-data.ts', tsContent);
  console.log(`✅ Guardado: lib/data/rolex-models-data.ts (${models.length} registros)`);
}

// Save Rolex Bracelets
if (results['Rolex Bracelets']) {
  const bracelets = results['Rolex Bracelets'];
  
  const firstRow = bracelets[0] || {};
  const interfaceProps = Object.keys(firstRow).map(key => {
    return `  '${key}': string | number;`;
  }).join('\n');
  
  const tsContent = `// Auto-generated from Excel files
// Generated: ${new Date().toISOString()}

export interface RolexBraceletData {
${interfaceProps}
}

export const ROLEX_BRACELETS_DATA: RolexBraceletData[] = ${JSON.stringify(bracelets, null, 2)};
`;
  
  fs.writeFileSync('lib/data/rolex-bracelets-data.ts', tsContent);
  console.log(`✅ Guardado: lib/data/rolex-bracelets-data.ts (${bracelets.length} registros)`);
}

console.log('\n🎉 ¡Datos extraídos exitosamente!');
console.log('\n📋 Archivos generados:');
console.log('   - lib/data/rolex-cases-data.ts');
console.log('   - lib/data/rolex-models-data.ts');
console.log('   - lib/data/rolex-bracelets-data.ts');
console.log('\n✨ Ahora puedes usar estos datos en tu aplicación!\n');

