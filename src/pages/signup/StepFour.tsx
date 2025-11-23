import { userApi } from "@/api/api"
import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Input } from "@/components/retroui/Input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useSignupStore } from "@/store/signupStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const schema = z.object({
    email: z.string().email("Enter an email address")
})

type SignupType = z.infer<typeof schema>

export const StepFour = () => {
    const { back, data, next, update } = useSignupStore();
    const [loading, setLoading] = useState(false);

    const form = useForm<SignupType>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: data.email
        }
    })

    async function onSubmit(data: SignupType) {
        const isConflict = await emailConflict(data.email);
        if (isConflict) {
            form.setFocus("email")
            form.setError("email", {
                type: "manual",
                message: "Email address already exists",

            });
            return;
        }
        update(data);
        next();
    }

    async function emailConflict(email: string): Promise<boolean> {
        setLoading(true);
        try {
            await userApi.checkEmailAddress({ emailAddress: email });
            return false;
        } catch {
            return true;
        } finally {
            setLoading(false);
        }
    }

    return <Card>
        <Card.Header>
            <Card.Title>Create Life Flow Account</Card.Title>
            <Card.Description>Enter your email address</Card.Description>
        </Card.Header>
        <Card.Content>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller name="email" control={form.control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Email address</FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your email address"
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )} />
                    <Field>
                        <Field>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Spinner /> : "Next"}
                            </Button>
                        </Field>
                        <Field>
                            <Button type="button"
                                variant={"secondary"}
                                onClick={back}
                            >
                                Back
                            </Button>
                        </Field>

                    </Field>
                </FieldGroup>
            </form>
        </Card.Content>
    </Card>
}
