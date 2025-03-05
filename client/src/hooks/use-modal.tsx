import { closeModal, openModal } from "@/store/modalSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useModal = () => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(closeModal());
  };

  const showModal = () => {
    dispatch(openModal());
  };

  return {
    isOpen,
    hideModal,
    showModal,
  };
};
