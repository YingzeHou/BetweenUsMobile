import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {db, auth} from "../firebase"

export type budgetBook = {
    id: string,
    name: string,
    date: string,
    progress: number,
    users: any[]
}
export type BudgetBookState = {
    loading: boolean,
    budgetBooks: budgetBook[],
    error?: string,
}
const initialState: BudgetBookState = {
    loading: false,
    budgetBooks: [],
    error: '',
}

const bbookRef = db.collection("budgetbooks");
// const [todos, setTodos] = useState<todo[]>([]);

export const fetchBudgetBooks = createAsyncThunk('budgetbook/fetchBooks', ()=>{
    return bbookRef
        // .orderBy('index')
        .get()
        .then((querySnapShot) => {
            const budgetBooks: budgetBook[] = [];
            querySnapShot.forEach((doc) => {
                const { name, date, progress, users } = doc.data();
                if(users.includes(auth.currentUser?.uid)) {
                    budgetBooks.push({
                        id: doc.id,
                        name: name,
                        date: date,
                        progress: progress,
                        users: users,
                    })
    
                }
            })
            return {budgetBooks};
        })
})

const budgetBookListSlice = createSlice({
    name:'budgetBook',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchBudgetBooks.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchBudgetBooks.fulfilled, (state, action) => {
            state.loading = false;
            state.budgetBooks = action.payload.budgetBooks;
            // state.prevIds = action.payload.prevIds;
        })
        builder.addCase(fetchBudgetBooks.rejected, (state, action) => {
            state.loading = false;
            state.budgetBooks = [];
            state.error = action.error.message;
        })
    },
    reducers:{
        createBudgetBook: (state, action) => {
            state.budgetBooks.push({
                id: action.payload.id,
                name:action.payload.name,
                date: action.payload.date,
                progress: action.payload.progress,
                users:action.payload.users
            })
        },

        updateBudgetBook: (state, action) => {
            const newBudgetBooks = state.budgetBooks.map((budgetBook, i) => {
                if(i==action.payload.atIndex) {
                    budgetBook.name = action.payload.name;
                    budgetBook.date = action.payload.date;
                    budgetBook.progress= action.payload.progress,
                    budgetBook.users = action.payload.users;
                    return budgetBook;
                }
                else{
                    return budgetBook;
                }
            })
            state.budgetBooks = newBudgetBooks;
        },

        deleteBudgetBook: (state, action) => {
            state.budgetBooks.splice(action.payload.atIndex, 1);
        },
    }
})

export default budgetBookListSlice.reducer;
export const { createBudgetBook, updateBudgetBook, deleteBudgetBook} = budgetBookListSlice.actions;
