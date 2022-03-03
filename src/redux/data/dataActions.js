// log
import { getTokenIds } from "../../helpers";
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
    // payload: idsNotMinted,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.getTotalMinted()
        .call();
      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();
     let ids = getTokenIds(1,5984);
     //console.log(ids);
    //  let idNotMinted = await store
    //  .getState().blockchain.smartContract.methods.checkAllMinted(ids).call();
      // .then(
      //   (receipt) => {
      //       // xoa id 0
      //       //idNotMinted = receipt;
      //       console.log(receipt);
      //       idNotMinted1 = receipt.filter(function(v) {
      //         return v != '0';
      //       });
      //     re;
      //     });
      
      dispatch(
        fetchDataSuccess({
          totalSupply,
          // idNotMinted,
          // cost,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
