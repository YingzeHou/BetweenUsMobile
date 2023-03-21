import {combineReducers, configureStore} from '@reduxjs/toolkit'
import todoListSlice from "./redux/todoListSlice"
import userSlice from './redux/userSlice';
import pairUserSlice from './redux/pairUserSlice';
import collectionListSlice from './redux/collectionListSlice';
import dayListSlice from './redux/dayListSlice';

const rootReducer = combineReducers({
    todoList: todoListSlice,
    user: userSlice,
    pairUser: pairUserSlice,
    collectionList: collectionListSlice,
    dayList: dayListSlice
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export default store;