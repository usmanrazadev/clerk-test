import { RedirectToSignIn, SignedOut } from '@clerk/nextjs'

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-white">Sign In</h2>
        <SignedOut>
          {/* Users will redirect to clerk signin page */}
          <RedirectToSignIn />
        </SignedOut>
      </div>
    </div>
  )
}

export default LoginPage
