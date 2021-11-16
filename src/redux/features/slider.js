import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { async } from "regenerator-runtime";
import { handleFetch } from "../../common/requestUtils";

const initialState = {
    status: "idle", //the state can be one of the following values (idle, loading, successful, failed)
    error: null,
    data: []
}

export const fetchSliders = createAsyncThunk(
    'slider/fetchSliders',
    async (payload, store) => {
        const { token, visitorToken } = store.getState().authentication
        const response = await handleFetch('GET', 'sliders', null, token ?? visitorToken)
        return response.data
    }
)

export const storeSlider = createAsyncThunk(
    'slider/storeSlider',
    async (payload, store) => {
        const { token } = store.getState().authentication
        const response = await handleFetch('POST', 'sliders', payload, token)
        return response.data
    }
)

export const updateSlider = createAsyncThunk(
    'slider/updateSlider',
    async (payload, store) => {
        const { token } = store.getState().authentication
        const { id, values } = payload
        const response = await handleFetch('PUT', `sliders/${id}`, values, token)
        return response.data
    }
)

export const deleteSlider = createAsyncThunk(
    'slider/deleteSlider',
    async (id, store) => {
        const { token } = store.getState().authentication
        const response = await handleFetch('DELETE', `sliders/${id}`, null, token)
        return id
    }
)

export const storeSliderItem = createAsyncThunk(
    'slider/storeSliderItem',
    async (payload, store) => {
        const { token } = store.getState().authentication
        const response = await handleFetch('POST', `sliders/${payload['slider_id']}/items`, payload, token)
        return response.data
    }
)

export const deleteSliderItem = createAsyncThunk(
    'slier/deleteSliderItem',
    async (payload, store) => {
        const { token } = store.getState().authentication
        const response = await handleFetch('DELETE', `sliders/${payload.slider_id}/items/${payload.slider_item_id}`)
        return payload
    }
)

const sliderSlice = createSlice({
    name: "slider",
    initialState,
    reducers: {},
    extraReducers: {
        [fetchSliders.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchSliders.fulfilled]: (state, action) => {
            state.status = 'successful'
            state.data = action.payload
        },
        [fetchSliders.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error
        },
        [deleteSlider.fulfilled]: (state, action) => {
            state.data = state.data.filter(slider => slider.slider_id !== action.payload)
        },
        [storeSlider.fulfilled]: (state, action) => {
            state.data.push(action.payload)
        },
        [updateSlider.fulfilled]: (state, action) => {
            state.data.map((slider, index) => {
                if (slider.slider_id === action.payload.slider_id) {
                    state.data[index] = action.payload
                }
            })
        },
        [storeSliderItem.fulfilled]: (state, action) => {
            state.data.map((slider, index) => {
                if (slider.slider_id === action.payload.slider_id) {
                    state.data[index].items.push(action.payload)
                }
            })
        },
        [deleteSliderItem.fulfilled]: (state, action) => {
            state.data.map((slider, index) => {
                if (slider.slider_id === action.payload.slider_id) {
                    state.data[index].items = state.data[index].items.filter(item => item.slider_item_id != action.payload.slider_item_id)
                }
            })
        }
    }
});

export default sliderSlice.reducer

export const selectAllSliders = state => state.slider.data

export const selectSliderById = (state, slider_id) => {
    const sliders = state.slider.data.filter(slider => slider.slider_id === slider_id)
    return sliders.length ? sliders[0] : {}
} 

export const selectAllSliderPictures = (state, slider_id) => {
    const items = state.slider.data.filter(slider => slider.slider_id === slider_id)
    return items.length ? items[0].items : []
}