#!/bin/bash

# Function to check if a variable is set
check_var() {
    if [ -z "${!1}" ]; then
        echo "Error: $1 is not set"
        return 1
    fi
    return 0
}

# Check required variables
required_vars=(
    "OPENAI_API_KEY"
    "BLOCKCHAIN_ENDPOINT"
    "ADMIN_WALLET_KEY"
)

missing_vars=0
for var in "${required_vars[@]}"; do
    if ! check_var "$var"; then
        missing_vars=$((missing_vars + 1))
    fi
done

if [ $missing_vars -gt 0 ]; then
    echo "Error: Missing required environment variables"
    echo "Please set the following variables in your .env file:"
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "  $var"
        fi
    done
    exit 1
fi

echo "All required environment variables are set"
exit 0 