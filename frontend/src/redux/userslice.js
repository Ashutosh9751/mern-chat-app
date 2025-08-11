import { createSlice, current } from "@reduxjs/toolkit";

const userslice = createSlice({
    name: "user",
    initialState: {
        userInfo: null,
        isLoggedIn: false,
        selectedUser: null,
        isonchatscreen: false,
        onlineuser: [],
        currentChatUserId: null,
        unreadMessages: {},
        friends: []
    },
    reducers: {
        login: (state, action) => {
            state.userInfo = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
            state.selectedUser = null;
            state.isonchatscreen = false;
            state.onlineuser = [];

            // 🧹 Clear localStorage
            localStorage.removeItem('userid');
            localStorage.removeItem('username');
            localStorage.removeItem('dp');
        },

        selectUser: (state, action) => {
            state.selectedUser = action.payload;

        }
        ,
        onChatScreen: (state, action) => {
            state.isonchatscreen = action.payload;

        },
        setonlineuser: (state, action) => {
            state.onlineuser = action.payload;
        },
        setCurrentChatUserId: (state, action) => {
            state.currentChatUserId = action.payload;
            state.unreadMessages[action.payload] = 0; // reset count
        },
        incrementUnread: (state, action) => {
            const id = action.payload;
            state.unreadMessages[id] = (state.unreadMessages[id] || 0) + 1;
        },
        clearUnread: (state, action) => {
            const userId = action.payload;
            delete state.unreadMessages[userId];
        },
        setfriends: (state, action) => {
            state.friends = action.payload;
        }

    }
    })

export const { login, logout, selectUser, onChatScreen, setonlineuser, setCurrentChatUserId, incrementUnread, clearUnread, setfriends } = userslice.actions;
export default userslice.reducer;