import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface JobCardProps {
  job: {
    id: string
    title: string
    company: { name: string; logo_url?: string }
    location: string
    job_type: string
    experience_level: string
    salary_min?: number
    salary_max?: number
    created_at: string
  }
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start gap-4">
            {job.company.logo_url && (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{job.company.name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>📍 {job.location}</span>
            <span>•</span>
            <span>{job.job_type}</span>
            <span>•</span>
            <span>{job.experience_level}</span>
          </div>
          {(job.salary_min || job.salary_max) && (
            <p className="mt-2 text-sm font-medium text-gray-900">
              {job.salary_min && formatCurrency(job.salary_min)}
              {job.salary_min && job.salary_max && ' - '}
              {job.salary_max && formatCurrency(job.salary_max)}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            {formatRelativeTime(job.created_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
