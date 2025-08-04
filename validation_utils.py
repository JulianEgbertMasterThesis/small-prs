import re


def clamp(value: int | float, min_value: int | float, max_value: int | float) -> int | float:
    """
    Clamp value between min and max.
    
    Args:
        value: Value to clamp
        min_value: Minimum allowed value
        max_value: Maximum allowed value
        
    Returns:
        Clamped value
    """
    return max(min_value, min(value, max_value))


def is_valid_password(password: str, min_length: int = 8, require_number: bool = True,
                      require_uppercase: bool = True) -> bool:
    """
    Validate password strength based on criteria.
    
    Args:
        password (str): Password to validate
        min_length (int): Minimum password length
        require_special (bool): Require special characters
        require_number (bool): Require numbers
        require_uppercase (bool): Require uppercase letters
        
    Returns:
        bool: True if password meets all criteria
    """
    if len(password) < min_length:
        return False
    
    if require_uppercase and not re.search(r'[A-Z]', password):
        return False
    
    if require_number and not re.search(r'\d', password):
        return False
    
    return True


def is_valid_hex_color(color: str) -> bool:
    """
    Validate hexadecimal color code.
    
    Args:
        color (str): Color code to validate
        
    Returns:
        bool: True if valid hex color
    """
    pattern = r'^#(?:[0-9a-fA-F]{3}){1,2}$'
    return bool(re.match(pattern, color))


def is_in_range(value: int | float, min_val: int | float, max_val: int | float, 
               inclusive: bool = True) -> bool:
    """
    Check if value is within specified range.
    
    Args:
        value: Value to check
        min_val: Minimum value
        max_val: Maximum value
        inclusive (bool): Whether range is inclusive
        
    Returns:
        bool: True if value is in range
    """
    if inclusive:
        return min_val <= value <= max_val
    else:
        return min_val < value < max_val


def validate_length(text: str, min_length: int = 0, max_length: int = None) -> bool:
    """
    Validate text length.
    
    Args:
        text (str): Text to validate
        min_length (int): Minimum length
        max_length (int): Maximum length (None for no limit)
        
    Returns:
        bool: True if length is valid
    """
    if len(text) < min_length:
        return False
    
    if max_length is not None and len(text) > max_length:
        return False
    
    return True


def contains_only_allowed_chars(text: str, allowed_chars: str) -> bool:
    """
    Check if text contains only allowed characters.
    
    Args:
        text (str): Text to check
        allowed_chars (str): String of allowed characters
        
    Returns:
        bool: True if text contains only allowed characters
    """
    return all(char in allowed_chars for char in text)
