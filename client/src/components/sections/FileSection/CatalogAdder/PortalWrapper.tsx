import ModalPortal from "../ModalPortal";
import FolderUploader from "./CatalogUploader";

const CatalogUploaderWrapper = () => {
  return (
    <ModalPortal>
      <FolderUploader />
    </ModalPortal>
  );
};

export default CatalogUploaderWrapper;
