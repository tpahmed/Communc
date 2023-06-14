import { useContext, useEffect, useRef, useState } from "react";
import { Profile_Context } from "../Contexts/ProfileContext";
import CssFilterConverter from "css-filter-converter";
import SFavorite from '../assets/Star-Favorite.svg'
import IImage from '../assets/Image-Icon.svg'
import themeJSON from '../Theme.json'
import Language from '../Languages.json'
import './Communities.css';
import { HexColorPicker } from 'react-colorful'
import Container from "./Global/Container";
import { invoke } from "@tauri-apps/api";
import { ActionBar_Context } from "../Contexts/ActionBarContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCommunity(){

  const {SetActionBar_Active,ActionBar_Active} = useContext(ActionBar_Context);
  const { Account } = useContext(Profile_Context);
  const HTF = CssFilterConverter.hexToFilter;
  
  const [NewCommunity,SetNewCommunity] = useState({image:'',title:'',color:''});
  const [ImgPreview,SetImgPreview] = useState(null);
  const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].background).color);
  const imageInput = useRef(null);
  useEffect(()=>{
    if(!ActionBar_Active){
        SetNewCommunity({image:'',title:'',color:''});
        SetImgPreview(null);
    }
  },[ActionBar_Active]);
  
    useEffect(()=>{
        SetSVG_filter(HTF(themeJSON[Account.theme].text).color);
    },[Account.theme]);
  
  const handleimage = (e)=>{
    if (e.target.files[0] && /image\/./.test(e.target.files[0].type)){
      SetNewCommunity({...NewCommunity,image:e.target.files[0]});
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      SetImgPreview(imageUrl);
    }
  }
  
  async function Create(){
    
    const form = new FormData();
    form.append('token',sessionStorage.getItem('token'));  
    form.append('title',NewCommunity.title);  
    form.append('image',NewCommunity.image);  
    form.append('color',NewCommunity.color);  
    await axios.post('//localhost:4055/communities/add',form);
    SetActionBar_Active(false);
  }


  return (
    <>
      <ul className='Communities-CreateCommunity'>
        <li>
          <span>{Language[Account.language]["Communities"]['Community Title :']}</span>
          <input type="text" value={NewCommunity.title} onChange={(e)=>SetNewCommunity({...NewCommunity,title:e.target.value})}/>
        </li>
        <li>
          <span>{Language[Account.language]["Communities"]['Community Image :']}</span>
          <input type="file" ref={imageInput} onChange={handleimage} style={{ display:'none' }}/>
          <img src={ImgPreview ? ImgPreview : IImage} onClick={()=>imageInput.current.click()} alt={Language[Account.language]["Messages"]['Group Image']} style={{ filter:ImgPreview ? null : SVG_filter }} />
        </li>
        <li>
          <span>{Language[Account.language]["Communities"]['Community Image :']}</span>
          <HexColorPicker color={NewCommunity.color} onChange={(e)=>SetNewCommunity({...NewCommunity,color:e})}/>
        </li>

        <li>
          <input type="button" value={Language[Account.language]["Communities"]['Create']} onClick={Create} />
        </li>
      </ul>
    </>
  );
}

export default function Communities() {
    
    const {Account,getAccount} = useContext(Profile_Context);
    const {SetActionBar_title,SetActionBar_options,SetActionBar_content,SetActionBar_Active,ActionBar_Active} = useContext(ActionBar_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].text).color);
    const [Communs,setCommunities] = useState([]);
    const Navigator = useNavigate();
    async function Update(){
        const result = await invoke('get_communities',{token:sessionStorage.getItem('token')});
        setCommunities(JSON.parse(result).msg);
    }
    async function Favorite(id){
      console.log(id)
      await invoke('add_favorite',{token:sessionStorage.getItem('token'),id:`${id}`});
      Update();

    }
    
    function CreateCommunityAction(){
        SetActionBar_title(Language[Account.language]["Communities"]['Create a New Community']);
        SetActionBar_options(null);
        SetActionBar_content(<CreateCommunity/>)
        SetActionBar_Active(true);
    }

    useEffect(()=>{
        Update();
    },[ActionBar_Active]);
    return (
      <Container>
          <div className="Communities">
            <div className="Communities-Titles">
              <h2>{Language[Account.language]["Communities"]['Our Communities']}</h2>
              
              <div>
                  
              </div>
              <div>
                <button onClick={CreateCommunityAction}>{Language[Account.language]["Communities"]['Create Community']}</button>
              </div>
            </div>
            <div className="Communities-Content">
                {
                    
                    Communs.map((e)=>{
                        
                        return (
                            <div className="Communities-Community" style={{ "--color":e.color }} key={e.id} onClick={()=>Navigator(`/communities/${e.id}`)}>
                                <img src={e.image} alt={e.title} />
                                <img src={SFavorite} onClick={(ec)=>{Favorite(e.id);ec.stopPropagation();}} style={{ filter: `${HTF(themeJSON[Account.theme][e.favorite ? "yellow" : "primary"]).color} drop-shadow(1px 0 0  var(--yellow)) drop-shadow(-1px 0 0  var(--yellow)) drop-shadow(0 -1px 0  var(--yellow)) drop-shadow(0 1px 0 var(--yellow))`}}/>
                                <h3>{e.title}</h3>
                            </div>
                        )
                    })
                }
                
            </div>
          </div>
      </Container>
    )
  }
  