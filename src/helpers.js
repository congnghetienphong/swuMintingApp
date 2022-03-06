function getTokenIds(startTokenId, size) {
    return Array(size)
        .fill()
        .map((element, index) => index + startTokenId);
}

function getAmounts(size) {
    return Array(size).fill(1);
}
function setImageSrcAll(idMint)  {
    idMint = idMint <= 1 ? 2 : idMint;
    idMint = idMint >= 5984 ? 5983 : idMint;
    var dongdan ='https://opensea.mypinata.cloud/ipfs/QmRuSYRfFhEgq62WxPRM3RdA2Ds3zpeNEKotdLh7w2XW3T/';
    document.getElementById("hinhtrai").src = dongdan + (idMint - 1) + '.png';
    document.getElementById("hinhgiua").src = dongdan + idMint  + '.png';
    document.getElementById("hinhphai").src = dongdan + (idMint + 1) + '.png';
  };
module.exports = {
    getTokenIds,
    getAmounts,
    setImageSrcAll,
};
