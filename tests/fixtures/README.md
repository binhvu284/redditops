# Synthetic proxy TLS fixture

The certificate and private key in this directory are public, disposable localhost test fixtures only. They authenticate no operator, Reddit account or production endpoint. Never use this key in a real deployment. The tests explicitly trust this certificate only in an in-process transport fixture; production certificate verification stays enabled.
