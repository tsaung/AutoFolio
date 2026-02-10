'use client'

import { useActionState } from 'react'
import { updatePassword } from '../actions'

export default function UpdatePasswordPage() {
  const [state, action, isPending] = useActionState(updatePassword, null)

  return (
    <div>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Update Password
      </h2>
      <form action={action} className="space-y-6 mt-8">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Updating...' : 'Update Password'}
          </button>
        </div>

        {state?.error && (
          <div className="text-red-500 text-sm mt-2">{state.error}</div>
        )}
      </form>
    </div>
  )
}
