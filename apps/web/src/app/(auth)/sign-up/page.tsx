import { RegisterForm } from "@/components/register-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-6 p-6 md:p-10 w-full ">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
