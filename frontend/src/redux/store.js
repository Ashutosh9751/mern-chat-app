import {configureStore} from '@reduxjs/toolkit';
import userslice from './userslice';
 export const store=configureStore({
reducer: {
    user:userslice
}
});