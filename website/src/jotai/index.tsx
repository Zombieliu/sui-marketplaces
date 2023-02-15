import {atom} from "jotai";


//加载状态
const LoadingState = atom(false)
const SellPop_up_boxState = atom(false)
//交易是否成功
const SellState = atom({
    type:"",
    hash:"",
    state:false
})





export {SellState,SellPop_up_boxState,LoadingState}
