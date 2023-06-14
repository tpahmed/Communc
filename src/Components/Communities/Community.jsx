import { useContext, useEffect, useState } from "react"
import Container from "../Global/Container"
import Language from '../../Languages.json'
import themeJSON from '../../Theme.json'
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import { Profile_Context } from "../../Contexts/ProfileContext";
import "./Community.css";
import IAnnouncer from '../../assets/Announcer-Icon.svg';
import CssFilterConverter from "css-filter-converter";

export default function Community() {
    const {Account} = useContext(Profile_Context);
    const {id} = useParams();
    const [CommunityData,setCommunityData] = useState({});
    const [TotalVotes,setTotalVotes] = useState(0);
    const Navigator = useNavigate();
    const HTF = CssFilterConverter.hexToFilter;
    async function Update(){
        setTotalVotes(0)
        const result = await invoke("community_data", {id,token:sessionStorage.getItem("token")});
        setCommunityData(JSON.parse(result).msg);
        let f = 0;
        JSON.parse(result).msg.posts.forEach((e)=>{
            f += e.votes
        })
        setTotalVotes(f)
    }
    useEffect(()=>{
        Update();
    },[]);
    async function Vote(post_id){
        const result = await invoke("vote_post", {id:`${post_id}`,idcom:id,token:sessionStorage.getItem("token")});
        Update();
        
    }
    return (
    <Container>
        <div className='Community' style={{ '--color': CommunityData.color }}>
            <div className='Community-Data'>
                {
                CommunityData.posts ? 
                    <>
                        <img src={CommunityData.image} alt={CommunityData.title} />
                        <h3>{CommunityData.title}</h3>
                        <h4>{Language[Account.language]['Community']['By']} @{CommunityData.username}</h4>
                        <div>
                            <span>{Language[Account.language]['Community']['Posts :']} <b>{CommunityData.posts.length ? CommunityData.posts.length : 0}</b></span>
                            <span>{Language[Account.language]['Community']['Total Points :']} <b>{TotalVotes}</b></span>
                        </div>
                        <button onClick={()=>Navigator(`/post/${id}`)}>
                            {Language[Account.language]['Community']['New Post']}
                        </button>
                    </>
                    :
                    <></>
                }
            </div>
            <div className='Community-Posts'>
                {
                    CommunityData.posts ?
                    
                        CommunityData.posts.length ? CommunityData.posts.sort((a,b)=>b.votes-a.votes).map((e)=>{
                            return (
                                
                                <div className='Community-Post'>
                                    <div>
                                        <img src={e.image} alt={e.username} />
                                        <div>
                                            <span>{e.lname} {e.fname}</span>
                                            <span>@{e.username}</span>
                                        </div>
                                    </div>
                                    <p>
                                        {e.text}
                                    </p>
                                    {
                                        e.type ? (
                                            <img src={e.content} alt={e.text} />
                                        ):(
                                            <></>
                                        )
                                    }
                                    <div onClick={()=>Vote(e.id)} style={e.voted ? { color:'var(--color)',borderColor:'var(--color)' }:{ color:'var(--background)',borderColor:'var(--background)' }}>
                                        <img src={IAnnouncer} alt={Language[Account.language]['Community']['Vote']} style={{ filter:HTF(e.voted ? CommunityData.color : themeJSON[Account.theme]['background']).color }} />
                                        <span>{e.votes}</span>
                                    </div>
                                </div>
                            );
                        }
                        ):(
                            <></>
                        )
                    
                    :
                    <></>
                }
                
            </div>
        </div>
    </Container>
  )
}
