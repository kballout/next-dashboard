import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    loggedIn: false,
    authUser: null,
    guilds: [],
    selectedGuild: null
}


export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeUserStatus: (state, action) => {
            state.authUser = action.payload.authUser
            state.guilds = action.payload.guilds
            state.loggedIn = true
        },
        resetState: (state) => {
            state.authUser = null
            state.guilds = []
            state.loginMessage = null
            state.loggedIn = false
        },
        selectGuild: (state, action) => {
            state.selectedGuild = action.payload
        },
    }
})

export const {changeUserStatus, resetState, selectGuild} = authReducer.actions
export default authReducer.reducer