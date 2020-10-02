
export function addZero(val,n) {
    if(isNaN(val)==false) {
        while(val.toString().length < n) {
            val = "0" + val;
        }
    }
    return val;
}