/**
 * Rolex Serial Number to Year Lookup
 * Based on test_serial_year database and YearbySerial.php logic
 */

interface SerialYearRange {
  letra: string;
  nroini: number;
  nrofin: number;
  year: string;
}

// Complete database from test_serial_year.sql
export const SERIAL_YEAR_DATA: SerialYearRange[] = [
  { letra: '', nroini: 0, nrofin: 20189, year: 'Pre-1926' },
  { letra: '', nroini: 20190, nrofin: 23968, year: '1927 or 1930 or 1954' },
  { letra: '', nroini: 23969, nrofin: 29311, year: '1930 or 1954' },
  { letra: '', nroini: 29312, nrofin: 29561, year: '1932 or 1954' },
  { letra: '', nroini: 29562, nrofin: 30822, year: '1933 or 1954' },
  { letra: '', nroini: 30823, nrofin: 34335, year: '1934 or 1954' },
  { letra: '', nroini: 34336, nrofin: 36855, year: '1935 or 1954' },
  { letra: '', nroini: 36856, nrofin: 40919, year: '1936 or 1954' },
  { letra: '', nroini: 40920, nrofin: 43738, year: '1937 or 1954' },
  { letra: '', nroini: 43739, nrofin: 71223, year: '1938 or 1954' },
  { letra: '', nroini: 71224, nrofin: 99774, year: '1939 or 1954' },
  { letra: '', nroini: 99775, nrofin: 106046, year: '1940 or 1955' },
  { letra: '', nroini: 106047, nrofin: 143508, year: '1941 or 1955' },
  { letra: '', nroini: 143509, nrofin: 230877, year: '1942 or 1956' },
  { letra: '', nroini: 230878, nrofin: 269560, year: '1943 or 1957' },
  { letra: '', nroini: 269561, nrofin: 302458, year: '1944 or 1957' },
  { letra: '', nroini: 302459, nrofin: 367945, year: '1945 or 1957' },
  { letra: '', nroini: 367946, nrofin: 529162, year: '1946 or 1958' },
  { letra: '', nroini: 529163, nrofin: 628839, year: '1947 or 1960' },
  { letra: '', nroini: 628840, nrofin: 643152, year: '1948 or 1960' },
  { letra: '', nroini: 643153, nrofin: 709248, year: '1948 or 1961' },
  { letra: '', nroini: 709249, nrofin: 726638, year: '1951 or 1961' },
  { letra: '', nroini: 726639, nrofin: 743999, year: '1952 or 1961' },
  { letra: '', nroini: 744000, nrofin: 823999, year: '1952 or 1962' },
  { letra: '', nroini: 824000, nrofin: 855725, year: '1952 or 1963' },
  { letra: '', nroini: 855726, nrofin: 999999, year: '1953 or 1963' },
  { letra: '', nroini: 1000000, nrofin: 1008888, year: '1963' },
  { letra: '', nroini: 1008889, nrofin: 1099999, year: '1964' },
  { letra: '', nroini: 1100000, nrofin: 1199999, year: '1965' },
  { letra: '', nroini: 1200000, nrofin: 1538434, year: '1966' },
  { letra: '', nroini: 1538435, nrofin: 1751999, year: '1967' },
  { letra: '', nroini: 1752000, nrofin: 1899999, year: '1968' },
  { letra: '', nroini: 1900000, nrofin: 2241881, year: '1969' },
  { letra: '', nroini: 2241882, nrofin: 2589294, year: '1970' },
  { letra: '', nroini: 2589295, nrofin: 2890458, year: '1971' },
  { letra: '', nroini: 2890459, nrofin: 3200267, year: '1972' },
  { letra: '', nroini: 3200268, nrofin: 3567926, year: '1973' },
  { letra: '', nroini: 3567927, nrofin: 3862195, year: '1974' },
  { letra: '', nroini: 3862196, nrofin: 4115298, year: '1975' },
  { letra: '', nroini: 4115299, nrofin: 4999999, year: '1976' },
  { letra: '', nroini: 5000000, nrofin: 5007999, year: '1977' },
  { letra: '', nroini: 5008000, nrofin: 5737029, year: '1978' },
  { letra: '', nroini: 5737030, nrofin: 6433999, year: '1979' },
  { letra: '', nroini: 6434000, nrofin: 6520869, year: '1980' },
  { letra: '', nroini: 6520870, nrofin: 7099999, year: '1981' },
  { letra: '', nroini: 7100000, nrofin: 7399999, year: '1982' },
  { letra: '', nroini: 7400000, nrofin: 8070021, year: '1983' },
  { letra: '', nroini: 8070022, nrofin: 8613999, year: '1984' },
  { letra: '', nroini: 8614000, nrofin: 8899999, year: '1985' },
  { letra: '', nroini: 8900000, nrofin: 9399999, year: '1986' },
  { letra: '', nroini: 9400000, nrofin: 9999999, year: '1987' },
  { letra: 'R', nroini: 1, nrofin: 598199, year: '1987' },
  { letra: 'R', nroini: 598200, nrofin: 999999, year: '1988' },
  { letra: 'L', nroini: 1, nrofin: 999999, year: '1989' },
  { letra: 'E', nroini: 1, nrofin: 999999, year: '1990' },
  { letra: 'X', nroini: 1, nrofin: 999999, year: '1991' },
  { letra: 'N', nroini: 1, nrofin: 999999, year: '1991' },
  { letra: 'C', nroini: 1, nrofin: 999999, year: '1992' },
  { letra: 'S', nroini: 1, nrofin: 860879, year: '1993' },
  { letra: 'S', nroini: 860880, nrofin: 999999, year: '1994' },
  { letra: 'W', nroini: 1, nrofin: 999999, year: '1995' },
  { letra: 'T', nroini: 1, nrofin: 999999, year: '1996' },
  { letra: 'U', nroini: 1, nrofin: 932143, year: '1997' },
  { letra: 'U', nroini: 932144, nrofin: 932145, year: '1997 or 1998' },
  { letra: 'U', nroini: 932146, nrofin: 999999, year: '1998' },
  { letra: 'A', nroini: 1, nrofin: 999999, year: '1999' },
  { letra: 'P', nroini: 1, nrofin: 999999, year: '2000' },
  { letra: 'K', nroini: 1, nrofin: 240999, year: '2000' },
  { letra: 'K', nroini: 241000, nrofin: 999999, year: '2001' },
  { letra: 'Y', nroini: 1, nrofin: 999999, year: '2002' },
  { letra: 'F', nroini: 1, nrofin: 26999, year: '2003' },
  { letra: 'F', nroini: 27000, nrofin: 893650, year: '2004' },
  { letra: 'F', nroini: 893651, nrofin: 999999, year: '2005' },
  { letra: 'D', nroini: 1, nrofin: 999999, year: '2005 or 2006' },
  { letra: 'Z', nroini: 1, nrofin: 999999, year: '2006 or 2007' },
  { letra: 'M', nroini: 1, nrofin: 999999, year: '2007 or 2008' },
  { letra: 'V', nroini: 1, nrofin: 999999, year: '2008 or 2009' },
  { letra: 'G', nroini: 1, nrofin: 999999, year: '2010' },
  { letra: '', nroini: 0, nrofin: 0, year: '2011-2025' },
];

/**
 * Get year from Rolex serial number
 * Replicates exact logic from YearbySerial.php
 */
export function getYearFromSerial(serial: string): string {
  if (!serial || serial.length === 0) {
    return 'Unknown';
  }

  const serialUpper = serial.toUpperCase().trim();
  const currentYear = new Date().getFullYear();

  // If serial has 8 digits → 2011-current year (random serial system)
  if (serialUpper.length === 8 && /^\d{8}$/.test(serialUpper)) {
    return `2011-${currentYear}`;
  }

  // If serial has 7 or less characters
  if (serialUpper.length <= 7) {
    // Check if first character is a letter
    if (!/^\d/.test(serialUpper[0])) {
      const letra = serialUpper[0];
      const resto = serialUpper.substring(1);

      // If rest is numeric
      if (/^\d+$/.test(resto)) {
        const num = parseInt(resto, 10);
        const result = SERIAL_YEAR_DATA.find(
          item => item.letra === letra && item.nroini <= num && item.nrofin >= num
        );
        return result ? result.year : 'Unknown';
      } else {
        // Not numeric, just find by letter
        const result = SERIAL_YEAR_DATA.find(item => item.letra === letra);
        return result ? result.year : 'Unknown';
      }
    }
    // If all numeric
    else if (/^\d+$/.test(serialUpper)) {
      const num = parseInt(serialUpper, 10);
      const result = SERIAL_YEAR_DATA.find(
        item => item.letra === '' && item.nroini <= num && item.nrofin >= num
      );
      return result ? result.year : 'Unknown';
    }
  }

  return 'Unknown';
}

/**
 * Validate if serial format is correct
 */
export function isValidRolexSerial(serial: string): boolean {
  if (!serial || serial.length === 0) return false;
  
  const serialUpper = serial.toUpperCase().trim();
  
  // 8 digits (modern)
  if (/^\d{8}$/.test(serialUpper)) return true;
  
  // Letter + numbers (vintage)
  if (/^[A-Z]\d{1,6}$/.test(serialUpper)) return true;
  
  // All numbers (vintage)
  if (/^\d{1,7}$/.test(serialUpper)) return true;
  
  return false;
}

/**
 * Format serial number (uppercase, trim)
 */
export function formatSerial(serial: string): string {
  return serial.toUpperCase().trim();
}



