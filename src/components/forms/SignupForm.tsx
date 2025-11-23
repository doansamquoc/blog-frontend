import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field"
import { Check, ChevronDownIcon, Chromium, CircleAlert, Loader2 } from "lucide-react"
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { authApi, userApi } from "@/api/api"
import { toast } from "sonner"
import type { SignupRequest } from "@/api/request/SignupRequest"
import { useDebouncedValidator } from "@/hooks/useDebouncedValidator"

const SignupSchema = z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.date({ error: "Date of birth is required" }),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(16, "Username must be at most 16 characters"),

    emailAddress: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
}).refine((data) => data.dateOfBirth < new Date(), {
    message: "Date of birth cannot be in the future",
    path: ["dateOfBirth"],
}).refine((data) => {
    const today = new Date()
    const age = today.getFullYear() - data.dateOfBirth.getFullYear()
    return age >= 13
}, {
    message: "You must be at least 13 years old",
    path: ["dateOfBirth"],
})

type SignupType = z.infer<typeof SignupSchema>

export function SignupForm() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SignupType>({
        resolver: zodResolver(SignupSchema),
    })

    const onSubmit = async (data: SignupType) => {
        setLoading(true)
        try {

            const payload: SignupRequest = {
                ...data,
                gender: data.gender.toUpperCase()
            };
            const res = await authApi.signup(payload);
            localStorage.setItem("access_token", res.data.accessToken);
            toast("Your account has been created", {
                description: "Thanks for joined. Let enjoy your news.",
            })
        } catch (err: any) {
            console.log("Error", err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field className="grid grid-cols-2 gap-4">
                            <Controller name="firstName" control={form.control} render={({ field, fieldState }) => (
                                <Field date-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="First name"
                                        autoComplete="off"

                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="lastName" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Last name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />

                        </Field>

                        <Controller name="dateOfBirth" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-between font-normal text-muted-foreground">
                                            {field.value ? field.value.toLocaleDateString() : "Date of birth"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(v) => {
                                                field.onChange(v)
                                                setOpen(false)
                                            }}
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />


                        <Controller name="gender" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Controller name="username" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="username"
                                        autoComplete="off"

                                    />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Controller name="emailAddress" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Email address"
                                        autoComplete="off"

                                    />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="off" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Field>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                            </Button>
                            <Field>
                                <Button variant="outline" type="button" onClick={() => toast.success("This future is comming soon")}>
                                    <Chromium />
                                    Login with Google
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Already have an account? <a href="/signin">Sign in</a>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card >
    )
}

