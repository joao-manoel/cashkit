import LoginForm from './login-form'

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md space-y-6">
        <LoginForm />
      </div>
    </div>
  )
}
