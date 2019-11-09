# Gets sponsor access codes

import re
import requests
import json

def get_access_codes() -> None:
    password = input("Password: ")
    s = requests.session()

    url = "https://expo-api.gotechnica.org/api/companies"

    payload = {
        'access_code': password
    }
    r = s.post("https://expo-api.gotechnica.org/api/login/admin", json=payload)
    print(r.content)

    r2 = s.get(url)

    cs = set()

    for c in r2.json():
        cs.add(c['company_name'] + ' - ' + c['access_code'])

    for c in cs:
        print(c)


def main() -> None:
    #delete_project()
    get_access_codes()

if __name__ == "__main__":
    main()
