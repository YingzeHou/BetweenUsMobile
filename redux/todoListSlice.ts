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

export type todo = {
    id: string,
    index: number,
    content: string,
    parentId: string
    isCompleted: boolean,
    users: any[]
}
export type TodoState = {
    loading: boolean,
    todos: todo[],
    error?: string,
    prevIds: string[]
}
const initialState: TodoState = {
    loading: false,
    todos: [],
    error: '',
    prevIds:[]
}

const todoRef = db.collection("todos");

export const fetchTodos = createAsyncThunk('todo/fetchTodos', (parentIdArg: string)=>{
    return todoRef
        .orderBy('index')
        .get()
        .then((querySnapShot) => {
            const todos: todo[] = [];
            const prevIds: string[] = [];
            querySnapShot.forEach((doc) => {
                // console.log(doc);
                const {index, content, parentId, isCompleted, users } = doc.data();
                if(parentId == parentIdArg && users.includes(auth.currentUser?.uid)) {
                    todos.push({
                        id: doc.id,
                        index: index,
                        content: content,
                        parentId: parentId,
                        isCompleted: isCompleted,
                        users: users,
                    })
    
                    prevIds.push(doc.id)
                }
            })
            return {todos, prevIds};
        })
})

export const casDeleteTodos = createAsyncThunk('todo/casDeleteTodo', (parentIdArg: string) => {
    todoRef
        .where("parentId", "==", parentIdArg)
        .get()
        .then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
                todoRef.doc(doc.id).delete().then(()=>{}).catch((error) => alert(error))
            })
        })
})

const todoListSlice = createSlice({
    name:'todo',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = action.payload.todos;
            state.prevIds = action.payload.prevIds;
        })
        builder.addCase(fetchTodos.rejected, (state, action) => {
            state.loading = false;
            state.todos = [];
            state.error = action.error.message;
        })
    },
    reducers:{
        createTodo: (state, action) => {
            if(action.payload.atIndex == 0) {
                state.todos=[{
                    id: makeid(),
                    index:0,
                    content:'',
                    parentId: action.payload.parentId,
                    isCompleted:false,
                    users:action.payload.users
                }]
            }
            else {
                state.todos.splice(action.payload.atIndex, 0, {
                    id: makeid(),
                    index:0,
                    content:'',
                    parentId: action.payload.parentId,
                    isCompleted:false,
                    users:action.payload.users
                })
            }
        },

        updateTodo: (state, action) => {
            const newTodos = state.todos.map((todo, i) => {
                if(i==action.payload.atIndex) {
                    todo.content = action.payload.content;
                    todo.isCompleted = action.payload.isChecked;
                    todo.users = action.payload.users;
                    return todo;
                }
                else{
                    return todo;
                }
            })
            state.todos = newTodos;
        },

        deleteTodo: (state, action) => {
            state.todos.splice(action.payload.atIndex, 1);
        },
    }
})

export default todoListSlice.reducer;
export const { createTodo, updateTodo, deleteTodo} = todoListSlice.actions;
