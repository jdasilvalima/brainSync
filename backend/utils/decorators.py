from functools import wraps
import time
from extensions import logger


def measure_time(func):
    @wraps(func)
    def _time_it(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time
        logger.info(f" Total execution time {func.__name__} : {execution_time:.4f} secondes.")
        return result
    return _time_it