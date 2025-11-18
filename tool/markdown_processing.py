def splitMarkdown(markdown_text):
	heading_pattern = r"^#{1,6}\s+.*"
	parts = re.split(heading_pattern, markdown_text, flags=re.MULTILINE)
	content_list = [part.strip() for part in parts[1:] if part.strip()]
	return content_list


def removePreamble(markdown_text):
	pattern = r"\A.*?(?=^#\s)"
	cleaned_text = re.sub(pattern, "", markdown_text, flags=re.DOTALL | re.MULTILINE)
	return cleaned_text


MARKDOWN_LINK_PATTERN = re.compile(r"(\[.*?\])\((.*?)\)")
URL_PLACEHOLDER = "(DYNAMIC_URL_REMOVED)"


def normalize_markdown_links(markdown_text):
	def replacer(match):
		return match.group(1) + URL_PLACEHOLDER

	normalized_text = MARKDOWN_LINK_PATTERN.sub(replacer, markdown_text)
	return normalized_text
