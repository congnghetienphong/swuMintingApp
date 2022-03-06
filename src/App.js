import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import {    getTokenIds,   getAmounts } from "./helpers.js";
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
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
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



function App({propFunction}) {

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

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <a 
        onClick={(e) => { 
          if( e.target.id == "hinhdong" ){
            propFunction(false);
          }
        }}
        >
        <s.Container  flex={1} jc={"center"} ai={"center"}
          >
            <StyledImgLogo id="hinhdong"   alt={"example"}
            src={'/config/images/bg.png'} />
          </s.Container>
        </a>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
             <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={blockchain.account === null ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementIdfrom();
                        }}
                      >
                        {"<="}
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                      <Input placeholder="Pick NTF" id="txtInputData" 
                      
                      onChange={(e) => {
                          changeID(Number(e.target.value)== 0 ? 1 : Number(e.target.value));
                          //console.log(blockchain.account);
                      }}
                      />

                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={blockchain.account === null ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementIdFrom();
                        }}
                      >
                         {"=>"}
                      </StyledRoundButton>
                    </s.Container>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              <StyledButton
                onClick={(e) => {
                  window.open("/config/roadmap.pdf", "_blank");
                }}
                style={{
                  margin: "5px",
                }}
              >
                Roadmap
              </StyledButton>
              <StyledButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton>
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {priceAmount}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  It is FREE but you can buy me a coffee.
                </s.TextDescription> 
                <s.SpacerXSmall />
                <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementPriceAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {priceAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementPriceAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerMedium />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton id="connectButton"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(idFrom,mintAmount);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
