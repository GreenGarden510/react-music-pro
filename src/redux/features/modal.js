import { createSlice, createAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { async } from 'regenerator-runtime';

const SHOW_MODAL = 'modal/showModal';
const SHOW_MODAL_THUNK = 'modal/showModalThunk';

const initialState = {
  type: null,
  modalProps: {},
};

const showModalThunk = createAsyncThunk(
  SHOW_MODAL_THUNK, 
  async (data, store) => {
    return new Promise((resolve, reject) => {
      store.dispatch(showModal({
        src: url,
        aspectRatio: 1/1,
        width: 100, 
        locked: true, 
      }));
      resolve();
    });
    //dispatch the normal store
    //patch the component
  }
)

// reducers
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action) => {
      return action.payload;
    },
    hideModal: () => initialState,
  },
});

// actions
export const { hideModal } = modalSlice.actions;

export const showModal = createAction(SHOW_MODAL, function prepare(type, modalProps) {
  return {
    payload: {
      type,
      modalProps,
    },
  }
});

export default modalSlice.reducer;
