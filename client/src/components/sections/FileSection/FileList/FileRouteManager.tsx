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
        <h1 key={index} className="flex flex-row">
          <p className="mx-1">{"/"}</p>
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
