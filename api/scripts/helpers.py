import re
from requests import session, sessions
import json

def login() -> sessions.Session:
    password = input("Password: ")
    s = session()

    url = "https://expo-api.gotechnica.org/api/login/admin"
    payload = {
        'access_code': password
    }

    r = s.post(url, json=payload)
    print(r.content)

    return s