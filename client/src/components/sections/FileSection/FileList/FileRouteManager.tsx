import { FileRoute } from "@/lib/types/file";
import { ChevronRight } from "lucide-react";

interface FileRouteManagerProps {
  routes: FileRoute[];
  handleChangeRoute: (catalogId: number | null) => void;
}

const FileRouteManager: React.FC<FileRouteManagerProps> = ({
  routes,
  handleChangeRoute,
}) => {
  return (
    <div className="flex items-center   text-lg font-medium select-none">
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
