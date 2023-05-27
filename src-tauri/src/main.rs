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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![login,check_token,forgot_pass,check_recovery,change_password,get_friends,delete_Friend,send_friend_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
