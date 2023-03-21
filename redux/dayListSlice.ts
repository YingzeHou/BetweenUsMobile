import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
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

export type day = {
    id:string,
    event:string,
    startDate:string,
    category:string,
    address:string,
    pinned:number,
    users: any[]
}
export type DayState = {
    loading: boolean,
    days: day[],
    error?: string,
}
const initialState: DayState = {
    loading: false,
    days: [],
    error: '',
}

const dayRef = db.collection("days");

export const fetchDays = createAsyncThunk('day/fetchDays', ()=>{
    return dayRef
        // .orderBy('index')
        .get()
        .then((querySnapShot) => {
            const days: day[] = [];
            querySnapShot.forEach((doc) => {
                const { event, startDate, category, address, pinned, users } = doc.data();
                if(users.includes(auth.currentUser?.uid)) {
                    days.push({
                        id: doc.id,
                        event: event,
                        startDate: startDate,
                        category: category,
                        address: address,
                        pinned: pinned,
                        users: users,
                    })
                }
            })
            return {days};
        })
})

const dayListSlice = createSlice({
    name:'day',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchDays.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchDays.fulfilled, (state, action) => {
            state.loading = false;
            state.days = action.payload.days;
            // state.prevIds = action.payload.prevIds;
        })
        builder.addCase(fetchDays.rejected, (state, action) => {
            state.loading = false;
            state.days = [];
            state.error = action.error.message;
        })
    },
    reducers:{
        createDay: (state, action) => {
            state.days.push({
                id: makeid(),
                event: action.payload.event,
                startDate: action.payload.startDate,
                category: action.payload.category,
                address: action.payload.address,
                pinned: action.payload.pinned,
                users: action.payload.users,
            })
        },

        updateDay: (state, action) => {
            const newDays = state.days.map((day, i) => {
                if(i==action.payload.atIndex) {
                    day.event = action.payload.event;
                    day.startDate = action.payload.startDate;
                    day.category = action.payload.category;
                    day.address = action.payload.address;
                    day.pinned = action.payload.pinned;
                    day.users = action.payload.users;
                    return day;
                }
                else{
                    return day;
                }
            })
            state.days = newDays;
        },

        deleteDay: (state, action) => {
            state.days.splice(action.payload.atIndex, 1);
        },
    }
})

export default dayListSlice.reducer;
export const { createDay, updateDay, deleteDay} = dayListSlice.actions;
