import {combineReducers, configureStore} from '@reduxjs/toolkit'
import todoListSlice from "./redux/todoListSlice"
import userSlice from './redux/userSlice';
import pairUserSlice from './redux/pairUserSlice';
import collectionListSlice from './redux/collectionListSlice';
import dayListSlice from './redux/dayListSlice';
import budgetbookListSlice from './redux/budgetbookListSlice';
import planListSlice from './redux/planListSlice';
const rootReducer = combineReducers({
    todoList: todoListSlice,
    user: userSlice,
    pairUser: pairUserSlice,
    collectionList: collectionListSlice,
    dayList: dayListSlice,
    budgetBookList: budgetbookListSlice,
    planList: planListSlice
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export default store;