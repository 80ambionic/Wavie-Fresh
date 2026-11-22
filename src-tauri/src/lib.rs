use std::path::PathBuf;

/// Writes a processed (pitched / time-stretched) WAV to a temp folder so it can be
/// dragged into a DAW or exported. Returns the absolute path of the staged file.
#[tauri::command]
fn stage_temp_wav(filename: String, wav_bytes: Vec<u8>) -> Result<String, String> {
    let safe_name: String = PathBuf::from(&filename)
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .filter(|n| !n.is_empty())
        .unwrap_or_else(|| "wavie_fresh_sample.wav".to_string());

    let dir = std::env::temp_dir().join("WavieFresh");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let path = dir.join(safe_name);
    std::fs::write(&path, wav_bytes).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().into_owned())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_drag::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![stage_temp_wav])
        .run(tauri::generate_context!())
        .expect("error while running Wavie Fresh");
}
