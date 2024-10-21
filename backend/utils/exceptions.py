# utils/exceptions.py
class ApplicationException(Exception):
    """Base class for all custom exceptions in the application"""
    pass

class ResourceNotFoundError(ApplicationException):
    """Raised when a requested resource is not found"""
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message

class ValidationError(ApplicationException):
    """Raised when there is an error validating data"""
    def __init__(self, errors):
        self.errors = errors

    def __str__(self):
        error_messages = "\n".join(f"{field}: {", ".join(messages)}" for field, messages in self.errors.items())
        return f"Validation errors:\n{error_messages}"

class UnauthorizedError(ApplicationException):
    """Raised when a user is not authorized to perform an action"""
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message

class InternalServerError(ApplicationException):
    """Raised when there is an unexpected error on the server"""
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message