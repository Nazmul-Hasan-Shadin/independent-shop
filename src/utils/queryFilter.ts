
export const filterQuery=(queryObj:{[key:string]:unknown},pureKey:string[])=>{
    const filteredQuery:Record<string,unknown>={}
     Object.keys(queryObj).forEach((key)=>{
           if(pureKey.includes(key)) {
              filteredQuery[key]=queryObj[key]
           }
     })
     return filteredQuery;
}