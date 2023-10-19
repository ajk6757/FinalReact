import { applyMiddleware } from "redux";

const CallMiddleware = store => nextMiddle => action => {
    console.log('2. action.type : '+action+" , store " + store.getState());
    let result = nextMiddle(action); // reducer를 통해 액션이 스토어에 전달
    console.log('4. action.type : '+action.type+" , store " + store.getState().data);
    return result;
}

export default CallMiddleware;

