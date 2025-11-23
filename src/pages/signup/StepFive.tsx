import { authApi } from "@/api/api"
import type { SignupRequest } from "@/api/request/SignupRequest"
import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Input } from "@/components/retroui/Input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useSignupStore } from "@/store/signupStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod"

const schema = z.object({
    password: z.string().min(8, "Password must be at least 8 chracters"),
    confirm: z.string().min(8, "Password must be at least 8 characters")
}).refine((data) => data.password === data.confirm, {
    message: "Password confirm mismatch",
    path: ["confirm"]
})

type SignupType = z.infer<typeof schema>

export const StepFive = () => {
    const { back, data, update } = useSignupStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<SignupType>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: data.password,
            confirm: ""
        }
    })

    async function onSubmit(value: SignupType) {
        update(value);
        const payload: SignupRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            emailAddress: data.email,
            password: value.password,
        };
        await createAccount(payload);
    }

    async function createAccount(payload: SignupRequest) {
        setLoading(true)
        try {
            const res = await authApi.signup(payload);
            toast(res.data.message, {
                description: "Thanks for joined. Let's enjoy :)",
            })
            navigate("/")
        } catch (error: any) {
            console.log(error);
            form.setError("password", {
                message: error.message,
            })
        } finally {
            setLoading(false);
        }
    }
    return <Card>
        <Card.Header>
            <Card.Title>Create Life Flow Account</Card.Title>
            <Card.Description>Create a strong password</Card.Description>
        </Card.Header>
        <Card.Content>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Password</FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                placeholder="Enter password"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )} />
                    <Controller name="confirm" control={form.control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Confirm password</FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                placeholder="Re-enter password"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )} />
                    <Field>
                        <Field>
                            <Button type="submit" disabled={loading}>{loading ? <Spinner /> : "Finish"}</Button>
                        </Field>
                        <Field>
                            <Button type="button" variant={"secondary"} onClick={back}>Back</Button>
                        </Field>
                    </Field>
                </FieldGroup>
            </form>
        </Card.Content>
    </Card>
}
