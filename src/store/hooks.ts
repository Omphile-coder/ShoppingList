import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Creates a pre-typed dispatch hook so TypeScript automatically knows what actions are valid to dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Creates a pre-typed selector hook that provides auto-completion for your entire Redux global state in components
export const useAppSelector = useSelector.withTypes<RootState>();