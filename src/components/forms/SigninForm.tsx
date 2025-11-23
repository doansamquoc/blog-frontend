import { authApi } from "@/api/api"
import type { SigninRequest } from "@/api/request/SigninRequest"
import { Button } from "@/components/retroui/Button"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Chromium } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { useNavigate } from "react-router"
import { tokenStore } from "@/store/tokenStore"
import { Card } from "../retroui/Card"
import { Input } from "../retroui/Input"

const schema = z.object({
  identifier: z.string().min(1, "Enter username or email"),
  password: z.string().min(1, "Enter password")
})

type SigninType = z.infer<typeof schema>

export function SigninForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SigninType>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  async function onSubmit(data: SigninType) {
    const payload: SigninRequest = {
      ...data
    }
    await signin(payload);
  }

  async function signin(payload: SigninRequest) {
    setLoading(true)
    try {
      const res = await authApi.signin(payload);
      console.log(res)
      tokenStore.set(res.data.data.accessToken)
      toast(res.data.message)
      navigate("/")
    } catch (error: any) {
      form.setError("root", {
        message: error.message,
      })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return <Card>
    <Card.Header>
      <Card.Title>Welcome back</Card.Title>
      <Card.Description>
        Login with your Google account
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <Button variant="outline" type="button">
              <Chromium />
              Login with Google
            </Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with
          </FieldSeparator>
          <Controller name="identifier" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email or username</FieldLabel>
              <Input
                {...field}
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Enter username or email address"
                autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )} />

          <Controller name="password" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="text-muted-foreground ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                {...field}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter password"
                autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )} />
          {form.formState.errors.root && (
            <FieldError errors={[form.formState.errors.root]} />
          )}
          <Field>
            <Button type="submit">{loading ? <Spinner /> : "Login"}</Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account? <a href="/signup">Sign up</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Card.Content>
  </Card>
}
