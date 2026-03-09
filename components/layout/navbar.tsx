import Link from 'next/link'
import { getUser, signOut } from '@/lib/auth/auth'
import { Button } from '../ui/button'

export async function Navbar() {
  const user = await getUser()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Hike For Sure
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-gray-700 hover:text-gray-900">
              Jobs
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/messages" className="text-gray-700 hover:text-gray-900">
                  Messages
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
