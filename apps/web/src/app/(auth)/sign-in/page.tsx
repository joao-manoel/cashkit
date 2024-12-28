import { LoginForm } from "@/components/login-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-6 p-6 md:p-10 w-full ">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
