import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const translations_en = {
  "Products": "Products",
  "add_product_rolex": "Add Rolex",
  "Dashboard": "Dashboard",
  "serial": "Serial",
  "Case": "Case",
  "Model": "Model",
  "Material": "Material",
  "Bezel": "Bezel",
  "Brazalete": "Bracelet",
  "Provider": "Provider",
  "Year": "Year",
  "End Piece code": "End Piece code",
  "Movement number": "Movement number",
  "Cost": "Cost",
  "Price": "Price",
  "Description": "Description",
  "Submit": "Submit",
  "Close": "Close",
  "Add Product": "Add Product",
};

const translations_es = {
  "Products": "Productos",
  "add_product_rolex": "Agregar Rolex",
  "Dashboard": "Tablero",
  "serial": "Serial",
  "Case": "Caja",
  "Model": "Modelo",
  "Material": "Material",
  "Bezel": "Bisel",
  "Brazalete": "Brazalete",
  "Provider": "Proveedor",
  "Year": "Año",
  "End Piece code": "Código de pieza final",
  "Movement number": "Número de movimiento",
  "Cost": "Costo",
  "Price": "Precio",
  "Description": "Descripción",
  "Submit": "Enviar",
  "Close": "Cerrar",
  "Add Product": "Agregar Producto",
};

const getLangFromStorage = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('lang');
  if (stored) return stored;
  const cookie = document.cookie.split('; ').find(row => row.startsWith('lang='));
  return cookie ? cookie.split('=')[1] : 'en';
};

interface LanguageState {
  lang: string;
  translations: Record<string, string>;
}

const initialState: LanguageState = {
  lang: getLangFromStorage(),
  translations: getLangFromStorage() === 'en' ? translations_en : translations_es,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
      state.translations = action.payload === 'en' ? translations_en : translations_es;
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', action.payload);
        document.cookie = `lang=${action.payload}; path=/;`;
      }
    },
  },
});

export const { setLang } = languageSlice.actions;
export default languageSlice.reducer;



