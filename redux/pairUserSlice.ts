import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {db, auth} from "../firebase"

export type user = {
    id: string,
    userId: string,
    username: string,
    email: string,
    photoUrl: string,
    gender: string
}
export type TodoState = {
    loading: boolean,
    user: user,
    error?: string,
}
const initialState: TodoState = {
    loading: false,
    user: {
        id: "",
        userId: "",
        username: "",
        email: "",
        photoUrl: "",
        gender:  ""
    },
    error: '',
}

const userRef = db.collection("users");

export const fetchPairUser = createAsyncThunk('user/fetchPairUser', (uid: string)=>{
    return userRef
        .where("userId", "==", uid)
        .get()
        .then((querySnapShot) => {
            const doc = querySnapShot.docs[0];
            const {userId, username, email, photoUrl, gender } = doc.data();
            const user: user = {
                id:doc.id,
                userId: userId,
                username: username,
                email:email,
                photoUrl: photoUrl,
                gender: gender
                };
            return user;
        })
})

const pairUserSlice = createSlice({
    name:'user',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPairUser.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchPairUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        builder.addCase(fetchPairUser.rejected, (state, action) => {
            state.loading = false;
            state.user = {
                id: "",
                userId: "",
                username: "",
                email: "",
                photoUrl: "",
                gender:  ""
            };
            state.error = action.error.message;
        })
    },
    reducers:{

    }
})

export default pairUserSlice.reducer;