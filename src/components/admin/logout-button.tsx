'use client'

import { Button } from '@/components/ui/button'
import { signout } from '@/app/(auth)/actions'

export function LogoutButton() {
  return (
    <form action={signout}>
      <Button variant="ghost" size="sm" type="submit">
        Sign out
      </Button>
    </form>
  )
}
