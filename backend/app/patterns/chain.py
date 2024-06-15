from typing import Optional

class Handler:
    def __init__(self, name: str, method: function, next: Optional['Handler'] = None):
        self.name = name
        self.method = method
        self.next = next

    def set_next(self, next_handler: 'Handler') -> 'Handler':
        self.next = next_handler
        return self.next

    def setMethod(self, method:function):
        self.method = method
    
    def setNext(self, next: Optional['Handler']):
        self.next = next