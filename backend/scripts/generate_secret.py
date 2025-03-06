#!/usr/bin/env python3
import secrets
import base64

def generate_secret_key():
    """Generate a secure secret key for JWT tokens."""
    # Generate 32 random bytes and encode them in base64
    return base64.b64encode(secrets.token_bytes(32)).decode('utf-8')

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("\nGenerated Secret Key:")
    print("--------------------")
    print(secret_key)
    print("\nAdd this to your .env file as:")
    print('SECRET_KEY="' + secret_key + '"')
    print("\nMake sure to keep this key secure and never commit it to version control!") 