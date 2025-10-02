// Static serial validation data
// This replaces the API route for static export compatibility

export interface SerialValidationResult {
  serial: string;
  isFake: boolean;
  isStolen: boolean;
  isValid: boolean;
  year?: number;
}

// Mock data for serial validation
const SERIAL_DATABASE = new Map<string, SerialValidationResult>([
  // Valid serials
  ['1234567', { serial: '1234567', isFake: false, isStolen: false, isValid: true, year: 2023 }],
  ['2345678', { serial: '2345678', isFake: false, isStolen: false, isValid: true, year: 2022 }],
  ['3456789', { serial: '3456789', isFake: false, isStolen: false, isValid: true, year: 2021 }],
  ['4567890', { serial: '4567890', isFake: false, isStolen: false, isValid: true, year: 2020 }],
  ['5678901', { serial: '5678901', isFake: false, isStolen: false, isValid: true, year: 2019 }],
  
  // Fake serials
  ['FAKE123', { serial: 'FAKE123', isFake: true, isStolen: false, isValid: false }],
  ['FAKE456', { serial: 'FAKE456', isFake: true, isStolen: false, isValid: false }],
  ['FAKE789', { serial: 'FAKE789', isFake: true, isStolen: false, isValid: false }],
  
  // Stolen serials
  ['STOLEN1', { serial: 'STOLEN1', isFake: false, isStolen: true, isValid: false }],
  ['STOLEN2', { serial: 'STOLEN2', isFake: false, isStolen: true, isValid: false }],
  ['STOLEN3', { serial: 'STOLEN3', isFake: false, isStolen: true, isValid: false }],
]);

export function validateSerial(serial: string): SerialValidationResult {
  // Check if serial exists in database
  if (SERIAL_DATABASE.has(serial)) {
    return SERIAL_DATABASE.get(serial)!;
  }
  
  // Basic validation logic
  const isFake = serial.startsWith('FAKE');
  const isStolen = serial.startsWith('STOLEN');
  const isValid = !isFake && !isStolen && serial.length === 7 && /^\d+$/.test(serial);
  
  // Estimate year based on serial (mock logic)
  let year: number | undefined;
  if (isValid) {
    const serialNum = parseInt(serial);
    // Mock year calculation based on serial
    year = 2000 + (serialNum % 25);
  }
  
  return {
    serial,
    isFake,
    isStolen,
    isValid,
    year
  };
}

// Hook for React components
export function useSerialValidator() {
  const validateSerialNumber = (serial: string) => {
    return validateSerial(serial);
  };
  
  return {
    validateSerialNumber,
    isLoading: false,
    error: null
  };
}
