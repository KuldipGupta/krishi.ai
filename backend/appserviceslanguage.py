from __future__ import annotations

from typing import Sequence

import groq
from langchain_core.messages import BaseMessage
from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, GROQ_MODEL, GROQ_MODEL_FALLBACKS


def build_groq_model_candidates(preferred_model: str | None = None) -> list[str]:
	model_names = [preferred_model or GROQ_MODEL, *GROQ_MODEL_FALLBACKS]
	seen: set[str] = set()
	candidates: list[str] = []

	for model_name in model_names:
		if model_name and model_name not in seen:
			seen.add(model_name)
			candidates.append(model_name)

	return candidates


def create_groq_llm(model_name: str, temperature: float = 0.4) -> ChatGroq:
	return ChatGroq(api_key=GROQ_API_KEY, model=model_name, temperature=temperature)


def _is_retryable_model_error(error: Exception) -> bool:
	if isinstance(error, (groq.BadRequestError, groq.NotFoundError)):
		message = str(error).lower()
		return "model_decommissioned" in message or "decommissioned" in message or "not found" in message
	return False


def invoke_groq_with_fallbacks(
	messages: Sequence[BaseMessage],
	temperature: float = 0.4,
	preferred_model: str | None = None,
):
	last_error: Exception | None = None

	for model_name in build_groq_model_candidates(preferred_model):
		try:
			llm = create_groq_llm(model_name, temperature=temperature)
			response = llm.invoke(messages)
			return response.content, model_name, None
		except Exception as error:
			if _is_retryable_model_error(error):
				last_error = error
				continue
			return None, model_name, error

	return None, None, last_error
