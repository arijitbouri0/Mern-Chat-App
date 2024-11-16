import { keyframes, Skeleton, styled } from "@mui/material";
import { Link as LinkComponent } from 'react-router-dom'
import { grayColor } from "../../constants/color";

export const Link = styled(LinkComponent)`
text-decoration:none;
color:black;
padding:1rem;
&:hover{
    background-color:#f0f0f0
}
`



export const InputBox = styled("input")`
width:100%;
height:100%;
border:none;
outline:none;
padding:0 3rem;
border-radius:1.5rem;
background-color:${grayColor}
`

const bounceAnimation=keyframes`
0% {transform: scale(1);}
50% {transform: scale(1.5);}
1000% {transform: scale(1);}
`
// Colorful bouncing skeleton
export const BouncingSkeleton=styled(Skeleton)(()=>({
    animation:`${bounceAnimation} is infinite` 
}))
