import { Link } from "react-router-dom";
import { Stack } from "@mui/material";
import Logo from '../assets/images/Logo.png';

export default function NavBar(){
    return(
        <Stack>
            <Link to ="/">
                <img src ={Logo} alt="page logo" style={
                    {
                        width: "48px",
                        height: "48px",
                        margin: "0 20px"
                    }
                }/>
            </Link>
            <Stack>
                <Link to="/">Home</Link>
                <a href="#exercises" style ={
                    {
                        textDecoration: "none",
                        color: "#3A1212"
                    }
                }>Exercises</a>
            </Stack>
        </Stack>
    )
    

}