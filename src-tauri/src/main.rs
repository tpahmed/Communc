// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest;

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![login,check_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
