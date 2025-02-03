async function signout(req, res)  {
  try{
    res.clearCookie("ChatAppCookie");
    res.redirect("/signin");
  }catch(error){
    console.log(error)
    res.send(`<script>
      alert("An error occured - Please try again")
      </script>`)
  }
 
}
export default signout;