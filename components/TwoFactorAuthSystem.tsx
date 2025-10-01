'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  Download,
  QrCode,
  Clock,
  Lock,
  Unlock
} from 'lucide-react';

interface TwoFactorAuth {
  isEnabled: boolean;
  method: 'sms' | 'email' | 'app' | 'backup';
  phoneNumber?: string;
  email?: string;
  backupCodes: string[];
  lastUsed?: string;
  qrCode?: string;
  secretKey?: string;
}

interface LoginAttempt {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  method?: string;
  location?: string;
}

export function TwoFactorAuthSystem() {
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth>({
    isEnabled: false,
    method: 'app',
    backupCodes: [],
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    secretKey: 'JBSWY3DPEHPK3PXP'
  });

  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([
    {
      id: '1',
      timestamp: '2024-01-15 10:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      success: true,
      method: 'app',
      location: 'New York, NY'
    },
    {
      id: '2',
      timestamp: '2024-01-14 15:45:00',
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      success: false,
      method: 'sms',
      location: 'Unknown'
    }
  ]);

  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | 'app'>('app');

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    return codes;
  };

  const enableTwoFactor = async () => {
    setIsVerifying(true);
    
    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (verificationCode === '123456' || verificationCode.length === 6) {
      const backupCodes = generateBackupCodes();
      
      setTwoFactorAuth({
        ...twoFactorAuth,
        isEnabled: true,
        method: selectedMethod,
        backupCodes,
        lastUsed: new Date().toISOString()
      });
      
      setIsSetupDialogOpen(false);
      setVerificationCode('');
    } else {
      alert('Código de verificación inválido');
    }
    
    setIsVerifying(false);
  };

  const disableTwoFactor = () => {
    setTwoFactorAuth({
      ...twoFactorAuth,
      isEnabled: false,
      backupCodes: [],
      lastUsed: undefined
    });
  };

  const sendVerificationCode = async (method: string) => {
    // Simular envío de código
    alert(`Código de verificación enviado por ${method}`);
  };

  const downloadBackupCodes = () => {
    const codesText = twoFactorAuth.backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(twoFactorAuth.secretKey || '');
    alert('Clave secreta copiada al portapapeles');
  };

  const securityStats = {
    totalAttempts: loginAttempts.length,
    successfulAttempts: loginAttempts.filter(a => a.success).length,
    failedAttempts: loginAttempts.filter(a => !a.success).length,
    uniqueIPs: new Set(loginAttempts.map(a => a.ipAddress)).size
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Autenticación de Dos Factores
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Protege tu cuenta con seguridad adicional
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Switch
            checked={twoFactorAuth.isEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setIsSetupDialogOpen(true);
              } else {
                disableTwoFactor();
              }
            }}
          />
          <Label className="text-sm font-medium">
            {twoFactorAuth.isEnabled ? 'Activado' : 'Desactivado'}
          </Label>
        </div>
      </div>

      {/* Estado de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado 2FA</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {twoFactorAuth.isEnabled ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span className="text-lg font-bold">
                {twoFactorAuth.isEnabled ? 'Protegido' : 'Desprotegido'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {twoFactorAuth.isEnabled ? 'Cuenta segura' : 'Recomendado activar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Método Activo</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">
              {twoFactorAuth.isEnabled ? twoFactorAuth.method : 'Ninguno'}
            </div>
            <p className="text-xs text-muted-foreground">
              {twoFactorAuth.isEnabled ? 'Método de autenticación' : 'No configurado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos Exitosos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityStats.successfulAttempts}</div>
            <p className="text-xs text-muted-foreground">
              De {securityStats.totalAttempts} intentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos Fallidos</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityStats.failedAttempts}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuración de 2FA */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {twoFactorAuth.isEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-200">
                        Autenticación de Dos Factores Activada
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Método: {twoFactorAuth.method} | Último uso: {twoFactorAuth.lastUsed ? new Date(twoFactorAuth.lastUsed).toLocaleDateString() : 'Nunca'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={disableTwoFactor}>
                    <Unlock className="h-4 w-4 mr-2" />
                    Desactivar
                  </Button>
                </div>

                {/* Códigos de Respaldo */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Códigos de Respaldo</h3>
                      <p className="text-sm text-gray-600">
                        Usa estos códigos si pierdes acceso a tu dispositivo de autenticación
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={downloadBackupCodes}>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4 mr-2" />
                            Ver Códigos
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Códigos de Respaldo</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              Guarda estos códigos en un lugar seguro. Cada código solo se puede usar una vez.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {twoFactorAuth.backupCodes.map((code, index) => (
                                <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-center font-mono">
                                  {code}
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                                Cerrar
                              </Button>
                              <Button onClick={downloadBackupCodes}>
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {twoFactorAuth.backupCodes.slice(0, 5).map((code, index) => (
                      <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-center font-mono text-sm">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuración de App Authenticator */}
                {twoFactorAuth.method === 'app' && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Configuración de App Authenticator</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Clave Secreta</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={twoFactorAuth.secretKey}
                            readOnly
                            className="font-mono"
                          />
                          <Button variant="outline" size="sm" onClick={copySecretKey}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Código QR</Label>
                        <div className="mt-2 p-4 border rounded-lg inline-block">
                          <img 
                            src={twoFactorAuth.qrCode} 
                            alt="QR Code" 
                            className="w-32 h-32"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Escanea este código con tu app de autenticación (Google Authenticator, Authy, etc.)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Autenticación de Dos Factores No Activada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Protege tu cuenta con una capa adicional de seguridad
                </p>
                <Button onClick={() => setIsSetupDialogOpen(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Activar 2FA
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historial de Intentos de Login */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Intentos de Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loginAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    {attempt.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {attempt.success ? 'Login Exitoso' : 'Login Fallido'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {attempt.timestamp} | {attempt.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      IP: {attempt.ipAddress} | Método: {attempt.method || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={attempt.success ? 'default' : 'destructive'}>
                    {attempt.success ? 'Exitoso' : 'Fallido'}
                  </Badge>
                  {attempt.method && (
                    <Badge variant="secondary">
                      {attempt.method.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Configuración */}
      <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Autenticación de Dos Factores</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Método de Autenticación</Label>
              <Select value={selectedMethod} onValueChange={(value: any) => setSelectedMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">App Authenticator</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedMethod === 'sms' && (
              <div>
                <Label>Número de Teléfono</Label>
                <Input placeholder="+1 234 567 8900" />
              </div>
            )}
            
            {selectedMethod === 'email' && (
              <div>
                <Label>Email</Label>
                <Input placeholder="email@ejemplo.com" />
              </div>
            )}
            
            <div>
              <Label>Código de Verificación</Label>
              <Input
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa el código de 6 dígitos de tu app authenticator
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSetupDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={enableTwoFactor} disabled={isVerifying}>
                {isVerifying ? 'Verificando...' : 'Activar 2FA'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
