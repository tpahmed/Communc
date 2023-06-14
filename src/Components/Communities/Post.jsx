import { useContext, useEffect, useRef, useState } from "react"
import Container from "../Global/Container"
import Language from '../../Languages.json'
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import { Profile_Context } from "../../Contexts/ProfileContext";
import IImage from '../../assets/Image-Icon.svg'
import IVideo from '../../assets/Video-Icon.svg'
import "./Post.css";
import CssFilterConverter from "css-filter-converter";
import axios from "axios";

export default function Post() {
    const {Account,getAccount} = useContext(Profile_Context);
    const {id} = useParams();
    const [CommunityData,setCommunityData] = useState({});
    const [PostData,setPostData] = useState({type:'',text:''});
    const [ImagePrev,setImagePrev] = useState(null);
    const UploadInput = useRef();
    const HTF = CssFilterConverter.hexToFilter;
    const Navigator = useNavigate();

    async function Update(){
        const result = await invoke("community_data", {id,token:sessionStorage.getItem("token")});
        setCommunityData(JSON.parse(result).msg);
    }
    useEffect(()=>{
        Update();
    },[]);
    function handleImage(e){
        if(e.target.files[0]){
            if(/image\/./.test(e.target.files[0].type)){
                setPostData({...PostData,content:e.target.files[0],type:'image'});
                const Obj_URL = URL.createObjectURL(e.target.files[0]);
                setImagePrev(Obj_URL);
            }
            // else if(/video\/./.test(e.target.files[0].type)){
            //     setPostData({...PostData,content:e.target.files[0],type:'video'});
            //     setImagePrev(1);
            // }
        }
    }
    const Create = async ()=>{
        if(!PostData.text && !PostData.content){
            return;
        }
        const formData = new FormData();
        formData.append('token',sessionStorage.getItem('token'));
        formData.append('text',PostData.text);
        formData.append('type',PostData.type);
        formData.append('id',id);
        formData.append('content',PostData.content);
        await axios.post('//localhost:4055/post',formData,{
            headers:'multipart/form-data'
        })
        setImagePrev('');
        Navigator(`/communities/${id}`);
    }
    return (
    <Container>
        <div className='Post' style={{ '--color': CommunityData.color }}>
            <h3>{Language[Account.language]['Post']["Create Your Post"]}</h3>
            <textarea value={PostData.text} onChange={(e)=>setPostData({...PostData,text:e.target.value})} cols="30" rows="10" placeholder={Language[Account.language]['Post']['Tell Us Something']}></textarea>
            <input type="file" style={{ display:"none" }} ref={UploadInput} onChange={handleImage}/>
            {
                ImagePrev ? (
                    PostData.type == 'image' ?
                    <img className="Post-Attachment" src={ImagePrev} alt={Language[Account.language]['Post']["Attachment"]} onClick={()=>UploadInput.current.click()} />
                    :
                    <div className="Post-Attachment" onClick={()=>UploadInput.current.click()} style={{ padding:'1em' }}>
                        <img src={IVideo} alt={Language[Account.language]['Post']["Video Uploaded"]} style={{ filter:HTF(CommunityData.color).color }} width={'40px'} />
                        <span>{Language[Account.language]['Post']["Video Uploaded"]}</span>
                    </div>
                    )
                :
                <div className="Post-Attachment" onClick={()=>UploadInput.current.click()} style={{ padding:'1em' }}>
                    <img src={IImage} alt={Language[Account.language]['Post']["Attachment"]} style={{ filter:HTF(CommunityData.color).color }} />
                    <span>{Language[Account.language]['Post']["Attachment"]}</span>
                </div>
            }
            <div>
                <button onClick={Create}>
                    {Language[Account.language]['Post']["Create"]}
                </button>
                <button onClick={()=>Navigator(`/communities/${id}`)}>
                    {Language[Account.language]['Post']["Cancel"]}
                </button>
            </div>
        </div>
    </Container>
  )
}
