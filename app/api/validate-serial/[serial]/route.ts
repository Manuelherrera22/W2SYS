import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { serial: string } }
) {
  try {
    const { serial } = params;
    
    if (!serial) {
      return NextResponse.json(
        { error: 'Serial number is required' },
        { status: 400 }
      );
    }

    // Simular validación de serial
    const isValid = validateRolexSerial(serial);
    const isStolen = checkStolenDatabase(serial);
    const isFake = checkFakeDatabase(serial);

    return NextResponse.json({
      serial,
      isValid,
      isStolen,
      isFake,
      status: isValid && !isStolen && !isFake ? 'valid' : 'invalid',
      message: getValidationMessage(isValid, isStolen, isFake)
    });
  } catch (error) {
    console.error('Error validating serial:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function validateRolexSerial(serial: string): boolean {
  // Validación básica de formato Rolex
  if (!serial || serial.length < 4 || serial.length > 8) {
    return false;
  }
  
  // Verificar que contenga solo números
  if (!/^\d+$/.test(serial)) {
    return false;
  }
  
  // Rangos de seriales válidos por año (simplificado)
  const serialNum = parseInt(serial);
  
  // Ejemplos de rangos válidos (simplificado)
  const validRanges = [
    { min: 1000000, max: 9999999 }, // Rango general
    { min: 100000, max: 999999 },   // Seriales más cortos
  ];
  
  return validRanges.some(range => serialNum >= range.min && serialNum <= range.max);
}

function checkStolenDatabase(serial: string): boolean {
  // Simular base de datos de relojes robados
  const stolenSerials = [
    '1234567',
    '2345678',
    '3456789',
    '4567890'
  ];
  
  return stolenSerials.includes(serial);
}

function checkFakeDatabase(serial: string): boolean {
  // Simular detección de seriales falsos
  const fakePatterns = [
    /^0000000/,  // Seriales que empiezan con muchos ceros
    /^1111111/,  // Seriales repetitivos
    /^9999999/,  // Seriales que terminan con muchos nueves
  ];
  
  return fakePatterns.some(pattern => pattern.test(serial));
}

function getValidationMessage(isValid: boolean, isStolen: boolean, isFake: boolean): string {
  if (!isValid) {
    return 'Formato de serial inválido';
  }
  
  if (isStolen) {
    return '⚠️ ADVERTENCIA: Este serial está reportado como robado';
  }
  
  if (isFake) {
    return '⚠️ ADVERTENCIA: Este serial parece ser falso';
  }
  
  return '✅ Serial válido';
}
