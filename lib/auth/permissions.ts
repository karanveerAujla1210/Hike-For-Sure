import { getProfile } from './auth'

export async function hasRole(allowedRoles: string[]) {
  const profile = await getProfile()
  if (!profile) return false
  return allowedRoles.includes(profile.role)
}

export async function isRecruiter() {
  return hasRole(['recruiter', 'company_admin'])
}

export async function isCandidate() {
  return hasRole(['candidate'])
}

export async function isAdmin() {
  return hasRole(['platform_admin'])
}

export async function canCreateJob() {
  return hasRole(['recruiter', 'company_admin'])
}

export async function canManageApplications() {
  return hasRole(['recruiter', 'company_admin'])
}
