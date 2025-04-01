import { UserFile } from "@/lib/types/file";
import {
  ModifiedAtTimeStamp,
  Order,
  VisibleExtensionCategory,
  VisibleFilesCategory,
} from "@/store/filterSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const useFilteredFiles = (files: UserFile[]) => {
  const {
    name,
    modifiedAt,
    modifiedAtTimeStamp,
    visibleFilesCategory,
    visibleExtension,
  } = useSelector((state: RootState) => state.filters);

  let resultFiles: UserFile[] = files;

  resultFiles = handleNameFilter(resultFiles, name);

  resultFiles = handleModifiedAtFilter(resultFiles, modifiedAt);

  resultFiles = handleModifiedAtTimeStampFilter(
    resultFiles,
    modifiedAtTimeStamp
  );

  resultFiles = handleVisibleFilesCategoryFilter(
    resultFiles,
    visibleFilesCategory
  );

  resultFiles = handleVisibleExtensionFilter(resultFiles, visibleExtension);

  return {
    filteredFiles: resultFiles,
  };
};

export default useFilteredFiles;

const handleNameFilter = (
  files: UserFile[],
  nameFilter: Order | undefined
): UserFile[] => {
  switch (nameFilter) {
    case undefined:
      return files;
    case Order.ASC:
      return files.sort((first, second) =>
        first.name.localeCompare(second.name)
      );
    case Order.DESC:
      return files.sort((first, second) =>
        second.name.localeCompare(first.name)
      );
    default:
      return files;
  }
};

const getTimeStamp = (date: string | Date) => {
  return typeof date === "string" ? new Date(date).getTime() : date.getTime();
};

const handleModifiedAtFilter = (
  files: UserFile[],
  modifiedAtFilter: Order | undefined
) => {
  if (files.length === 0) return files;

  switch (modifiedAtFilter) {
    case undefined:
      return files;
    case Order.ASC:
      return files.sort(
        (first, second) =>
          getTimeStamp(first.modifiedAt) - getTimeStamp(second.modifiedAt)
      );
    case Order.DESC:
      return files.sort(
        (first, second) =>
          getTimeStamp(second.modifiedAt) - getTimeStamp(first.modifiedAt)
      );
    default:
      return files;
  }
};

const handleModifiedAtTimeStampFilter = (
  files: UserFile[],
  modifiedAtTimeStampFilter: ModifiedAtTimeStamp
) => {
  if (files.length === 0) return files;

  switch (modifiedAtTimeStampFilter) {
    case ModifiedAtTimeStamp.ALLTIME:
      return files;
    case ModifiedAtTimeStamp.LESS30:
      return files.filter(
        (file) =>
          getTimeStamp(file.modifiedAt) >
          getTimeStamp(new Date()) - 30 * 24 * 60 * 60 * 1000
      );
    case ModifiedAtTimeStamp.LESS7:
      return files.filter(
        (file) =>
          getTimeStamp(file.modifiedAt) >
          getTimeStamp(new Date()) - 7 * 24 * 60 * 60 * 1000
      );
    case ModifiedAtTimeStamp.LESS1:
      return files.filter(
        (file) =>
          getTimeStamp(file.modifiedAt) >
          getTimeStamp(new Date()) - 1 * 24 * 60 * 60 * 1000
      );
    default:
      return files;
  }
};

const handleVisibleFilesCategoryFilter = (
  files: UserFile[],
  visibleFilesCategoryFilter: VisibleFilesCategory
) => {
  if (files.length === 0) return files;

  switch (visibleFilesCategoryFilter) {
    case VisibleFilesCategory.ALL:
      return files;
    case VisibleFilesCategory.CATALOGS:
      return files.filter((file) => file.type === "CATALOG");
    case VisibleFilesCategory.FILES:
      return files.filter((file) => file.type === "FILE");
    default:
      return files;
  }
};

const handleVisibleExtensionFilter = (
  files: UserFile[],
  visibleExtensionFilter: VisibleExtensionCategory
) => {
  if (files.length === 0) return files;

  switch (visibleExtensionFilter) {
    case VisibleExtensionCategory.ALL:
      return files;
    case VisibleExtensionCategory.JPG:
      return files.filter((file) =>
        file.extension.toLowerCase().endsWith("jpg")
      );
    case VisibleExtensionCategory.PDF:
      return files.filter((file) =>
        file.extension.toLowerCase().endsWith("pdf")
      );
    case VisibleExtensionCategory.PNG:
      return files.filter((file) =>
        file.extension.toLowerCase().endsWith(".png")
      );
    case VisibleExtensionCategory.TXT:
      return files.filter((file) =>
        file.extension.toLowerCase().endsWith("txt")
      );
    case VisibleExtensionCategory.XLS:
      return files.filter((file) =>
        file.extension.toLowerCase().includes(".xls")
      );
    default:
      return files;
  }
};
