import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { RadioGroup } from "@/components/retroui/Radio"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { useSignupStore } from "@/store/signupStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleQuestionMark, Mars, Venus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const genders = [
    {
        id: "MALE",
        icon: <Mars />,
        title: "Male"
    },
    {
        id: "FEMALE",
        icon: <Venus />,
        title: "Female"
    },
    {
        id: "OTHER",
        icon: <CircleQuestionMark />,
        title: "Rather not say"
    }
]

const schema = z.object({
    gender: z.string().min(1, "You must select a gener to continue.")
})

type SignupType = z.infer<typeof schema>

export const StepThree = () => {
    const { data, update, next, back } = useSignupStore();

    const form = useForm<SignupType>({
        resolver: zodResolver(schema),
        defaultValues: { gender: data.gender }
    })

    function onSubmit(data: SignupType) {
        update(data);
        next();
    }

    return <Card>
        <Card.Header>
            <Card.Title>Create Life Flow Account</Card.Title>
            <Card.Description>Select your gender</Card.Description>
        </Card.Header>
        <Card.Content>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller name="gender" control={form.control} render={({ field, fieldState }) => (
                        <RadioGroup
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                        >
                            {genders.map((gender) => (
                                <FieldLabel htmlFor={`form-rhf-gender-${gender.id}`}>
                                    <Field orientation={"horizontal"} data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle>{gender.icon}</FieldTitle>
                                            <FieldDescription>{gender.title}</FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value={gender.id} aria-invalid={fieldState.invalid} id={`form-rhf-gender-${gender.id}`} />
                                    </Field>
                                </FieldLabel>

                            ))}
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </RadioGroup>
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
