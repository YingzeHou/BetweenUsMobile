import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {db, auth} from "../firebase"

export type composition = {
    id: string,
    type: string,
    category: string,
    amount: number,
}
export type plan = {
    id: string,
    parentId: string,
    name: string,
    expComps: composition[],
    actComps: composition[],
    users: any[]
}
export type PlanState = {
    loading: boolean,
    plans: plan[],
    error?: string,
}
const initialState: PlanState = {
    loading: false,
    plans: [],
    error: '',
}

const planRef = db.collection("budgetplans");

export const fetchPlans = createAsyncThunk('plan/fetchPlans', (parentIdArg: string)=>{
    return planRef
        .get()
        .then((querySnapShot) => {
            const plans: plan[] = [];
            querySnapShot.forEach((doc) => {
                const {parentId, name, expComps, actComps, users } = doc.data();
                if(parentId == parentIdArg && users.includes(auth.currentUser?.uid)) {
                    plans.push({
                        id: doc.id,
                        parentId: parentId,
                        name: name,
                        expComps: expComps,
                        actComps: actComps,
                        users: users,
                    })
                }
            })
            return {plans};
        })
})

const planSlice = createSlice({
    name:'plan',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPlans.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchPlans.fulfilled, (state, action) => {
            state.loading = false;
            state.plans = action.payload.plans
        })
        builder.addCase(fetchPlans.rejected, (state, action) => {
            state.loading = false;
            state.plans = [];
            state.error = action.error.message;
        })
    },
    reducers:{
        createPlan: (state, action) => {
            state.plans.push({
                id: action.payload.id,
                parentId: action.payload.parentId,
                name: action.payload.name,
                expComps: action.payload.expComps,
                actComps: action.payload.actComps,
                users:action.payload.users
            })
        },

        updatePlan: (state, action) => {
            const newPlan = state.plans.map((plan, i) => {
                if(i==action.payload.atIndex) {
                    plan.name = action.payload.name;
                    plan.expComps = action.payload.expComps;
                    plan.actComps = action.payload.actComps;
                    plan.users = action.payload.users;
                    return plan;
                }
                else{
                    return plan;
                }
            })
            state.plans = newPlan;
        },

        deletePlan: (state, action) => {
            state.plans.splice(action.payload.atIndex, 1);
        },
    }
})

export default planSlice.reducer;
export const { createPlan, updatePlan, deletePlan} = planSlice.actions;
