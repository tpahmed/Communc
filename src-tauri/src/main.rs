// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn login(email: &str,password: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/login").form(&[("email",email),("password",password)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn check_token(token: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/check").form(&[("token",token)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn forgot_pass(email: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/forgot").form(&[("email",email)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn check_recovery(code: &str,email: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/validate").form(&[("code",code),("email",email)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn change_password(code: &str,email: &str,password: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/change_pass").form(&[("code",code),("email",email),("password",password)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn get_friends(token: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/friends").form(&[("token",token)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn delete_Friend(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/friends/delete").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn send_friend_request(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/friends/request").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn friend_request_action(token: &str,id: &str,action: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/friends/request/action").form(&[("token",token),("id",id),("action",action)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn get_friend_requests(token: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/friends/request/get").form(&[("token",token)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn get_conversations(token: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/conversation/get").form(&[("token",token)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn get_conversations_info(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/conversation/info").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn get_conversation_messages(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/messages/get").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}


#[tauri::command]
async fn add_conversation_participent(token: &str,id: &str,members: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/conversation/add").form(&[("token",token),("id",id),("members",members)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn delete_conversation_participent(token: &str,id: &str,memberid: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/conversation/delete").form(&[("token",token),("id",id),("member_id",memberid)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn quit_conversation(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/group/quit").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn delete_group(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/group/delete").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}


#[tauri::command]
async fn get_friends_add(token: &str,id: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/conversation/friends").form(&[("token",token),("id",id)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn send_message(token: &str,id: &str,msg_type: &str,content: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/messages/send").form(&[("token",token),("id",id),("type",msg_type),("content",content)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn get_profile(token: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/profile/get").form(&[("token",token)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn edit_profile(token: &str,account: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/profile/edit").form(&[("token",token),("account",account)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

#[tauri::command]
async fn bug_report(token: &str,message: &str) -> Result<String,()> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:4055/report").form(&[("token",token),("message",message)]).send().await;
    Ok(res.unwrap().text().await.unwrap())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,check_token,forgot_pass,
            check_recovery,change_password,
            get_friends,delete_Friend,
            send_friend_request,friend_request_action,
            get_friend_requests,get_conversations,
            get_conversation_messages,get_conversations_info,
            send_message,get_profile,
            edit_profile,bug_report,get_friends_add,
            add_conversation_participent,delete_conversation_participent,
            delete_group,quit_conversation
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
