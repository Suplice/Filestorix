import {
  Order,
  setName as storeSetName,
  setModifiedAt as storeSetModifiedAt,
  setModifiedAtTimeStamp as storeSetModifiedAtTimeStamp,
  setVisibleFilesCategory as storeSetVisibleFilesCategory,
  setVisibleExtension as storeSetVisibleExtensionCategory,
  ModifiedAtTimeStamp,
  VisibleFilesCategory,
  VisibleExtensionCategory,
} from "@/store/filterSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

const useFileFilters = () => {
  const dispatch = useDispatch();

  const {
    name,
    modifiedAt,
    modifiedAtTimeStamp,
    visibleFilesCategory,
    visibleExtension,
  } = useSelector((state: RootState) => state.filters);

  const setName = (newState: Order | undefined) => {
    dispatch(storeSetName(newState));
  };

  const setModifiedAt = (newState: Order | undefined) => {
    dispatch(storeSetModifiedAt(newState));
  };

  const setModifiedAtTimeStamp = (newState: ModifiedAtTimeStamp) => {
    dispatch(storeSetModifiedAtTimeStamp(newState));
  };

  const setVisibleFilesCategory = (newState: VisibleFilesCategory) => {
    dispatch(storeSetVisibleFilesCategory(newState));
  };

  const setVisibleExtension = (newState: VisibleExtensionCategory) => {
    dispatch(storeSetVisibleExtensionCategory(newState));
  };

  return {
    name,
    modifiedAt,
    modifiedAtTimeStamp,
    visibleFilesCategory,
    visibleExtension,
    setName,
    setModifiedAt,
    setModifiedAtTimeStamp,
    setVisibleFilesCategory,
    setVisibleExtension,
  };
};

export default useFileFilters;
