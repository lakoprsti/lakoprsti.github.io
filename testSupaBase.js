import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dlwbdbirnuvuvkujyxdx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd2JkYmlybnV2dXZrdWp5eGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTg5NDcsImV4cCI6MjA2NjI3NDk0N30.a969Vv8g8AIkj57oq8ojc81W-1bknKbH6r2qCWrhaS8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {

  const { data, error } = await supabase.from('books').select('*')


  if (error) {
    console.error('❌ Error fetching data:', error.message)
  } else {
    console.log('✅ Successfully connected to Supabase!')
    console.log('📦 Data:', data)
  }

}

testConnection()


// VITAE_SUPABASE_URL=https://dlwbdbirnuvuvkujyxdx.supabase.co
// VITAE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd2JkYmlybnV2dXZrdWp5eGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTg5NDcsImV4cCI6MjA2NjI3NDk0N30.a969Vv8g8AIkj57oq8ojc81W-1bknKbH6r2qCWrhaS8



