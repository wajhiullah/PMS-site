mod auth;
mod db;
mod error;
mod models;
mod routes;

use axum::Router;
use tower_http::{
    cors::{Any, CorsLayer},
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[derive(OpenApi)]
#[openapi(
    info(
        title = "PIEAS Materials Society (PMS) API",
        version = "1.0.0",
        description = "Official REST API for PIEAS Materials Society (DMME, PIEAS Islamabad)."
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    // Load .env if present
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
            "pms_platform=debug,tower_http=debug".into()
        }))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Create uploads directory
    tokio::fs::create_dir_all("uploads")
        .await
        .expect("Failed to create uploads directory");

    // Initialize database
    let pool = db::init_pool().await;
    db::run_migrations(&pool).await;
    db::seed_data(&pool).await;

    // CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // SPA fallback — serve frontend/dist with index.html fallback (returns 200 OK)
    let spa_service = ServeDir::new("frontend/dist")
        .fallback(ServeFile::new("frontend/dist/index.html"));

    // Build application
    let app = Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .merge(routes::public::public_routes())
        .merge(routes::admin::admin_routes())
        .nest_service("/uploads", ServeDir::new("uploads"))
        .fallback_service(spa_service)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(pool);

    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("{}:{}", host, port);
    tracing::info!("🚀 PMS Platform running at http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}
