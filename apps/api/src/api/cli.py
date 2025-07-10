"""CLI entry point for the API server."""

import uvicorn


def main() -> None:
    """Run the API server."""
    uvicorn.run(
        "api.main:app", host="0.0.0.0", port=8001, reload=False, log_level="info"
    )


if __name__ == "__main__":
    main()
