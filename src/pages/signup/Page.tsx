import { useSignupStore } from "@/store/signupStore";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import FormWrapper from "@/components/forms/FormWrapper";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { StepFive } from "./StepFive";

export default function SignupPage() {
    const step = useSignupStore((s) => s.step);
    console.log(step);
    switch (step) {
        case 1:
            return <FormWrapper>
                <StepOne />
            </FormWrapper>
        case 2:
            return <FormWrapper>
                <StepTwo />
            </FormWrapper>
        case 3:
            return <FormWrapper>
                <StepThree />
            </FormWrapper>
        case 4:
            return <FormWrapper>
                <StepFour />
            </FormWrapper>
        case 5:
            return <FormWrapper>
                <StepFive />
            </FormWrapper>
    }
}
