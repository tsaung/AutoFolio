'use server'

import { createClient } from '@/lib/db/server'
import { revalidatePath } from 'next/cache'

export async function getSystemSetting(key: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error(`Error fetching system setting '${key}':`, error)
    }
    return null
  }

  return data.value
}

export async function updateSystemSetting(key: string, value: unknown) {
  const supabase = await createClient()

  // Verify auth first (although RLS should handle it, explicit check is good)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('system_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })

  if (error) {
    console.error(`Error updating system setting '${key}':`, error)
    throw new Error('Failed to update setting')
  }

  revalidatePath('/settings/ai') // Adjust path as needed
  return { success: true }
}
