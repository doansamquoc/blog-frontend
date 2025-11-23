import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Input } from "@/components/retroui/Input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useSignupStore } from "@/store/signupStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const signupSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
})

type SignupType = z.infer<typeof signupSchema>

export function StepOne() {
    const { data, update, next } = useSignupStore();
    const form = useForm<SignupType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: data.firstName,
            lastName: data.lastName,
        },
    });

    const onSubmit = (values: SignupType) => {
        update(values);
        next();
    };


    return <Card>
        <Card.Header>
            <Card.Title>Create Life Flow Account</Card.Title>
            <Card.Description>Enter your name</Card.Description>
        </Card.Header>
        <Card.Content>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller name="firstName" control={form.control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>First name</FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your first name"
                                autoComplete="off" />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                    <Controller name="lastName" control={form.control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Last name</FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your last name"
                                autoComplete="off" />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                    <Field>
                        <Field>
                            <Button type="submit">Next</Button>
                        </Field>
                        <Field>
                            <Button type="button" variant={"secondary"} asChild>
                                <a href="/signin">Back to Sign in</a>
                            </Button>
                        </Field>

                    </Field>
                </FieldGroup>
            </form>
        </Card.Content>
    </Card>
}