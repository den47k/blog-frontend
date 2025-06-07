import { createBrowserRouter } from "react-router";
import WorkInProgress from "@/pages/WorkInProgress";

export const router = createBrowserRouter([
    { path: "/", Component: WorkInProgress },
]);