import useFileHandlers from "@/hooks/use-file-handlers";
import { RootState } from "@/store/store";
import { ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

const FileRouteManager = () => {
  const routes = useSelector((state: RootState) => state.location.route);

  const { handleChangeRoute } = useFileHandlers();

  return (
    <div
      data-testid="file-route-manager"
      className="flex items-center   text-lg font-medium select-none"
    >
      {routes.map((route, index) => (
        <div key={route.catalogId} className="flex items-center">
          {index !== 0 && <ChevronRight className="w-6 h-6 text-gray-500" />}
          <div
            className=" cursor-pointer transition-all duration-200  hover:bg-secondary rounded-xl px-4 py-1"
            onClick={() => handleChangeRoute(route.catalogId)}
          >
            <p className="text-2xl font-extrabold">{route.sectionName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileRouteManager;
