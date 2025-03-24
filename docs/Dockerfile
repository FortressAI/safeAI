FROM python:3.9-slim

WORKDIR /app

# Copy requirements file first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p /app/docs

# Expose port
EXPOSE 8080

# Start MkDocs server
CMD ["mkdocs", "serve", "-a", "0.0.0.0:8080"] 