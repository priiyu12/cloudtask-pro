import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { applySettings } from "./lib/settings";

export default function App() {
  useEffect(() => {
    applySettings();
  }, []);

  return <RouterProvider router={router} />;
}
