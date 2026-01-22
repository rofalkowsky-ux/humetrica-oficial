// frontend/src/test-connection.js
import { supabase } from './lib/supabase'

async function testConnection() {
  // Test 1: Verificar conexión
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Error de conexión:', error)
  } else {
    console.log('✅ Conexión exitosa a Supabase')
    console.log('Data:', data)
  }
  
  // Test 2: Verificar que RLS funciona (debe fallar sin auth)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
  
  if (profileError) {
    console.log('✅ RLS funcionando (bloqueó acceso sin auth)')
  } else {
    console.warn('⚠️ RLS NO está funcionando correctamente')
  }
}

testConnection()