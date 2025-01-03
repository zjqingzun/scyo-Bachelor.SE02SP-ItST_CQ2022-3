import { combineReducers } from "redux";

import currencyReducer from "./currencyReducer";
import accountReducer from "./accountReducer";

const rootReducer = combineReducers({
    currency: currencyReducer,
    account: accountReducer,
});

export default rootReducer;
