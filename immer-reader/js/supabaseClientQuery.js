import { supabase } from './supabaseClient'

async function fetchBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')

  if (error) {
    console.error('Error fetching books:', error)
  } else {
    console.log('Books:', data)
  }
}

fetchBooks()
