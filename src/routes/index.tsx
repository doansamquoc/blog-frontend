import { Home } from "@/pages/home/Page";
import SigninPage from "@/pages/signin/Page";
import SignupPage from "@/pages/signup/Page";

export const routes = [
    {
        path: "/signin",
        element: <SigninPage />
    },
    {
        path: "/signup",
        element: <SignupPage />
    }, {
        path: "/",
        element: <Home />
    }
]