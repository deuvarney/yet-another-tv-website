import rootReducer from './reducers/rootReducer';


import {configureStore} from '@reduxjs/toolkit';


// Note that this one configureStore call automatically does all the usual setup work you'd have done manually:
// The slice reducers were automatically passed to combineReducers()
// The redux-thunk middleware was automatically added
// Dev-mode middleware was added to catch accidental mutations
// The Redux DevTools Extension was automatically set up
// The middleware and DevTools enhancers were composed together and added to the store

export const store = configureStore({
    reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
