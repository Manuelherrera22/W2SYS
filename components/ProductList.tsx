'use client';

import * as React from 'react';
import { RolexProduct, ProductStatus, ServiceNeeds } from '@/lib/types-rolex';
import { Edit, Trash2, Search } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductListProps {
  products: RolexProduct[];
  onEdit: (product: RolexProduct) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (productId: string, status: ProductStatus) => void;
  onUpdateNeeds: (productId: string, needs: ServiceNeeds) => void;
  onSendToService: (productId: string, supplier: string) => void;
}

export function ProductList({ products, onEdit, onDelete, onUpdateStatus, onUpdateNeeds, onSendToService }: ProductListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProduct, setSelectedProduct] = React.useState<RolexProduct | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const itemsPerPage = 10;

  const filteredProducts = products.filter(product =>
    product.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.case.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (product: RolexProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-3 text-left font-medium">Serial</th>
              <th className="px-4 py-3 text-left font-medium">Reference</th>
              <th className="px-4 py-3 text-left font-medium">Cost</th>
              <th className="px-4 py-3 text-left font-medium">Model</th>
              <th className="px-4 py-3 text-left font-medium">Band</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Third</th>
              <th className="px-4 py-3 text-left font-medium">
                <select className="bg-transparent border-0 text-white font-medium cursor-pointer">
                  <option>Select Status</option>
                </select>
              </th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data to display
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr key={product.id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleViewDetails(product)}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {product.serial}
                      <Search className="h-3 w-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {product.case}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                    ${product.cost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {product.model}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {product.brazalete || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {product.in_third_party_inventory ? (
                      <span className="text-yellow-500">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={product.status || 'New'}
                      onChange={(e) => onUpdateStatus(product.id, e.target.value as ProductStatus)}
                      className="px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Needs">Needs</option>
                      <option value="On Service">On Service</option>
                      <option value="Returned">Returned</option>
                      <option value="Ready">Ready</option>
                      <option value="Sold">Sold</option>
                      <option value="RT Vendor">RT Vendor</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-primary hover:text-primary/80"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar este producto?')) {
                            onDelete(product.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Anterior
          </button>
          
          <span className="px-4 py-1 rounded bg-primary text-white font-medium">
            {currentPage}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
        onUpdateNeeds={onUpdateNeeds}
        onSendToService={onSendToService}
      />
    </div>
  );
}

