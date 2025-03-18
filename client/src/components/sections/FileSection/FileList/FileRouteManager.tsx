import { FileRoute } from "@/lib/types/file";

interface FileRouteManagerProps {
  routes: FileRoute[];
  handleChangeRoute: (catalogId: number | null) => void;
}

const FileRouteManager: React.FC<FileRouteManagerProps> = ({
  routes,
  handleChangeRoute,
}) => {
  return (
    <div className="flex flex-row">
      {routes.map((route, index) => (
        <h1 key={route.catalogId} className="flex flex-row font-bold text-2xl">
          {index !== 0 && <p className="mx-2">/</p>}

          <p
            className="hover:underline cursor-pointer transition-all duration-200 "
            onClick={() => handleChangeRoute(route.catalogId)}
          >
            {route.sectionName}
          </p>
        </h1>
      ))}
    </div>
  );
};

export default FileRouteManager;
