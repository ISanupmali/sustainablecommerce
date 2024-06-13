const MaskedCardNumber = (cardNo) => {
    var mask = cardNo.replace(cardNo.substring(0,12),"************");
    return mask;
}

export default MaskedCardNumber;