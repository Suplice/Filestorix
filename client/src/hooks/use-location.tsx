"use client";
import { Section } from "@/lib/utils/utils";
import { setRoute } from "@/store/locationSlice";
import { useDispatch } from "react-redux";

const useLocation = () => {
  const dispatch = useDispatch();

  const handleOriginalPathname = (path: string) => {
    const pathArray = path.split("/");
    const pathArg = pathArray[pathArray.length - 1];

    switch (pathArg) {
      case "trash":
        dispatch(
          setRoute({ route: [{ sectionName: Section.Trash, catalogId: null }] })
        );
        break;
      case "favorite":
        console.log("test");
        dispatch(
          setRoute({
            route: [{ sectionName: Section.Favorite, catalogId: null }],
          })
        );
        break;
      case "recent":
        console.log("test");
        dispatch(
          setRoute({
            route: [{ sectionName: Section.Recent, catalogId: null }],
          })
        );
        break;
      case "my-drive":
        dispatch(
          setRoute({
            route: [{ sectionName: Section.MyDrive, catalogId: null }],
          })
        );
        break;
      default:
        dispatch(
          setRoute({ route: [{ sectionName: Section.Main, catalogId: null }] })
        );
        break;
    }
  };

  return {
    handleOriginalPathname,
  };
};

export default useLocation;
