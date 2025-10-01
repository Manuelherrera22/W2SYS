'use client';

import * as React from 'react';
import { RolexFormData } from '@/lib/types-rolex';
import { RolexModel } from '@/lib/rolex-data';
import { searchRolexModelsAPI } from '@/lib/api/rolex-api';
import { getYearFromSerial, isValidRolexSerial } from '@/lib/serial-year-lookup';
import { searchBezelOptions } from '@/lib/data/bezel-options';
import { useSerialValidator } from '@/lib/validation/SerialValidator';
import { ImageUpload } from './ImageUpload';

interface RolexProductFormProps {
  onSubmit: (data: RolexFormData) => void;
  onClose: () => void;
  initialData?: Partial<RolexFormData>;
}

export function RolexProductForm({ onSubmit, onClose, initialData }: RolexProductFormProps) {
  const { validateSerial } = useSerialValidator();
  const [serialValidation, setSerialValidation] = React.useState<any>(null);
  const [validatingSerial, setValidatingSerial] = React.useState(false);

  const [formData, setFormData] = React.useState<RolexFormData>({
    case: initialData?.case || '',
    model: initialData?.model || '',
    material: initialData?.material || '',
    bezel: initialData?.bezel || '',
    brazalete: initialData?.brazalete || '',
    provider: initialData?.provider || '',
    serial: initialData?.serial || '',
    year: initialData?.year || '',
    end_piece_code: initialData?.end_piece_code || '',
    movement_number: initialData?.movement_number || '',
    cost: initialData?.cost || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    in_card: initialData?.in_card || false,
    in_papers: initialData?.in_papers || false,
    in_services_papers: initialData?.in_services_papers || false,
    in_has_box: initialData?.in_has_box || false,
    in_third_party_inventory: initialData?.in_third_party_inventory || false,
    images: initialData?.images || [],
  });

  // Autocomplete state for Case
  const [caseInput, setCaseInput] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<RolexModel[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // Autocomplete state for Brazalete
  const [brazaleteInput, setBrazaleteInput] = React.useState('');
  const [showBrazaleteSuggestions, setShowBrazaleteSuggestions] = React.useState(false);
  const [brazaleteSuggestions, setBrazaleteSuggestions] = React.useState<any[]>([]);
  const [brazaleteSelectedIndex, setBrazaleteSelectedIndex] = React.useState(-1);

  // Autocomplete state for Bezel
  const [bezelInput, setBezelInput] = React.useState('');
  const [showBezelSuggestions, setShowBezelSuggestions] = React.useState(false);
  const [bezelSuggestions, setBezelSuggestions] = React.useState<string[]>([]);
  const [bezelSelectedIndex, setBezelSelectedIndex] = React.useState(-1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSerialChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const serialUpper = e.target.value.toUpperCase();
    setFormData({ ...formData, serial: serialUpper });

    // Auto-detect year from serial number (W2SYS original logic)
    if (serialUpper.length >= 4) {
      const detectedYear = getYearFromSerial(serialUpper);
      if (detectedYear !== 'Unknown') {
        setFormData(prev => ({ ...prev, serial: serialUpper, year: detectedYear }));
      }
    }

    // Validar serial en tiempo real
    if (serialUpper.length >= 4) {
      setValidatingSerial(true);
      try {
        const validation = await validateSerial(serialUpper);
        setSerialValidation(validation);
      } catch (error) {
        console.error('Error validating serial:', error);
      } finally {
        setValidatingSerial(false);
      }
    } else {
      setSerialValidation(null);
    }
  };

  // Brazalete autocomplete logic
  const handleBrazaleteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBrazaleteInput(value);
    setFormData({ ...formData, brazalete: value });
    
    if (value.length >= 2) {
      // Simple predefined list
      const commonBracelets = [
        { name: 'Oyster', code: '70200', material: 'Stainless Steel', model: 'Various' },
        { name: 'Jubilee', code: '62510', material: 'Stainless Steel', model: 'Datejust' },
        { name: 'President', code: '83218', material: 'Gold', model: 'Day-Date' },
        { name: 'Oysterflex', code: 'OYF', material: 'Rubber', model: 'Daytona' },
        { name: 'Pearlmaster', code: '80318', material: 'Gold', model: 'Pearlmaster' },
      ];
      
      const lowerQuery = value.toLowerCase();
      const filtered = commonBracelets.filter(b => 
        b.name.toLowerCase().includes(lowerQuery) ||
        b.code.toLowerCase().includes(lowerQuery)
      );
      
      setBrazaleteSuggestions(filtered);
      setShowBrazaleteSuggestions(filtered.length > 0);
      setBrazaleteSelectedIndex(-1);
    } else {
      setBrazaleteSuggestions([]);
      setShowBrazaleteSuggestions(false);
    }
  };

  const handleBrazaleteSelect = (bracelet: any) => {
    setBrazaleteInput(bracelet.name);
    setFormData({ ...formData, brazalete: bracelet.name });
    setShowBrazaleteSuggestions(false);
    setBrazaleteSuggestions([]);
  };

  const handleBrazaleteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showBrazaleteSuggestions || brazaleteSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setBrazaleteSelectedIndex(prev => (prev < brazaleteSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setBrazaleteSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (brazaleteSelectedIndex >= 0 && brazaleteSelectedIndex < brazaleteSuggestions.length) {
        handleBrazaleteSelect(brazaleteSuggestions[brazaleteSelectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowBrazaleteSuggestions(false);
    }
  };

  // Bezel autocomplete logic
  const handleBezelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBezelInput(value);
    setFormData({ ...formData, bezel: value });
    
    if (value.length >= 2) {
      const results = searchBezelOptions(value);
      setBezelSuggestions(results);
      setShowBezelSuggestions(results.length > 0);
      setBezelSelectedIndex(-1);
    } else {
      setBezelSuggestions([]);
      setShowBezelSuggestions(false);
    }
  };

  const handleBezelSelect = (bezel: string) => {
    setBezelInput(bezel);
    setFormData({ ...formData, bezel });
    setShowBezelSuggestions(false);
    setBezelSuggestions([]);
  };

  const handleBezelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showBezelSuggestions || bezelSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setBezelSelectedIndex(prev => (prev < bezelSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setBezelSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (bezelSelectedIndex >= 0 && bezelSelectedIndex < bezelSuggestions.length) {
        handleBezelSelect(bezelSuggestions[bezelSelectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowBezelSuggestions(false);
    }
  };

  // Case autocomplete logic with API support
  const handleCaseInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCaseInput(value);
    
    if (value.length >= 2) {
      // Buscar en API o base de datos local
      const results = await searchRolexModelsAPI(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCaseSelect = (model: RolexModel) => {
    setCaseInput(model.case);
    setFormData({
      ...formData,
      case: model.case,
      model: model.model,
      material: model.material,
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleCaseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleCaseSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Case with Autocomplete */}
          <div className="relative">
            <div className="font-bold">Case</div>
            <div className="relative">
              <input
                autoComplete="off"
                placeholder="Enter the Case"
                aria-autocomplete="list"
                aria-controls="autocomplete-list"
                aria-expanded={showSuggestions}
                className="mt-0 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
                type="text"
                value={caseInput}
                onChange={handleCaseInputChange}
                onKeyDown={handleCaseKeyDown}
                onFocus={() => {
                  if (caseInput.length >= 2 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
              />
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  id="autocomplete-list"
                  className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-boxdark shadow-lg"
                >
                  {suggestions.map((model, index) => (
                    <div
                      key={`${model.case}-${index}`}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-meta-4 ${
                        index === selectedIndex ? 'bg-gray-100 dark:bg-meta-4' : ''
                      }`}
                      onClick={() => handleCaseSelect(model)}
                    >
                      <div className="text-gray-800 dark:text-white">
                        {model.fullDescription}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Model (Auto-filled from Case selection) */}
          <div>
            <div className="font-bold"></div>
            <div className="">
              <label><b>Model</b></label>
              <div className="mt-0 flex h-12 w-full items-center rounded-xl border bg-slate-200 dark:bg-slate-700 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white">
                <input
                  className="w-full bg-transparent outline-none text-gray-600 dark:text-gray-400"
                  type="text"
                  value={formData.model}
                  readOnly
                  placeholder="Auto-filled from Case"
                />
              </div>
            </div>
          </div>

          {/* Material (Auto-filled from Case selection) */}
          <div>
            <div className="font-bold"></div>
            <div className="">
              <label><b>Material</b></label>
              <div className="mt-0 flex h-12 w-full items-center rounded-xl border bg-slate-200 dark:bg-slate-700 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white">
                <input
                  className="w-full bg-transparent outline-none text-gray-600 dark:text-gray-400"
                  type="text"
                  value={formData.material}
                  readOnly
                  placeholder="Auto-filled from Case"
                />
              </div>
            </div>
          </div>

          {/* Bezel with Autocomplete */}
          <div className="relative">
            <div className="font-bold">Bezel *</div>
            <div className="relative">
              <input
                autoComplete="off"
                placeholder="Enter the bezel"
                aria-autocomplete="list"
                aria-controls="autocomplete-list-bezel"
                aria-expanded={showBezelSuggestions}
                className="mt-0 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
                type="text"
                value={bezelInput}
                onChange={handleBezelInputChange}
                onKeyDown={handleBezelKeyDown}
                onFocus={() => {
                  if (bezelInput.length >= 2 && bezelSuggestions.length > 0) {
                    setShowBezelSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowBezelSuggestions(false), 200);
                }}
                required
              />
              
              {/* Bezel Autocomplete Dropdown */}
              {showBezelSuggestions && bezelSuggestions.length > 0 && (
                <div 
                  id="autocomplete-list-bezel"
                  className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-boxdark shadow-lg"
                >
                  {bezelSuggestions.map((bezel, index) => (
                    <div
                      key={`${bezel}-${index}`}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-meta-4 ${
                        index === bezelSelectedIndex ? 'bg-gray-100 dark:bg-meta-4' : ''
                      }`}
                      onClick={() => handleBezelSelect(bezel)}
                    >
                      <div className="text-gray-800 dark:text-white">
                        {bezel}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Brazalete with Autocomplete */}
          <div className="relative">
            <div className="font-bold">Brazalete</div>
            <div className="relative">
              <input
                autoComplete="off"
                placeholder="Enter the bracelet"
                aria-autocomplete="list"
                aria-controls="autocomplete-list-brazalete"
                aria-expanded={showBrazaleteSuggestions}
                className="mt-0 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
                type="text"
                value={brazaleteInput}
                onChange={handleBrazaleteInputChange}
                onKeyDown={handleBrazaleteKeyDown}
                onFocus={() => {
                  if (brazaleteInput.length >= 2 && brazaleteSuggestions.length > 0) {
                    setShowBrazaleteSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowBrazaleteSuggestions(false), 200);
                }}
              />
              
              {/* Brazalete Autocomplete Dropdown */}
              {showBrazaleteSuggestions && brazaleteSuggestions.length > 0 && (
                <div 
                  id="autocomplete-list-brazalete"
                  className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-boxdark shadow-lg"
                >
                  {brazaleteSuggestions.map((bracelet, index) => (
                    <div
                      key={`${bracelet.code}-${index}`}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-meta-4 ${
                        index === brazaleteSelectedIndex ? 'bg-gray-100 dark:bg-meta-4' : ''
                      }`}
                      onClick={() => handleBrazaleteSelect(bracelet)}
                    >
                      <div className="text-gray-800 dark:text-white font-medium">
                        {bracelet.name}
                      </div>
                      {bracelet.code && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {bracelet.code} | Material: {bracelet.material}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Provider */}
          <div>
            <div className="font-bold">Provider</div>
            <div className="undefined">
              <input
                autoComplete="off"
                placeholder="Enter the provider"
                aria-autocomplete="list"
                aria-controls="autocomplete-list"
                aria-expanded="false"
                className="mt-0 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </div>
          </div>

          {/* Serial */}
          <div>
            <div className="font-bold">Serial *</div>
            <div className="undefined">
              <input
                autoComplete="off"
                id="serial"
                placeholder="Enter the serial"
                className={`w-full h-12 px-4 py-2 rounded-lg border outline-none transition-colors duration-300 uppercase border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-400 ${
                  serialValidation?.isStolen ? 'border-red-500 bg-red-50' : 
                  serialValidation?.isFake ? 'border-yellow-500 bg-yellow-50' :
                  serialValidation?.isValid ? 'border-green-500 bg-green-50' : ''
                }`}
                type="text"
                value={formData.serial}
                onChange={handleSerialChange}
                name="serial"
                required
              />
              
              {/* Validación del Serial */}
              {validatingSerial && (
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  🔍 Validando serial...
                </div>
              )}
              
              {serialValidation && !validatingSerial && (
                <div className={`mt-2 p-3 rounded-lg text-sm ${
                  serialValidation.isStolen ? 'bg-red-100 border border-red-300 text-red-800' :
                  serialValidation.isFake ? 'bg-yellow-100 border border-yellow-300 text-yellow-800' :
                  serialValidation.isValid ? 'bg-green-100 border border-green-300 text-green-800' :
                  'bg-blue-100 border border-blue-300 text-blue-800'
                }`}>
                  <div className="font-medium">
                    {serialValidation.isStolen ? '🚨 SERIAL REPORTADO COMO ROBADO' :
                     serialValidation.isFake ? '⚠️ Serial con patrón sospechoso' :
                     serialValidation.isValid ? '✅ Serial válido' :
                     '⚠️ Serial requiere verificación adicional'}
                  </div>
                  <div className="mt-1">
                    Confianza: {Math.round(serialValidation.confidence * 100)}%
                  </div>
                  {serialValidation.suggestions && serialValidation.suggestions.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium">Sugerencias:</div>
                      <ul className="list-disc list-inside mt-1">
                        {serialValidation.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Year (Auto-filled from Serial) */}
          <div>
            <div className="font-bold"></div>
            <div className="">
              <label><b>Year</b></label>
              <div className="mt-0 flex h-12 w-full items-center rounded-xl border bg-slate-200 dark:bg-slate-700 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white">
                <input
                  className="w-full bg-transparent outline-none text-gray-600 dark:text-gray-400"
                  type="text"
                  value={formData.year}
                  readOnly
                  placeholder="Auto-filled from Serial"
                  title="El año se calcula automáticamente basado en el número de serie"
                />
              </div>
            </div>
          </div>

          {/* End Piece code */}
          <div>
            <div className="font-bold">End Piece code</div>
            <div className="undefined">
              <input
                autoComplete="off"
                id="end_piece_code"
                placeholder="Enter the end piece code"
                className="w-full h-12 px-4 py-2 rounded-lg border outline-none transition-colors duration-300
                undefined
                border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                type="text"
                value={formData.end_piece_code}
                onChange={(e) => setFormData({ ...formData, end_piece_code: e.target.value })}
                name="end_piece_code"
              />
            </div>
          </div>

          {/* Movement number */}
          <div>
            <div className="font-bold">Movement number</div>
            <div className="undefined">
              <input
                autoComplete="off"
                id="movement_number"
                placeholder="Enter the movement number"
                className="w-full h-12 px-4 py-2 rounded-lg border outline-none transition-colors duration-300
                undefined
                border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                type="text"
                value={formData.movement_number}
                onChange={(e) => setFormData({ ...formData, movement_number: e.target.value })}
                name="movement_number"
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <div className="font-bold">Cost *</div>
            <div className="undefined">
              <input
                autoComplete="off"
                id="cost"
                placeholder="Enter the cost"
                className="w-full h-12 px-4 py-2 rounded-lg border outline-none transition-colors duration-300
                undefined
                border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                type="text"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                name="cost"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="font-bold">Price</div>
            <div className="undefined">
              <input
                autoComplete="off"
                id="price"
                placeholder="Enter the price"
                className="w-full h-12 px-4 py-2 rounded-lg border outline-none transition-colors duration-300
                undefined
                border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                name="price"
              />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <div className="font-bold">Description</div>
            <textarea
              className="w-full h-40 px-4 py-2 rounded-lg border outline-none transition-colors duration-300 border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-400"
              name="description"
              placeholder="Enter the description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Empty field for layout */}
          <div>
            <div className="undefined">
              <input
                autoComplete="off"
                placeholder="Enter the case"
                aria-autocomplete="list"
                aria-controls="autocomplete-list"
                aria-expanded="false"
                className="mt-0 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white opacity-0 pointer-events-none"
                type="text"
                value=""
                readOnly
                tabIndex={-1}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-2 p-3 h-auto min-h-12 w-full items-center rounded-xl border bg-white/0 text-sm outline-none duration-300 border-gray-200 dark:border-white/10">
            <div className="flex items-center">
              <input
                id="in_card"
                className="mr-2 h-5 w-5 rounded border outline-none border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary cursor-pointer"
                type="checkbox"
                name="in_card"
                checked={formData.in_card}
                onChange={(e) => setFormData({ ...formData, in_card: e.target.checked })}
              />
              <label htmlFor="in_card" className="text-sm text-navy-700 dark:text-white font-bold cursor-pointer">Card</label>
            </div>
            <div className="flex items-center">
              <input
                id="in_papers"
                className="mr-2 h-5 w-5 rounded border outline-none border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary cursor-pointer"
                type="checkbox"
                name="in_papers"
                checked={formData.in_papers}
                onChange={(e) => setFormData({ ...formData, in_papers: e.target.checked })}
              />
              <label htmlFor="in_papers" className="text-sm text-navy-700 dark:text-white font-bold cursor-pointer">Papers</label>
            </div>
            <div className="flex items-center">
              <input
                id="in_services_papers"
                className="mr-2 h-5 w-5 rounded border outline-none border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary cursor-pointer"
                type="checkbox"
                name="in_services_papers"
                checked={formData.in_services_papers}
                onChange={(e) => setFormData({ ...formData, in_services_papers: e.target.checked })}
              />
              <label htmlFor="in_services_papers" className="text-sm text-navy-700 dark:text-white font-bold cursor-pointer">Services papers</label>
            </div>
            <div className="flex items-center">
              <input
                id="in_has_box"
                className="mr-2 h-5 w-5 rounded border outline-none border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary cursor-pointer"
                type="checkbox"
                name="in_has_box"
                checked={formData.in_has_box}
                onChange={(e) => setFormData({ ...formData, in_has_box: e.target.checked })}
              />
              <label htmlFor="in_has_box" className="text-sm text-navy-700 dark:text-white font-bold cursor-pointer">Has box</label>
            </div>
            <div className="flex items-center">
              <input
                id="in_third_party_inventory"
                className="mr-2 h-5 w-5 rounded border outline-none border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary cursor-pointer"
                type="checkbox"
                name="in_third_party_inventory"
                checked={formData.in_third_party_inventory}
                onChange={(e) => setFormData({ ...formData, in_third_party_inventory: e.target.checked })}
              />
              <label htmlFor="in_third_party_inventory" className="text-sm text-navy-700 dark:text-white font-bold cursor-pointer">Third party inventory</label>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="p-4">
          <ImageUpload
            onImageUploaded={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
            initialImages={formData.images}
            maxImages={5}
          />
        </div>

        {/* Submit and Close Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 mb-2">
          <button
            className="flex w-full justify-center rounded p-2 font-medium transition duration-200 bg-primary text-white hover:bg-opacity-90"
            type="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="flex w-full justify-center rounded p-2 font-medium transition duration-200 bg-red-600 text-white hover:bg-opacity-90"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </form>
  );
}
