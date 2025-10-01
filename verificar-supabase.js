// Script para verificar el estado de Supabase
// Ejecutar en la consola del navegador después de corregir RLS

async function verificarSupabase() {
  console.log('🔍 Verificando conexión con Supabase...');
  
  try {
    // Verificar conexión básica
    const response = await fetch('https://wverkbbgofndagwekaap.supabase.co/rest/v1/rolex_products?select=count', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ'
      }
    });
    
    if (response.ok) {
      console.log('✅ Conexión con Supabase exitosa');
      console.log('✅ Tabla rolex_products accesible');
      
      // Intentar insertar un producto de prueba
      const testProduct = {
        case: 'TEST001',
        model: 'Test Model',
        material: 'Steel',
        bezel: 'Smooth',
        brazalete: 'Oyster',
        provider: 'Test Provider',
        serial: '12345678',
        year: '2024',
        end_piece_code: 'TEST',
        movement_number: 12345,
        cost: 1000,
        price: 1500,
        description: 'Producto de prueba',
        in_card: true,
        in_papers: true,
        in_services_papers: false,
        in_has_box: true,
        in_third_party_inventory: false,
        images: [],
        status: 'New'
      };
      
      const insertResponse = await fetch('https://wverkbbgofndagwekaap.supabase.co/rest/v1/rolex_products', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testProduct)
      });
      
      if (insertResponse.ok) {
        console.log('✅ Inserción de productos funcionando');
        console.log('✅ RLS corregido exitosamente');
        
        // Eliminar el producto de prueba
        const result = await insertResponse.json();
        if (result && result[0] && result[0].id) {
          await fetch(`https://wverkbbgofndagwekaap.supabase.co/rest/v1/rolex_products?id=eq.${result[0].id}`, {
            method: 'DELETE',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ'
            }
          });
          console.log('✅ Producto de prueba eliminado');
        }
      } else {
        console.error('❌ Error en inserción:', await insertResponse.text());
      }
      
    } else {
      console.error('❌ Error de conexión:', response.status, await response.text());
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar verificación
verificarSupabase();
