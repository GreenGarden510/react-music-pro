import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { showModal } from '$redux/features/modal';

const CROP = 'croptool/CROP';

// actions
export const crop = createAsyncThunk(
    CROP,
    async (data, store) => {
        return await new Promise((resolve, reject) => {
            console.log(data);
            const { src, aspectRatio, width, locked, slung, onChange } = data;
            //show modal
            //if condition is satisfied
            if (store.getState().modal.type != 'CROP_MODAL') {
                store.dispatch(showModal('CROP_MODAL', {
                    src,
                    aspectRatio,
                    width,
                    locked,
                    slung,
                }))
            }
            //dispatch hide model
            resolve()
        });
    }
);

const initialState = {
  cropped: null,
  slung: '',
};

// reducers
const croptoolSlice = createSlice({
  name: 'croptool',
  initialState,
  reducers: {
    updateCroppedImage: (state, action) => {
      state.cropped = action.payload;
    },
    updateSlung: (state, action) => {
      state.slung = action.payload
    },
    hideModal: () => initialState,
  },
  extraReducers: {
      [crop.pending]: (state, action) => {
        console.log('Crop Pending');
      },
      [crop.fulfilled]: (state, action) => {
        console.log('Crop fullfilled');
      },
      [crop.rejected]: (state, action) => {
        console.log('Crop rejected');
      },
  },
});

// actions
export const { hideModal } = croptoolSlice.actions;

// export const updateCroppedImage = createAction(SHOW_MODAL, function prepare(type, modalProps) {
//   return {
//     payload: {
//       type,
//       modalProps,
//     },
//   }
// });
export const { updateCroppedImage, updateSlung } = croptoolSlice.actions;
export default croptoolSlice.reducer;
