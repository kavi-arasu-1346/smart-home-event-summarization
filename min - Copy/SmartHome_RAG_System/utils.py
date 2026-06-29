
import re
import json
import logging

def extract_sql_from_response(response):
    """Extract SQL query from LLM response with improved parsing."""
    if not response:
        raise ValueError("Empty response received from LLM.")
    
    response = response.strip()
    
    # 1. Best case: it's wrapped in a sql markdown block
    sql_blocks = re.findall(r'```sql\s*(.*?)\s*```', response, re.IGNORECASE | re.DOTALL)
    if sql_blocks:
        sql = sql_blocks[0].strip()
        sql = re.sub(r'^\s*(selects?)\s+', 'SELECT ', sql, flags=re.IGNORECASE)
        return sql
        
    # Fix common LLM errors: "selects" -> "SELECT", "select" -> "SELECT"
    response_fixed = re.sub(r'\bselects?\b', 'SELECT', response, flags=re.IGNORECASE)
    
    # Try to find SQL query with semicolon
    queries = re.findall(r"\bSELECT\b.*?;", response_fixed, re.IGNORECASE | re.DOTALL)
    if queries:
        sql = queries[0].strip().rstrip(';').strip()
        if sql:
            sql = re.sub(r'^\s*(selects?)\s+', 'SELECT ', sql, flags=re.IGNORECASE)
            return sql
            
    # Try to find SQL query without semicolon
    queries = re.findall(r"\bSELECT\b.*?(?=\n\n|\n[A-Z]|$)", response_fixed, re.IGNORECASE | re.DOTALL)
    if queries:
        sql = queries[0].strip().rstrip(';').strip()
        if sql:
            sql = re.sub(r'^\s*(selects?)\s+', 'SELECT ', sql, flags=re.IGNORECASE)
            return sql
            
    # Fallback cleanup
    cleaned = re.sub(r'```sql\s*', '', response_fixed, flags=re.IGNORECASE)
    cleaned = re.sub(r'```\s*', '', cleaned)
    cleaned = cleaned.strip()
    if cleaned.upper().startswith("SELECT"):
        return cleaned
        
    raise ValueError(f"No valid SQL query found in response: {response[:200]}...")

def extract_list_from_response(response_list):
    """
    Extract the content between the first `[` and the last `]` from a list of strings.
    Also supports parsing newline-separated lists if brackets are missing.
    """
    try:
        combined_text = ""
        if isinstance(response_list, str):
            combined_text = response_list
        elif isinstance(response_list, list) and all(isinstance(item, str) for item in response_list):
            combined_text = ''.join(response_list)
        else:
            logging.error(f"Invalid response format: {response_list}")
            return []

        # Strategy 1: Look for JSON list structure
        start_idx = combined_text.find('[')
        end_idx = combined_text.rfind(']')

        if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
            content_between_brackets = combined_text[start_idx + 1:end_idx]
            sub_questions = [item.strip().strip('"').strip("'") for item in content_between_brackets.split(',')]
            sub_questions = [q for q in sub_questions if q] 
            return sub_questions
        
        # Strategy 2: Look for bullet points or numbered lists
        lines = combined_text.splitlines()
        extracted = []
        for line in lines:
            line = line.strip()
            if line.startswith(("-", "*")) or (line and line[0].isdigit() and ". " in line[:4]):
                cleaned = re.sub(r'^[\-\*]|\d+\.\s*', '', line).strip()
                if cleaned:
                    extracted.append(cleaned)
        
        if extracted:
            return extracted

        # Strategy 3: Extract questions
        questions = [line.strip() for line in lines if "?" in line and line.strip()]
        if questions:
            return questions

        return []

    except Exception as e:
        logging.error(f"Error extracting list from response: {response_list}. Exception: {e}")
        return []

def extract_json(response_text):
    """Safely extracts JSON object from text."""
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        try:
            json_str = response_text[response_text.index("{"):response_text.rindex("}") + 1]
            return json.loads(json_str)
        except:
            return {}

def extract_numbers(text):
    """Extracts numerical values from text, including negative numbers and decimals."""
    return [float(num) for num in re.findall(r'-?\d+\.?\d*', str(text)) if num and num != '-' and num != '.']

def fix_encoding(text):
    """Fixes common encoding issues."""
    try:
        return text.encode('latin1').decode('utf-8') if "ï¿½" in text else text
    except:
        return text

def correct_case_in_query(sql_query, schema_info, device_location_info):
    """Corrects case sensitivity in SQL queries."""
    device_location_dict = {device.lower(): (device, location) for device, location in device_location_info}
    table_names = [table.lower() for table in schema_info.keys()]

    def replace_case(match):
        word = match.group(0).lower()
        if word in device_location_dict:
            return device_location_dict[word][0]
        elif word in table_names:
            for table in schema_info.keys():
                if table.lower() == word:
                    return table
        return match.group(0)

    return re.sub(r'\b\w+\b', replace_case, sql_query)
