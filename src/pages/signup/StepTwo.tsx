import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { useSignupStore } from "@/store/signupStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
    dateOfBirth: z.date({ message: "Please select your date of birth" }),
}).refine((data) => data.dateOfBirth < new Date(), {
    message: "Date of birth cannot be in the future",
    path: ["dateOfBirth"]
}).refine((data) => {
    const today = new Date()
    const age = today.getFullYear() - data.dateOfBirth.getFullYear();
    return age >= 13;
}, {
    message: "You must be at least 13 years old",
    path: ["dateOfBirth"]
})

type SignupType = z.infer<typeof schema>

export function StepTwo() {
    const { data, update, next, back } = useSignupStore();
    const form = useForm<SignupType>({
        resolver: zodResolver(schema),
        defaultValues: { dateOfBirth: data.dateOfBirth }
    })

    const onSubmit = (value: SignupType) => {
        update(value);
        next();
    }


    return <Card>
        <Card.Header>
            <Card.Title>Create Life Flow Account</Card.Title>
            <Card.Description>Enter your date of birth</Card.Description>
        </Card.Header>
        <Card.Content>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller name="dateOfBirth" control={form.control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Calendar
                                defaultMonth={data.dateOfBirth}
                                mode="single"
                                selected={field.value}
                                onSelect={(v) => {
                                    field.onChange(v)
                                }}
                                captionLayout="dropdown"
                            />
                            {
                                fieldState.error && <FieldError errors={[fieldState.error]} />
                            }
                        </Field>
                    )} />
                    <Field>
                        <Field>
                            <Button type="submit">Next</Button>
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