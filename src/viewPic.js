import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import {    getTokenIds,   getAmounts, setImageSrcAll } from "./helpers.js";

import { StyledImgGalary } from "./componets/image.style";



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: ${(props) => props.backgroundColor};
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
  &:hover{
    background-color : var(--secondary);
  }
`;

export const StyledImgLogo = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 10%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

// // Truong Ly
export const Input = styled.input.attrs(props => ({
  // we can define static props
  type: "text",

  // or we can define dynamic ones
  size: props.size || "1em",
}))`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  /* here we use the dynamically computed prop */
  margin: ${props => props.size};
  padding: ${props => props.size};
`;



function Galary({propFunction}) {


  const [idView, setIdView] = useState(2);
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [idFrom, setIdFrom] = useState(1);
  const [priceAmount, setPriceAmount] = useState(0);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = (idFrom, numberMint) => {
    let cost = CONFIG.WEI_COST * priceAmount;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
   


    if (numberMint > 1) {
      const ids = getTokenIds(idFrom,mintAmount);
      
      // Kiem tra cac ids da mint - Start
      
      blockchain.smartContract.methods.checkAllMinted(ids).call()
      .then(
        (receipt) => {
            // xoa id 0
            var idsNew = receipt.filter(function(v) {
              return v != '0';
            }); 
            // bat dau minted all - Start
            const amounts = getAmounts(idsNew.length);
            if ( priceAmount == 0) {
              blockchain.smartContract.methods
              .mintBatch(idsNew, amounts)
              .send({
                from: blockchain.account
               })
              .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
              })
              .then((receipt) => {
                console.log(receipt);
                setFeedback(
                  `WOW, the ${idsNew} Of ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
              });
            }
            else
            {
              blockchain.smartContract.methods
              .mintBatch(idsNew, amounts)
              .send({ 
                gasLimit: String(totalGasLimit*( priceAmount )),
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei*(priceAmount),
               })
              .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
              })
              .then((receipt) => {
                console.log(receipt);
                setFeedback(
                  `WOW, the ${idsNew} Of ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
              });
            }
            
            // bat dau minted all - end
        }
      ); 
      // Kiem tra cac ids da mint - End
      
    }
    else
    {
      blockchain.smartContract.methods.checkMinted(idFrom).call()
      .then(
        (receipt) => {
          //console.log(receipt);
          if( receipt )
          {
            blockchain.smartContract.methods
            .mint(idFrom, 1)
            .send({
              gasLimit: String(totalGasLimit),
              to: CONFIG.CONTRACT_ADDRESS,
              from: blockchain.account,
              value: totalCostWei,
            })
            .once("error", (err) => {
              console.log(err);
              setFeedback("Sorry, something went wrong please try again later.");
              setClaimingNft(false);
            })
            .then((receipt) => {
              console.log(receipt);
              setFeedback(
                `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
              );
              setClaimingNft(false);
              dispatch(fetchData(blockchain.account));
            });
          }
          else{
            setFeedback("Sorry, Already minted.");
              setClaimingNft(false);
          }

        }
      ); 
    }
    }
    
    

  // dung cho id
  const decrementIdfrom = () => {
    let newMintAmount = idFrom - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    getIdsNotMinted().then( 
      (idsNotMint) => {
        //console.log(idsNotMint);
        setIdFrom(pickIdNotMintDes(idsNotMint,newMintAmount));
        displayIdNtf(newMintAmount);
        setImagePath(newMintAmount);
    }
  );
  };

  const incrementIdFrom = () => {
    let newMintAmount = idFrom + 1;
    getIdsNotMinted().then( 
        (idsNotMint) => {
          //console.log(idsNotMint);
          setIdFrom(pickIdNotMintInc(idsNotMint,newMintAmount));
          displayIdNtf(newMintAmount);
          setImagePath(newMintAmount);
      }
    );
  };
  function myFunction(val) {
    alert("The input value has changed. The new value is: " + val);
  }
  const changeID = (idFromInput) => {
    //console.log(idFromInput);
    setIdFrom(idFromInput);
    setImagePath(idFromInput);
  }
  const setImagePath = (idMint) => {
    var dongdan ='https://opensea.mypinata.cloud/ipfs/QmRuSYRfFhEgq62WxPRM3RdA2Ds3zpeNEKotdLh7w2XW3T/' + idMint + '.png';
    document.getElementById("hinhdong").src = dongdan;
  }
  // ke thuc dung cho id - end
 // cac ham de quy kiem tra - start

 const pickIdNotMintInc = (ids,idChecked) => {
   
  if(ids.indexOf(String(idChecked)) !== -1 || idChecked >=5984 ){
    //alert("Value exists!")
    return idChecked;
  } else{
      //alert("Value does not exists!")
      idChecked ++;
    return  pickIdNotMintInc(ids,idChecked);
  }
}


const pickIdNotMintDes = (ids,idChecked) => {
   
  if(ids.indexOf(String(idChecked)) !== -1 || idChecked <=0 ){
    //alert("Value exists!")
    return idChecked < 0 ? 0 : idChecked;
  } else{
      //alert("Value does not exists!")
      idChecked --;
    return  pickIdNotMintDes(ids,idChecked);
  }
}

function displayIdNtf(idFrom) {
  document.getElementById("txtInputData").value =  idFrom ;
}
 // cac ham de quy kiem tra - end

  // dung cho amounts - start
  const incrementPriceAmount = () => {
    let newMintAmount = priceAmount + 1;
    // if (newMintAmount > 50) {
    //   newMintAmount = 50;
    // }
    setPriceAmount(newMintAmount);
  };

  const decrementPriceAmount = () => {
    let newMintAmount = priceAmount - 1;
    if (newMintAmount < 0) {
      newMintAmount = 0;
    }
    setPriceAmount(newMintAmount);
  };
  // dung cho amounts - end
  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };
const getIdsNotMinted = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      let ids = getTokenIds(1,5984);
      var idsReturn;
      //console.log(ids);

      return ( blockchain.smartContract.methods.checkAllMinted(ids).call()
      .then(
        (receipt) => {
            // xoa id 0
            //console.log(receipt);
            return receipt.filter(function(v) {
              return v != '0';
            }); 
          }
          ))
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  useEffect(() => {
    setImageSrcAll(2);
    setIdView(2);
  }, []);

  return (
    <s.Screen>
    
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <ResponsiveWrapper  flex={1} style={{ padding: 24 }} test>
        
        <ResponsiveWrapper onClick={(e) => { 
          if( e.target.id == "hinhtrai" ){
            if(idView >=1 ){
              setIdView(idView-1);
              setImageSrcAll(idView);
            }

          }
        }}>
          <s.Container flex={1} jc={"center"} ai={"center"} >
            <StyledImg 
              backgroundColor ="var(--accent-text)"
              id="hinhtrai" 
              alt={"example"} src={"/config/images/example.gif"}  />
          </s.Container>
        </ResponsiveWrapper>

        <ResponsiveWrapper onClick={(e) => { 
          if( e.target.id == "hinhgiua" ){
            propFunction(true);
          }
        }}>
          <s.Container 
            flex={1} jc={"center"} ai={"center"}>
          <s.SpacerLarge/>
          <s.TextTitle
            style={{
              textAlign: "center",
              fontSize: 50,
              fontWeight: "bold",
              color: "var(--accent-text)",
            }}
          >
            {idView} 
          </s.TextTitle>
          <StyledImgGalary 
            backgroundColor ="var(--accent)"
            id="hinhgiua" 
            src={"/config/images/example.gif"} />
            
          </s.Container>
        </ResponsiveWrapper>

          <ResponsiveWrapper onClick={(e) => { 
            if( e.target.id == "hinhphai" ){
              setIdView(idView+1);
              setImageSrcAll(idView);
            }
          }}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                id="hinhphai"
                backgroundColor ="var(--accent-text)"
                alt={"example"}
                src={"/config/images/example.gif"}
                style={{ transform: "scaleX(-1)" }}
              />
            </s.Container>
          </ResponsiveWrapper>
        </ResponsiveWrapper>

        
      </s.Container>
    </s.Screen>
  );
}

export default Galary;
