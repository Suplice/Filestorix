import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalType =
  | "FileUploader"
  | "CatalogUploader"
  | "FileNameChanger"
  | null;

export type ModalProps = {
  parentId: number | null;
};
interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  modalProps?: ModalProps;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  modalProps: { parentId: null },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; props?: ModalProps }>
    ) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.modalProps = action.payload.props;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = { parentId: null };
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
