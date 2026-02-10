'use client'

import { useActionState } from 'react'
import { resetPassword } from '../actions'

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(resetPassword, null)

  return (
    <div>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Reset Password
      </h2>
      <form action={action} className="space-y-6 mt-8">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
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
            {isPending ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </div>

        <div className="text-sm text-center">
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to Login
            </a>
        </div>

        {state?.error && (
          <div className="text-red-500 text-sm mt-2">{state.error}</div>
        )}
        {state?.success && (
          <div className="text-green-500 text-sm mt-2">{state.success}</div>
        )}
      </form>
    </div>
  )
}
