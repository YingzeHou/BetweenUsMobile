import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {db, auth} from "../firebase"

export type pair = {
    id: string,
    myId: string
    pairId: string
}
export type TodoState = {
    loading: boolean,
    pair: pair,
    error?: string,
}
const initialState: TodoState = {
    loading: false,
    pair: {id:'', myId:'', pairId:''},
    error: '',
}

const pairRef = db.collection("pairs");

export const fetchPair = createAsyncThunk('pair/fetchPair', ()=>{
    return pairRef
        .where("myId", "==", auth.currentUser?.uid)
        .get()
        .then((querySnapShot) => {
            const doc = querySnapShot.docs[0];
            const {myId, pairId } = doc.data();
            const pair: pair = {id:doc.id, myId:myId, pairId:pairId};
            return pair;
        })
})

const pairSlice = createSlice({
    name:'pair',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPair.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchPair.fulfilled, (state, action) => {
            state.loading = false;
            state.pair = action.payload;
        })
        builder.addCase(fetchPair.rejected, (state, action) => {
            state.loading = false;
            state.pair = {id:'', myId:'', pairId:''};
            state.error = action.error.message;
        })
    },
    reducers:{
        createPair: (state, action) => {
            state.pair.id = action.payload.id;
            state.pair.myId = action.payload.uid;
            state.pair.pairId = "";
        },

        updatePair: (state, action) => {
            state.pair.pairId = action.payload.uid;
        }
    }
})

export default pairSlice.reducer;
export const { createPair, updatePair} = pairSlice.actions;