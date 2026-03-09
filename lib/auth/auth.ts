import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = createSupabaseServerClient()
  const user = await getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function signUp(email: string, password: string, fullName: string, role: string) {
  const supabase = createSupabaseServerClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  })

  if (error) throw error

  // Create profile
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    })

    // Create default subscription for recruiters
    if (role === 'recruiter') {
      await supabase.from('subscriptions').insert({
        user_id: data.user.id,
        plan_type: 'free',
        status: 'active',
        job_posts_limit: 3,
        job_posts_used: 0,
      })
    }
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createSupabaseServerClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  const supabase = createSupabaseServerClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) throw error
}
