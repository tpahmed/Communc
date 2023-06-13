import { useEffect, useState } from "react"
import Container from "../Global/Container"
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api";

export default function Community() {
    const {id} = useParams();
    const [CommunityData,setCommunityData] = useState({});
    async function Update(){
        const result = await invoke("community_data", {id,token:sessionStorage.getItem("token")});
        console.log(result);
        setCommunityData(JSON.parse(result).msg);
    }
    useEffect(()=>{
        Update();
    },[]);
    return (
    <Container>
        <div className='Community'>
            <div className='Community-Title'>
                <h2>{CommunityData.title}</h2>
            </div>
        </div>
    </Container>
  )
}
