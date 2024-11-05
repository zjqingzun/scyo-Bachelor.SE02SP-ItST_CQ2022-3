import { combineReducers } from "redux";
import currencyReducer from "./currencyReducer";

const rootReducer = combineReducers({
    currency: currencyReducer,
});

export default rootReducer;
