import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { useState } from "react";
import {db, auth} from "../firebase"

function makeid() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export type collection = {
    id: string,
    title: string,
    desc: string
    users: any[]
}
export type CollectionState = {
    loading: boolean,
    collections: collection[],
    error?: string,
}
const initialState: CollectionState = {
    loading: false,
    collections: [],
    error: '',
}

const collectionRef = db.collection("collections");
// const [todos, setTodos] = useState<todo[]>([]);

export const fetchCollections = createAsyncThunk('collection/fetchCollections', ()=>{
    return collectionRef
        // .orderBy('index')
        .get()
        .then((querySnapShot) => {
            const collections: collection[] = [];
            querySnapShot.forEach((doc) => {
                const { title, desc, users } = doc.data();
                if(users.includes(auth.currentUser?.uid)) {
                    collections.push({
                        id: doc.id,
                        title: title,
                        desc: desc,
                        users: users,
                    })
    
                }
            })
            return {collections};
        })
})

const collectionListSlice = createSlice({
    name:'collection',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchCollections.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchCollections.fulfilled, (state, action) => {
            state.loading = false;
            state.collections = action.payload.collections;
            // state.prevIds = action.payload.prevIds;
        })
        builder.addCase(fetchCollections.rejected, (state, action) => {
            state.loading = false;
            state.collections = [];
            state.error = action.error.message;
        })
    },
    reducers:{
        createCollection: (state, action) => {
            state.collections.push({
                id: action.payload.id,
                title:action.payload.title,
                desc: action.payload.desc,
                users:action.payload.users
            })
        },

        updateCollection: (state, action) => {
            const newCollections = state.collections.map((collection, i) => {
                if(i==action.payload.atIndex) {
                    collection.title = action.payload.title;
                    collection.desc = action.payload.desc;
                    collection.users = action.payload.users;
                    return collection;
                }
                else{
                    return collection;
                }
            })
            state.collections = newCollections;
        },

        deleteCollection: (state, action) => {
            state.collections.splice(action.payload.atIndex, 1);
        },
    }
})

export default collectionListSlice.reducer;
export const { createCollection, updateCollection, deleteCollection} = collectionListSlice.actions;
