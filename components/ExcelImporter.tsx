'use client';

import * as React from 'react';
import { RolexProduct } from '@/lib/types-rolex';
import { importFromExcel, exportToExcel, downloadExcelTemplate } from '@/lib/excel-importer';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ExcelImporterProps {
  onImport: (products: RolexProduct[]) => void;
  existingProducts?: RolexProduct[];
}

export function ExcelImporter({ onImport, existingProducts = [] }: ExcelImporterProps) {
  const [importing, setImporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [previewData, setPreviewData] = React.useState<RolexProduct[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Por favor selecciona un archivo Excel (.xlsx o .xls)');
      return;
    }

    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const products = await importFromExcel(file);
      
      if (products.length === 0) {
        setError('El archivo Excel está vacío o no tiene el formato correcto');
        setImporting(false);
        return;
      }

      setPreviewData(products);
      setSuccess(`✅ ${products.length} productos cargados. Revisa la vista previa y confirma la importación.`);
    } catch (err) {
      setError('Error al leer el archivo Excel. Verifica que tenga el formato correcto.');
      console.error(err);
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = () => {
    onImport(previewData);
    setPreviewData([]);
    setSuccess(`✅ ${previewData.length} productos importados exitosamente!`);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleCancelImport = () => {
    setPreviewData([]);
    setSuccess(null);
  };

  const handleExport = () => {
    if (existingProducts.length === 0) {
      setError('No hay productos para exportar');
      return;
    }
    exportToExcel(existingProducts, `rolex-products-${new Date().toISOString().split('T')[0]}.xlsx`);
    setSuccess('✅ Archivo Excel descargado exitosamente!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
    setSuccess('✅ Plantilla Excel descargada. Llena los datos y vuelve a importar.');
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
      <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Importar/Exportar Datos Excel
      </h3>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Import Excel */}
        <div>
          <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Upload className="h-10 w-10 text-primary mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Importar Excel
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              .xlsx, .xls
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              disabled={importing}
            />
          </label>
        </div>

        {/* Export Excel */}
        <button
          onClick={handleExport}
          disabled={existingProducts.length === 0}
          className="flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-boxdark p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-10 w-10 text-green-500 mb-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Exportar Excel
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {existingProducts.length} productos
          </span>
        </button>

        {/* Download Template */}
        <button
          onClick={handleDownloadTemplate}
          className="flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-boxdark p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <FileSpreadsheet className="h-10 w-10 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Descargar Plantilla
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Formato correcto
          </span>
        </button>
      </div>

      {/* Messages */}
      {importing && (
        <div className="flex items-center gap-2 p-4 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Procesando archivo Excel...
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {success && !previewData.length && (
        <div className="flex items-center gap-2 p-4 mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {/* Preview Data */}
      {previewData.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              Vista Previa ({previewData.length} productos)
            </h4>
            <div className="flex gap-2">
              <button
                onClick={handleCancelImport}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-colors"
              >
                Confirmar Importación
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3">Case</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Serial</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Bezel</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((product, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3 font-medium">{product.case || '-'}</td>
                    <td className="px-4 py-3">{product.model || '-'}</td>
                    <td className="px-4 py-3 uppercase">{product.serial || '-'}</td>
                    <td className="px-4 py-3">${product.cost.toLocaleString()}</td>
                    <td className="px-4 py-3">${product.price.toLocaleString()}</td>
                    <td className="px-4 py-3">{product.bezel || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="flex gap-1">
                        {product.in_card && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1 rounded">C</span>}
                        {product.in_papers && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1 rounded">P</span>}
                        {product.in_has_box && <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-1 rounded">B</span>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Mostrando 10 de {previewData.length} productos. Todos serán importados.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Instrucciones para Importar Excel
            </h5>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Descarga la plantilla Excel haciendo clic en "Descargar Plantilla"</li>
              <li>Llena tus datos siguiendo el formato de la plantilla</li>
              <li>Guarda el archivo Excel</li>
              <li>Haz clic en "Importar Excel" y selecciona tu archivo</li>
              <li>Revisa la vista previa y confirma la importación</li>
            </ol>
            <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
              <strong>Campos requeridos:</strong> Case, Bezel, Serial, Cost
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



