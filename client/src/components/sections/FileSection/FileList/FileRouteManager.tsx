import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import FileRoute from "./FileRoute";

const FileRouteManager = () => {
  const routes = useSelector((state: RootState) => state.location.route);

  return (
    <div
      data-testid="file-route-manager"
      className="flex items-center   text-lg font-medium select-none"
    >
      {routes.map((route, index) => (
        <FileRoute key={route.catalogId} route={route} index={index} />
      ))}
    </div>
  );
};

export default FileRouteManager;
