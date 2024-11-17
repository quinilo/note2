// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/*fn main() {
    tauri_note2_lib::run()
}*/

use gtk::prelude::*;
use gtk::Settings;

fn set_dark_mode() {
    if let Some(settings) = Settings::default() {
        // Set the dark mode preference
        settings.set_gtk_application_prefer_dark_theme(true);
    }
}

fn main() {
    // Initialize GTK
    gtk::init().expect("Failed to initialize GTK");

    // Apply dark mode settings
    set_dark_mode();

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}