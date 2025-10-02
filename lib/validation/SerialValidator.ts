'use client'

export interface SerialValidationResult {
  isValid: boolean
  isStolen: boolean
  isFake: boolean
  confidence: number
  message: string
  suggestions?: string[]
}

export class SerialValidator {
  private static instance: SerialValidator
  private stolenSerials: Set<string> = new Set()
  private fakePatterns: RegExp[] = [
    /^[0-9]{6,8}$/, // Patrones comunes de seriales falsos
    /^[A-Z]{2,4}[0-9]{4,6}$/,
    /^[0-9]{4}[A-Z]{2,4}$/
  ]

  static getInstance(): SerialValidator {
    if (!SerialValidator.instance) {
      SerialValidator.instance = new SerialValidator()
    }
    return SerialValidator.instance
  }

  // Validar formato de serial Rolex
  validateFormat(serial: string): boolean {
    if (!serial || serial.length < 4 || serial.length > 8) return false
    
    // Formato típico: letras + números o solo números
    const validPattern = /^[A-Z0-9]{4,8}$/
    return validPattern.test(serial.toUpperCase())
  }

  // Validar serial completo
  async validateSerial(serial: string): Promise<SerialValidationResult> {
    const upperSerial = serial.toUpperCase().trim()
    
    // Validar formato básico
    if (!this.validateFormat(upperSerial)) {
      return {
        isValid: false,
        isStolen: false,
        isFake: false,
        confidence: 0,
        message: 'Formato de serial inválido. Debe tener 4-8 caracteres alfanuméricos.'
      }
    }

    // Verificar si es un patrón conocido de falso
    const isFakePattern = this.fakePatterns.some(pattern => pattern.test(upperSerial))
    
    // Verificar en base de datos de seriales robados
    const isStolen = await this.checkStolenDatabase(upperSerial)
    
    // Verificar con API externa (si está disponible)
    const externalValidation = await this.validateWithExternalAPI(upperSerial)

    // Calcular confianza
    let confidence = 0.5 // Base
    if (isFakePattern) confidence -= 0.3
    if (isStolen) confidence -= 0.4
    if (externalValidation.isValid) confidence += 0.3

    // Determinar resultado
    const isValid = !isFakePattern && !isStolen && externalValidation.isValid
    const isFake = isFakePattern || externalValidation.isFake

    let message = ''
    if (isStolen) {
      message = '⚠️ SERIAL REPORTADO COMO ROBADO'
    } else if (isFake) {
      message = '❌ Serial con patrón sospechoso de ser falso'
    } else if (isValid) {
      message = '✅ Serial válido'
    } else {
      message = '⚠️ Serial con formato válido pero requiere verificación adicional'
    }

    return {
      isValid,
      isStolen,
      isFake,
      confidence: Math.max(0, Math.min(1, confidence)),
      message,
      suggestions: this.getSuggestions(upperSerial, isFake, isStolen)
    }
  }

  // Verificar en base de datos de seriales robados
  private async checkStolenDatabase(serial: string): Promise<boolean> {
    try {
      // Aquí podrías integrar con una API real de seriales robados
      // Por ahora, simulamos con algunos seriales de ejemplo
      const knownStolenSerials = [
        'ABC12345',
        'XYZ98765',
        'STOLEN1',
        'ROBBED2'
      ]
      
      return knownStolenSerials.includes(serial)
    } catch (error) {
      console.error('Error checking stolen database:', error)
      return false
    }
  }

  // Validar con API externa (ahora usando validación estática)
  private async validateWithExternalAPI(serial: string): Promise<{
    isValid: boolean
    isFake: boolean
    details?: any
  }> {
    try {
      // Usar validación estática en lugar de API
      const { validateSerial } = await import('./SerialValidatorStatic')
      const result = validateSerial(serial)
      
      return {
        isValid: result.isValid,
        isFake: result.isFake,
        details: result
      }
    } catch (error) {
      console.log('Static validation not available, using local validation')
    }

    // Fallback: validación local básica
    return this.localValidation(serial)
  }

  // Validación local básica
  private localValidation(serial: string): {
    isValid: boolean
    isFake: boolean
  } {
    // Reglas básicas para Rolex
    const length = serial.length
    
    // Seriales muy cortos o muy largos son sospechosos
    if (length < 4 || length > 8) {
      return { isValid: false, isFake: true }
    }

    // Patrones conocidos de seriales válidos
    const validPatterns = [
      /^[A-Z]{1,2}[0-9]{4,6}$/, // Ej: A123456, AB12345
      /^[0-9]{6,8}$/, // Ej: 12345678
      /^[A-Z]{3,4}[0-9]{3,4}$/ // Ej: ABC1234
    ]

    const matchesValidPattern = validPatterns.some(pattern => pattern.test(serial))
    
    return {
      isValid: matchesValidPattern,
      isFake: !matchesValidPattern
    }
  }

  // Obtener sugerencias
  private getSuggestions(serial: string, isFake: boolean, isStolen: boolean): string[] {
    const suggestions: string[] = []

    if (isStolen) {
      suggestions.push('No proceder con la compra')
      suggestions.push('Reportar a las autoridades')
      suggestions.push('Verificar con el propietario original')
    }

    if (isFake) {
      suggestions.push('Solicitar certificado de autenticidad')
      suggestions.push('Verificar con un experto en Rolex')
      suggestions.push('Revisar documentación del reloj')
    }

    if (serial.length < 6) {
      suggestions.push('Seriales Rolex típicamente tienen 6-8 caracteres')
    }

    if (!/^[A-Z0-9]+$/.test(serial)) {
      suggestions.push('Seriales Rolex solo contienen letras mayúsculas y números')
    }

    return suggestions
  }

  // Agregar serial robado a la base de datos local
  addStolenSerial(serial: string): void {
    this.stolenSerials.add(serial.toUpperCase())
  }

  // Obtener estadísticas de validación
  getValidationStats(): {
    totalChecked: number
    validCount: number
    fakeCount: number
    stolenCount: number
  } {
    // Implementar estadísticas si es necesario
    return {
      totalChecked: 0,
      validCount: 0,
      fakeCount: 0,
      stolenCount: 0
    }
  }
}

// Hook para usar el validador
export function useSerialValidator() {
  const validator = SerialValidator.getInstance()

  return {
    validateSerial: (serial: string) => validator.validateSerial(serial),
    validateFormat: (serial: string) => validator.validateFormat(serial),
    addStolenSerial: (serial: string) => validator.addStolenSerial(serial),
    getStats: () => validator.getValidationStats()
  }
}
