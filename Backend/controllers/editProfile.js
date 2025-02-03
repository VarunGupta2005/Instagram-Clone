import { checkCookie } from "../utils/Auth";

async function editProfile(req,res){
  const user = checkCookie(req);

}

export {editProfile};