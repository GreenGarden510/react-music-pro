import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { async } from "regenerator-runtime";
import { handleFetch } from "../../common/requestUtils";

const initialState = {
    status: 'idle',
    error: null,
    data: []
}

export const fetchConfigurations = createAsyncThunk(
    'configurations/fetchConfigurations',
    async (filters, store) => {
        const { token, visitorToken } = store.getState().authentication
        const response = await handleFetch('GET', 'configurations', null, token ?? visitorToken)
        return response.data
    }
)

export const storeConfiguration = createAsyncThunk(
    'configurations/storeConfiguration',
    async (payload, store) => {
        const { token } = store.getState().authentication
        const response = await handleFetch('POST', 'configurations', payload, token)
        return response.data
    }
)

export const updateConfiguration = createAsyncThunk(
    'configurations/updateConfiguration',
    async (payload, store) => {
        const { token } = store.getState().authentication
        const { id, data } = payload
        const response = await handleFetch('PUT', `configurations/${id}`, data, token)
        return response.data
    }
)

export const deleteConfiguration = createAsyncThunk(
    'configurations/deleteConfiguration',
    async (id, store) => {
        const { token } = store.getState().authentication
        const response = await handleFetch('DELETE', `configurations/${id}`, null, token)
        return id
    }
)

const configurationSlice = createSlice({
    name: 'configurations',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchConfigurations.fulfilled]: (state, action) => {
            state.status = 'done'
            state.data = action.payload
        },
        [fetchConfigurations.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchConfigurations.rejected]: (state, action) => {
            state.status = 'error'
            state.error = action.payload
        },
        [storeConfiguration.fulfilled]: (state, action) => {
            state.data.push(action.payload)
        },
        [updateConfiguration.fulfilled]: (state, action) => {
            const index = state.data.findIndex(row => row.configuration_id === action.payload.configuration_id)
            state.data[index] = action.payload
        },
        [deleteConfiguration.fulfilled]: (state, action) => {
            const filtered = state.data.filter(row => row.configuration_id === action.payload)
            state.data = filtered
        }
    }
})

export default configurationSlice.reducer

export const selectConfigurations = state => state.configuration.data
export const selectConfigurationByKey = (state, key) => state.configuration.data.find(config => config.key === key)