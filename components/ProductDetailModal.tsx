'use client';

import * as React from 'react';
import { RolexProduct, ServiceNeeds, ProductStatus } from '@/lib/types-rolex';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductDetailModalProps {
  product: RolexProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNeeds: (productId: string, needs: ServiceNeeds) => void;
  onSendToService: (productId: string, supplier: string) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onUpdateNeeds, onSendToService }: ProductDetailModalProps) {
  const [serviceNeeds, setServiceNeeds] = React.useState<ServiceNeeds>({
    adjust_movement: false,
    adjust_seconds_per_day: false,
    bezel: '',
    change_crystal: false,
    change_dial: false,
    change_flt: false,
    change_scratched_hands: '',
    dial: false,
    only_polish_where_marked: false,
    polish: '',
    polish_bracelet: '',
    polish_case_back: '',
    return_flt: false,
    service: '',
    urgent: '',
  });

  React.useEffect(() => {
    if (product?.service_needs) {
      setServiceNeeds(product.service_needs);
    }
  }, [product]);

  if (!product) return null;

  const handlePrintBarcode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrData = JSON.stringify({
      serial: product.serial,
      case: product.case,
      model: product.model,
      id: product.id
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${product.serial}</title>
          <style>
            body { font-family: Arial; text-align: center; margin: 20px; }
            .barcode-container { border: 2px solid #000; padding: 20px; background: white; display: inline-block; }
            .product-info { margin-top: 15px; font-size: 12px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <img src="${qrCodeUrl}" alt="QR Code" width="256" height="256" />
            <div class="product-info">
              <p><strong>Serial:</strong> ${product.serial}</p>
              <p><strong>Model:</strong> ${product.model}</p>
              <p><strong>Reference:</strong> ${product.case}</p>
            </div>
          </div>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px;">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmitNeeds = () => {
    onUpdateNeeds(product.id, serviceNeeds);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-boxdark p-0">
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl opacity-70 hover:opacity-100 z-50">×</button>

        <div className="p-6">
          {/* Product Information */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Left Column - Info */}
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">id <span className="text-gray-800 dark:text-white">{product.id.slice(0, 8)}</span></p>
              <p className="text-gray-600 dark:text-gray-400">
                name <span className="text-primary font-semibold">{product.case} Model:{product.model}, Size: 36, Material: {product.material}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">serial <span className="text-gray-800 dark:text-white">{product.serial}</span></p>
              <p className="text-gray-600 dark:text-gray-400">color <span className="text-gray-800 dark:text-white">{product.material}</span></p>
            </div>

            {/* Middle Column - Model & Band */}
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">customer_group_id <span className="text-gray-800 dark:text-white">3</span></p>
              <p className="text-gray-600 dark:text-gray-400">model <span className="text-gray-800 dark:text-white">{product.model}</span></p>
              <p className="text-gray-600 dark:text-gray-400">
                band <span className="text-gray-800 dark:text-white">{product.brazalete} - Bracelet End Link Width:20mm - Rolex Watch Model:Oyster Perpetual 36</span>
              </p>
            </div>

            {/* Right Column - Icon */}
            <div className="flex items-center justify-center">
              <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Service Needs Checkboxes */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.adjust_movement}
                onChange={(e) => setServiceNeeds({...serviceNeeds, adjust_movement: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">ADJUST MOVEMENT</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.adjust_seconds_per_day}
                onChange={(e) => setServiceNeeds({...serviceNeeds, adjust_seconds_per_day: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">ADJUST SECONDS PER DAY</span>
            </label>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">BEZEL</label>
              <input
                type="text"
                value={serviceNeeds.bezel}
                onChange={(e) => setServiceNeeds({...serviceNeeds, bezel: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.change_crystal}
                onChange={(e) => setServiceNeeds({...serviceNeeds, change_crystal: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">CHANGE CRYSTAL</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.change_dial}
                onChange={(e) => setServiceNeeds({...serviceNeeds, change_dial: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">CHANGE DIAL</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.change_flt}
                onChange={(e) => setServiceNeeds({...serviceNeeds, change_flt: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">CHANGE FLT</span>
            </label>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">CHANGE SCRATCHED HANDS</label>
              <input
                type="text"
                value={serviceNeeds.change_scratched_hands}
                onChange={(e) => setServiceNeeds({...serviceNeeds, change_scratched_hands: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.dial}
                onChange={(e) => setServiceNeeds({...serviceNeeds, dial: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">DIAL</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.only_polish_where_marked}
                onChange={(e) => setServiceNeeds({...serviceNeeds, only_polish_where_marked: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">ONLY POLISH WHERE MARKED</span>
            </label>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">POLISH</label>
              <input
                type="text"
                value={serviceNeeds.polish}
                onChange={(e) => setServiceNeeds({...serviceNeeds, polish: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">POLISH BRACELET</label>
              <input
                type="text"
                value={serviceNeeds.polish_bracelet}
                onChange={(e) => setServiceNeeds({...serviceNeeds, polish_bracelet: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">POLISH CASE BACK</label>
              <input
                type="text"
                value={serviceNeeds.polish_case_back}
                onChange={(e) => setServiceNeeds({...serviceNeeds, polish_case_back: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={serviceNeeds.return_flt}
                onChange={(e) => setServiceNeeds({...serviceNeeds, return_flt: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">RETURN FLT</span>
            </label>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">SERVICE</label>
              <input
                type="text"
                value={serviceNeeds.service}
                onChange={(e) => setServiceNeeds({...serviceNeeds, service: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">URGENT</label>
              <input
                type="text"
                value={serviceNeeds.urgent}
                onChange={(e) => setServiceNeeds({...serviceNeeds, urgent: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="empty"
              />
            </div>
          </div>

          {/* Brands and Model Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Brands: <span className="text-primary">{product.brazalete || '-'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Serial: <span className="text-gray-800 dark:text-white">{product.serial}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Invoice: <span className="text-gray-800 dark:text-white">{product.case}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Card: <span className="text-gray-800 dark:text-white">{product.in_card ? 'Yes' : 'No'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Paper: <span className="text-gray-800 dark:text-white">{product.in_papers ? 'Yes' : 'No'}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Models: <span className="text-gray-800 dark:text-white">{product.model}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Status: <span className="text-primary">{product.status || 'on_service'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Cost: <span className="text-gray-800 dark:text-white">{product.cost.toFixed(2)}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Box: <span className="text-gray-800 dark:text-white">{product.in_has_box ? 'Yes' : 'No'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Service Paper: <span className="text-gray-800 dark:text-white">{product.in_services_papers ? 'Yes' : 'No'}</span>
              </p>
            </div>
          </div>

          {/* Print Barcode Button */}
          <button
            onClick={handlePrintBarcode}
            className="w-full py-3 bg-primary text-white font-medium rounded hover:bg-opacity-90 transition-colors mb-6"
          >
            Print Barcode
          </button>

          {/* Services Tab */}
          <div className="mb-6">
            <div className="bg-primary text-white px-4 py-2 rounded-t font-semibold">Services</div>
            <div className="border border-stroke dark:border-strokedark rounded-b">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-2 text-left">Store</th>
                    <th className="px-4 py-2 text-left">Invoice</th>
                    <th className="px-4 py-2 text-left">Cost</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">Hermes</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">0.00</td>
                    <td className="px-4 py-2">new</td>
                    <td className="px-4 py-2">{new Date(product.createdAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* History */}
          <div className="mb-6">
            <div className="bg-primary text-white px-4 py-2 rounded-t font-semibold">History</div>
            <div className="border border-stroke dark:border-strokedark rounded-b p-4 bg-white dark:bg-boxdark max-h-48 overflow-y-auto">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">{new Date(product.createdAt).toLocaleString()}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-primary">Newton:</span> Created this service and status update to On Service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSubmitNeeds}
              className="w-full py-3 bg-primary text-white font-medium rounded hover:bg-opacity-90"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-cyan-500 text-white font-medium rounded hover:bg-opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
