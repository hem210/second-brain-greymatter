export const randomhash = (len: number) => {
    const options = "qwertyuiopasdfghjklzxcvbnm123456890";
    let hash = "";
    for(let i=0; i<len; i++){
        hash += options[Math.floor(Math.random() * options.length)];
    }
    return hash;
}