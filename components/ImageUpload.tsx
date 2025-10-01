'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onImageUploaded: (urls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export function ImageUpload({ onImageUploaded, initialImages = [], maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = React.useState<string[]>(initialImages);
  const [uploading, setUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, maxImages - images.length); i++) {
        const file = files[i];
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert(`El archivo ${file.name} no es una imagen válida`);
          continue;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`El archivo ${file.name} es demasiado grande (máximo 5MB)`);
          continue;
        }

        // Generar nombre único para el archivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Subir a Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading file:', error);
          alert(`Error al subir ${file.name}: ${error.message}`);
          continue;
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImageUploaded(newImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // Extraer el nombre del archivo de la URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Eliminar de Supabase Storage
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting file:', error);
        alert('Error al eliminar la imagen');
        return;
      }

      // Actualizar estado local
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImageUploaded(newImages);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error al eliminar la imagen');
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Imágenes del Producto
      </label>
      
      {/* Área de Drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📸</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Subiendo imágenes...</span>
              </div>
            ) : images.length >= maxImages ? (
              'Máximo de imágenes alcanzado'
            ) : (
              <>
                Arrastra imágenes aquí o haz clic para seleccionar
                <br />
                <span className="text-xs">Máximo {maxImages} imágenes, 5MB cada una</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Producto ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Formatos soportados: JPG, PNG, GIF, WebP</p>
        <p>• Tamaño máximo: 5MB por imagen</p>
        <p>• Las imágenes se optimizan automáticamente</p>
      </div>
    </div>
  );
}
