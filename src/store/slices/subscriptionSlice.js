import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

export const fetchPlans = createAsyncThunk('subscription/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/plans');
    return data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to fetch plans');
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch plans');
  }
});

export const fetchMySubscription = createAsyncThunk('subscription/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/my-subscription');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch subscription');
  }
});

export const subscribeToPlan = createAsyncThunk('subscription/subscribe', async ({ planId, base }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/subscribe/${planId}`, { base });
    toast.success('Successfully subscribed to the plan!');
    return data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Subscription failed');
    return rejectWithValue(err.response?.data?.message || 'Subscription failed');
  }
});

export const createPlan = createAsyncThunk('subscription/createPlan', async (planData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/plans', planData);
    toast.success('Plan created successfully!');
    return data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to create plan');
    return rejectWithValue(err.response?.data?.message || 'Failed to create plan');
  }
});

export const fetchAllSubscriptions = createAsyncThunk('subscription/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/subscriptions', { params });
    return data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to fetch subscriptions');
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch subscriptions');
  }
});

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    plans: [],
    mySubscription: null,
    allSubscriptions: [],
    pagination: null,
    loading: false,
    subscribeLoading: false,
    createLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => { state.error = null; state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => { state.loading = true; })
      .addCase(fetchPlans.fulfilled, (state, action) => { state.loading = false; state.plans = action.payload; })
      .addCase(fetchPlans.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMySubscription.pending, (state) => { state.loading = true; })
      .addCase(fetchMySubscription.fulfilled, (state, action) => { state.loading = false; state.mySubscription = action.payload; })
      .addCase(fetchMySubscription.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(subscribeToPlan.pending, (state) => { state.subscribeLoading = true; state.error = null; })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.subscribeLoading = false;
        state.mySubscription = action.payload;
        state.successMessage = 'Successfully subscribed!';
      })
      .addCase(subscribeToPlan.rejected, (state, action) => { state.subscribeLoading = false; state.error = action.payload; })

      .addCase(createPlan.pending, (state) => { state.createLoading = true; state.error = null; })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.createLoading = false;
        state.plans = [action.payload, ...state.plans];
        state.successMessage = 'Plan created successfully!';
      })
      .addCase(createPlan.rejected, (state, action) => { state.createLoading = false; state.error = action.payload; })

      .addCase(fetchAllSubscriptions.pending, (state) => { state.loading = true; })
      .addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.allSubscriptions = action.payload.subscriptions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllSubscriptions.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearMessages } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
