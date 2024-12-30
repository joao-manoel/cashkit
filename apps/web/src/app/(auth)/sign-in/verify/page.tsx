'use client'

import { AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { isValidEmail } from '@/utils/utils'

import { resendAuthCodeAction, signInWithEmailAction } from '../../action'

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(300) // 5 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  if (!isValidEmail(email || '')) {
    router.push(`/sign-in`)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval)
          setIsResendDisabled(false)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleOtpChange = (value: string) => {
    setOtp(value)
  }

  const handleResend = () => {
    if (email) {
      resendAuthCodeAction({ email }).then((response) => {
        if (response && !response.success) {
          setError(response.message)
        } else {
          setTimer(300)
          setIsResendDisabled(true)
        }
      })
    }
  }

  const handleValidate = () => {
    if (email) {
      signInWithEmailAction({ code: otp, email }).then((response) => {
        if (response && !response.success) {
          setError(response.message)
        }
      })
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Verificação de Código
          </h2>
          <p className="text-center text-sm text-gray-600">
            Verifique seu email para receber o código de verificação.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não recebeu o código?{' '}
              <Button
                variant="link"
                className="h-auto p-0 font-normal"
                onClick={handleResend}
                disabled={isResendDisabled}
              >
                Enviar novamente
              </Button>
              {isResendDisabled && (
                <span className="ml-2 text-xs text-gray-400">
                  ({formatTime(timer)})
                </span>
              )}
            </p>
          </div>
          <Button className="w-full" onClick={handleValidate}>
            Validar Código
          </Button>
        </div>
      </div>
    </div>
  )
}
