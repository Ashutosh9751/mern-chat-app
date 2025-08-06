import { createSlice } from "@reduxjs/toolkit";

const userslice=createSlice({
    name:"user",
    initialState:{
        userInfo:null,
        isLoggedIn:false,
        selectedUser:null,
        isonchatscreen:false,
        onlineuser:[]
    },
    reducers:{
        login:(state,action)=>{
            state.userInfo=action.payload;
            state.isLoggedIn=true;
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

        selectUser:(state,action)=>{
            state.selectedUser=action.payload;
           
        }
        ,
        onChatScreen:(state,action)=>{
            state.isonchatscreen=action.payload;
      
},
setonlineuser:(state,action)=>{
    state.onlineuser=action.payload;
}


    }

})

export const {login,logout,selectUser,onChatScreen,setonlineuser}=userslice.actions;
export default userslice.reducer;