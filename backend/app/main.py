"""ASGI entrypoint for `uvicorn app.main:app`."""

from appmain import app

__all__ = ["app"]