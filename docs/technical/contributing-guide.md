# Contributing to SafeAI
Thank you for your interest in contributing to SafeAI! This guide will help you get started with contributing to our platform.
## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Code Style](#code-style)
4. [Testing](#testing)
5. [Documentation](#documentation)
6. [Pull Requests](#pull-requests)
7. [Community Guidelines](#community-guidelines)
8. [Resources](#resources)
## Getting Started
### Prerequisites
- Git
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Docker (optional)
### Fork and Clone
1. Fork the [SafeAI repository](https://github.com/safeai/safeai)
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/safeai.git
cd safeai
```
3. Add the upstream remote:
```bash
git remote add upstream https://github.com/safeai/safeai.git
```
## Development Setup
### Environment Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
2. Install dependencies:
```bash
pip install -r requirements.txt
npm install
```
3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```
### Running Locally
1. Start the development server:
```bash
npm run dev
python manage.py runserver
```
2. Access the platform at `http://localhost:3000`
## Code Style
### Python
We follow PEP 8 guidelines. Use `black` for formatting:
```bash
black .
```
### JavaScript/TypeScript
We use ESLint and Prettier. Format your code:
```bash
npm run format
```
### General Guidelines
1. Use meaningful variable and function names
2. Write clear, concise comments
3. Keep functions focused and small
4. Follow the DRY principle
5. Use consistent indentation
## Testing
### Running Tests
```bash
# Python tests
pytest

# JavaScript tests
npm test
```
### Writing Tests
1. Write unit tests for new features
2. Include integration tests for API endpoints
3. Test edge cases and error conditions
4. Maintain test coverage above 80%
### Test Structure
```python
def test_feature():
    # Arrange
    setup_test_data()
    
    # Act
    result = feature_function()
    
    # Assert
    assert result == expected_value
```
## Documentation
### Code Documentation
1. Document all public APIs
2. Include type hints
3. Write clear docstrings
4. Update README files
### Example
```python
def process_data(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Process input data and return formatted results.
    
    Args:
        data: Dictionary containing input data
        
    Returns:
        List of processed data dictionaries
        
    Raises:
        ValueError: If input data is invalid
    """
    # Implementation
```
## Pull Requests
### Creating a PR
1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```
2. Make your changes
3. Commit your changes:
```bash
git commit -m "feat: add new feature"
```
4. Push to your fork:
```bash
git push origin feature/your-feature-name
```
5. Create a Pull Request on GitHub
### PR Guidelines
1. Use clear, descriptive titles
2. Include a detailed description
3. Reference related issues
4. Add tests for new features
5. Update documentation
6. Ensure CI checks pass
### Commit Messages
Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks
## Community Guidelines
### Communication
1. Be respectful and professional
2. Use inclusive language
3. Provide constructive feedback
4. Follow the code of conduct
### Getting Help
1. Check existing documentation
2. Search closed issues
3. Ask in the community forum
4. Join our Discord server
## Resources
### Documentation
- [API Documentation](api-reference.md)
- [SDK Guide](sdk-documentation.md)
- [Architecture Overview](architecture.md)
### Community
- [Discord Server](https://discord.gg/safeai)
- [Community Forum](https://community.safeAIcoin.com)
- [Blog](https://blog.safeAIcoin.com)
### Tools
- [Issue Tracker](https://github.com/safeai/safeai/issues)
- [Project Board](https://github.com/safeai/safeai/projects)
- [CI/CD Pipeline](https://github.com/safeai/safeai/actions)
## Support
For contribution support:
1. Join our [Developer Discord](https://discord.gg/safeai)
2. Contact contribute@safeAIcoin.com
3. Check our [Contributor FAQ](contributor-faq.md)
## License
By contributing to SafeAI, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 