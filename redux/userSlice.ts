import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {db, auth} from "../firebase"

export type user = {
    id: string,
    userId: string,
    username: string,
    email: string,
    photoUrl: string,
    gender: string,
    pairUser: userInfo
}

export type userInfo = {
    userId: string,
    username: string,
    email: string,
    photoUrl: string,
    gender: string,
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
        gender:  "",
        pairUser: {
            userId: "",
            username: "",
            email: "",
            photoUrl: "",
            gender:  "",
        }
    },
    error: '',
}

const userRef = db.collection("users");

export const fetchUser = createAsyncThunk('user/fetchUser', (uid: string)=>{
    return userRef
        .where("userId", "==", uid)
        .get()
        .then((querySnapShot) => {
            const doc = querySnapShot.docs[0];
            console.log()
            const {userId, username, email, photoUrl, gender, pairUser} = doc.data();
            const user: user = {
                id:doc.id,
                userId: userId,
                username: username,
                email:email,
                photoUrl: photoUrl,
                gender: gender,
                pairUser: pairUser
                };
            return user;
        })
})

const userSlice = createSlice({
    name:'user',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            // state.pairUser = action.payload.pairUser
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.user = {
                id: "",
                userId: "",
                username: "",
                email: "",
                photoUrl: "",
                gender:  "",
                pairUser: {
                    userId: "",
                    username: "",
                    email: "",
                    photoUrl: "",
                    gender:  "",
                }
            };
            state.error = action.error.message;
        })
    },
    reducers:{

    }
})

export default userSlice.reducer;