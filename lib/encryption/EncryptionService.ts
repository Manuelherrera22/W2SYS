'use client';

import CryptoJS from 'crypto-js';
import React, { useMemo } from 'react';

// Clave de encriptación (en producción debería estar en variables de entorno)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'w2sys-encryption-key-2024';

export interface EncryptionService {
  encrypt: (text: string) => string;
  decrypt: (encryptedText: string) => string;
  encryptObject: (obj: Record<string, any>) => Record<string, any>;
  decryptObject: (encryptedObj: Record<string, any>) => Record<string, any>;
}

class EncryptionManager implements EncryptionService {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  encrypt(text: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, this.key).toString();
      return encrypted;
    } catch (error) {
      console.error('Error encrypting text:', error);
      return text; // Return original text if encryption fails
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedText, this.key).toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedText; // Return original if decryption fails
    } catch (error) {
      console.error('Error decrypting text:', error);
      return encryptedText; // Return encrypted text if decryption fails
    }
  }

  encryptObject(obj: Record<string, any>): Record<string, any> {
    const encrypted: Record<string, any> = {};
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      if (typeof value === 'string' && this.shouldEncrypt(key)) {
        encrypted[key] = this.encrypt(value);
      } else if (typeof value === 'number' && this.shouldEncrypt(key)) {
        // Convert number to string, encrypt, then store as string
        encrypted[key] = this.encrypt(value.toString());
      } else {
        encrypted[key] = value;
      }
    });
    
    return encrypted;
  }

  decryptObject(encryptedObj: Record<string, any>): Record<string, any> {
    const decrypted: Record<string, any> = {};
    
    Object.keys(encryptedObj).forEach(key => {
      const value = encryptedObj[key];
      
      if (typeof value === 'string' && this.shouldEncrypt(key)) {
        const decryptedValue = this.decrypt(value);
        // Try to convert back to number if it was originally a number
        if (this.isNumericField(key)) {
          const numValue = parseFloat(decryptedValue);
          decrypted[key] = isNaN(numValue) ? decryptedValue : numValue;
        } else {
          decrypted[key] = decryptedValue;
        }
      } else {
        decrypted[key] = value;
      }
    });
    
    return decrypted;
  }

  private shouldEncrypt(fieldName: string): boolean {
    const sensitiveFields = [
      'serial',
      'movement_number',
      'end_piece_code',
      'cost',
      'price',
      'description'
    ];
    
    return sensitiveFields.includes(fieldName.toLowerCase());
  }

  private isNumericField(fieldName: string): boolean {
    const numericFields = ['cost', 'price'];
    return numericFields.includes(fieldName.toLowerCase());
  }
}

// Instancia global del servicio de encriptación
export const encryptionService = new EncryptionManager(ENCRYPTION_KEY);

// Hook para usar encriptación en componentes React
export function useEncryption() {
  const encrypt = (text: string) => encryptionService.encrypt(text);
  const decrypt = (encryptedText: string) => encryptionService.decrypt(encryptedText);
  const encryptObject = (obj: Record<string, any>) => encryptionService.encryptObject(obj);
  const decryptObject = (encryptedObj: Record<string, any>) => encryptionService.decryptObject(encryptedObj);

  return {
    encrypt,
    decrypt,
    encryptObject,
    decryptObject,
  };
}

// Utilidades para campos específicos
export const encryptSerial = (serial: string) => encryptionService.encrypt(serial);
export const decryptSerial = (encryptedSerial: string) => encryptionService.decrypt(encryptedSerial);

export const encryptPrice = (price: number) => encryptionService.encrypt(price.toString());
export const decryptPrice = (encryptedPrice: string) => {
  const decrypted = encryptionService.decrypt(encryptedPrice);
  return parseFloat(decrypted) || 0;
};

export const encryptProduct = (product: any) => encryptionService.encryptObject(product);
export const decryptProduct = (encryptedProduct: any) => encryptionService.decryptObject(encryptedProduct);

// Componente para mostrar datos encriptados de forma segura
interface SecureDisplayProps {
  value: string | number;
  field: string;
  children?: React.ReactNode;
}

export function SecureDisplay({ value, field, children }: SecureDisplayProps) {
  const { decrypt } = useEncryption();
  
  const displayValue = useMemo(() => {
    if (typeof value === 'string' && encryptionService['shouldEncrypt'](field)) {
      return decrypt(value);
    }
    return value;
  }, [value, field, decrypt]);

  return (
    <span className="secure-display" data-field={field}>
      {children || displayValue}
    </span>
  );
}

// Hook para manejar datos encriptados en formularios
export function useSecureFormData<T extends Record<string, any>>(initialData: T) {
  const { encryptObject, decryptObject } = useEncryption();
  const [formData, setFormData] = React.useState<T>(initialData);

  const updateField = React.useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const getEncryptedData = React.useCallback(() => {
    return encryptObject(formData);
  }, [formData, encryptObject]);

  const getDecryptedData = React.useCallback(() => {
    return decryptObject(formData);
  }, [formData, decryptObject]);

  return {
    formData,
    updateField,
    getEncryptedData,
    getDecryptedData,
    setFormData,
  };
}
