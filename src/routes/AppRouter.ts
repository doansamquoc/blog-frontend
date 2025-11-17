import { useRoutes } from "react-router";
import { routes } from ".";

const AppRouter = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default AppRouter;
