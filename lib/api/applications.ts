import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'

export async function getApplications(userId?: string, jobId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('applications')
    .select(`
      *,
      job:jobs(*),
      user:profiles(*)
    `)
    .order('applied_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (jobId) {
    query = query.eq('job_id', jobId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function createApplication(applicationData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('applications')
    .insert({
      ...applicationData,
      user_id: user.id,
    })
    .select(`
      *,
      job:jobs(*, recruiter:profiles(*))
    `)
    .single()

  if (error) throw error

  // Increment application count
  await supabase
    .from('jobs')
    .update({ applications_count: data.job.applications_count + 1 })
    .eq('id', applicationData.jobId)

  // Send notification to recruiter
  await supabase.from('notifications').insert({
    user_id: data.job.recruiter_id,
    type: 'new_application',
    title: 'New Application',
    message: `New application for ${data.job.title}`,
    link: `/applications/${data.id}`,
  })

  // Send email to recruiter
  if (data.job.recruiter?.email) {
    await sendEmail({
      to: data.job.recruiter.email,
      subject: 'New Job Application',
      html: `<p>You have a new application for ${data.job.title}</p>`,
    })
  }

  return data
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('applications')
    .update({ status, notes })
    .eq('id', id)
    .select(`
      *,
      user:profiles(*),
      job:jobs(*)
    `)
    .single()

  if (error) throw error

  // Notify candidate
  await supabase.from('notifications').insert({
    user_id: data.user_id,
    type: 'application_update',
    title: 'Application Status Updated',
    message: `Your application for ${data.job.title} is now ${status}`,
    link: `/applications/${data.id}`,
  })

  // Send email to candidate
  if (data.user?.email) {
    await sendEmail({
      to: data.user.email,
      subject: 'Application Status Update',
      html: `<p>Your application status for ${data.job.title} has been updated to: ${status}</p>`,
    })
  }

  return data
}
