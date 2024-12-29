import { RegisterForm } from './register-form'

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
