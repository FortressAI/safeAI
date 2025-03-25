# Development Setup Guide

## Introduction

This guide provides instructions for setting up the development environment for the SafeAI Platform using Neo4j's Cypher query language.

## Prerequisites

### 1. System Requirements

```cypher
// Create System Requirements Template
CREATE (sr:SystemRequirements {
    name: 'system_requirements_template',
    version: '1.0',
    
    // Hardware Requirements
    min_memory_gb: 8,
    min_cpu_cores: 4,
    min_disk_gb: 50,
    
    // Software Requirements
    os_versions: ['macOS 10.15+', 'Ubuntu 20.04+', 'Windows 10+'],
    required_tools: ['Git', 'Docker', 'Python 3.8+'],
    
    // Network Requirements
    min_bandwidth_mbps: 10,
    required_ports: [5432, 7474, 7687],
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN sr;

// Create System Requirements Instance
MATCH (sr:SystemRequirements {name: 'system_requirements_template'})
CREATE (requirements:SystemRequirementsInstance {
    name: 'current_requirements',
    template_version: sr.version,
    
    // Requirements Status
    memory_met: false,
    cpu_met: false,
    disk_met: false,
    os_compatible: false,
    tools_installed: false,
    network_ready: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (sr)-[:TEMPLATE_FOR]->(requirements)
RETURN requirements;
```

### 2. Required Software

```cypher
// Create Software Requirements Template
CREATE (sw:SoftwareRequirements {
    name: 'software_requirements_template',
    version: '1.0',
    
    // Python Requirements
    python_version: '3.8+',
    python_packages: ['neo4j', 'pytest', 'black', 'pylint', 'mypy'],
    
    // Git Requirements
    git_version: '2.30+',
    git_configs: ['user.name', 'user.email', 'core.autocrlf'],
    
    // Docker Requirements
    docker_version: '20.10+',
    docker_compose_version: '2.0+',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN sw;

// Create Software Requirements Instance
MATCH (sw:SoftwareRequirements {name: 'software_requirements_template'})
CREATE (requirements:SoftwareRequirementsInstance {
    name: 'current_requirements',
    template_version: sw.version,
    
    // Requirements Status
    python_installed: false,
    python_packages_installed: false,
    git_installed: false,
    git_configured: false,
    docker_installed: false,
    docker_compose_installed: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (sw)-[:TEMPLATE_FOR]->(requirements)
RETURN requirements;
```

## Installation Steps

### 1. Python Setup

```cypher
// Create Python Setup Template
CREATE (ps:PythonSetup {
    name: 'python_setup_template',
    version: '1.0',
    
    // Setup Steps
    step1_required: true,
    step1_order: 1,
    step1_description: 'Install Python 3.8 or higher',
    
    step2_required: true,
    step2_order: 2,
    step2_description: 'Create virtual environment',
    
    step3_required: true,
    step3_order: 3,
    step3_description: 'Install Poetry package manager',
    
    step4_required: true,
    step4_order: 4,
    step4_description: 'Verify Python setup',
    
    // Dependencies
    core_packages: ['neo4j', 'pytest', 'black'],
    dev_packages: ['pylint', 'mypy', 'coverage'],
    test_packages: ['pytest-cov', 'pytest-mock'],
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ps;

// Create Python Setup Instance
MATCH (ps:PythonSetup {name: 'python_setup_template'})
CREATE (setup:PythonSetupInstance {
    name: 'current_setup',
    template_version: ps.version,
    
    // Setup Status
    step1_completed: false,
    step2_completed: false,
    step3_completed: false,
    step4_completed: false,
    
    // Dependencies Status
    core_packages_installed: false,
    dev_packages_installed: false,
    test_packages_installed: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (ps)-[:TEMPLATE_FOR]->(setup)
RETURN setup;
```

### 2. Git Setup

```cypher
// Create Git Setup Template
CREATE (gs:GitSetup {
    name: 'git_setup_template',
    version: '1.0',
    
    // Configuration
    config1_name: 'user.name',
    config1_value: 'string',
    
    config2_name: 'user.email',
    config2_value: 'string',
    
    config3_name: 'core.autocrlf',
    config3_value: 'string',
    
    // Repository Setup
    repo1_name: 'origin',
    repo1_url: 'string',
    
    repo2_name: 'upstream',
    repo2_url: 'string',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN gs;

// Create Git Setup Instance
MATCH (gs:GitSetup {name: 'git_setup_template'})
CREATE (setup:GitSetupInstance {
    name: 'current_setup',
    template_version: gs.version,
    
    // Configuration Status
    config1_set: false,
    config2_set: false,
    config3_set: false,
    
    // Repository Status
    repo1_configured: false,
    repo2_configured: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (gs)-[:TEMPLATE_FOR]->(setup)
RETURN setup;
```

### 3. Docker Setup

```cypher
// Create Docker Setup Template
CREATE (ds:DockerSetup {
    name: 'docker_setup_template',
    version: '1.0',
    
    // Container Configuration
    container1_name: 'neo4j',
    container1_image: 'neo4j:5',
    container1_ports: [7474, 7687],
    
    container2_name: 'redis',
    container2_image: 'redis:6',
    container2_ports: [6379],
    
    // Network Configuration
    network_name: 'safeai_network',
    network_driver: 'bridge',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ds;

// Create Docker Setup Instance
MATCH (ds:DockerSetup {name: 'docker_setup_template'})
CREATE (setup:DockerSetupInstance {
    name: 'current_setup',
    template_version: ds.version,
    
    // Container Status
    container1_running: false,
    container2_running: false,
    
    // Network Status
    network_created: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (ds)-[:TEMPLATE_FOR]->(setup)
RETURN setup;
```

## Project Setup

### 1. Repository Setup

```cypher
// Create Repository Setup Template
CREATE (rs:RepositorySetup {
    name: 'repository_setup_template',
    version: '1.0',
    
    // Repository Configuration
    repo_name: 'safeai',
    repo_url: 'string',
    branch_name: 'main',
    
    // Project Structure
    dir1_name: 'src',
    dir1_purpose: 'Source code',
    
    dir2_name: 'tests',
    dir2_purpose: 'Test files',
    
    dir3_name: 'docs',
    dir3_purpose: 'Documentation',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN rs;

// Create Repository Setup Instance
MATCH (rs:RepositorySetup {name: 'repository_setup_template'})
CREATE (setup:RepositorySetupInstance {
    name: 'current_setup',
    template_version: rs.version,
    
    // Repository Status
    repo_cloned: false,
    branch_created: false,
    
    // Directory Status
    dir1_created: false,
    dir2_created: false,
    dir3_created: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (rs)-[:TEMPLATE_FOR]->(setup)
RETURN setup;
```

### 2. Development Environment

```cypher
// Create Development Environment Template
CREATE (de:DevelopmentEnvironment {
    name: 'development_environment_template',
    version: '1.0',
    
    // Environment Components
    dependency_steps: ['install_dependencies', 'verify_installation'],
    config_files: ['.env', 'config.yaml'],
    database_type: 'neo4j',
    database_version: '5.x',
    services: ['neo4j', 'redis'],
    
    // Development Tools
    ide_name: 'VS Code',
    ide_extensions: ['Cypher', 'Python', 'Docker'],
    debugger_type: 'Python debugger',
    linters: ['pylint', 'mypy'],
    formatters: ['black', 'isort'],
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN de;

// Create Development Environment Instance
MATCH (de:DevelopmentEnvironment {name: 'development_environment_template'})
CREATE (env:DevelopmentEnvironmentInstance {
    name: 'current_environment',
    template_version: de.version,
    
    // Environment Status
    dependencies_installed: false,
    config_files_created: false,
    database_configured: false,
    services_running: false,
    
    // Tools Status
    ide_configured: false,
    extensions_installed: false,
    debugger_configured: false,
    linters_configured: false,
    formatters_configured: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (de)-[:TEMPLATE_FOR]->(env)
RETURN env;
```

## Verification

### 1. Environment Verification

```cypher
// Create Environment Verification Template
CREATE (ev:EnvironmentVerification {
    name: 'environment_verification_template',
    version: '1.0',
    
    // Verification Steps
    step1_description: 'Check Python installation',
    step1_command: 'python --version',
    
    step2_description: 'Check Git installation',
    step2_command: 'git --version',
    
    step3_description: 'Check Docker installation',
    step3_command: 'docker --version',
    
    step4_description: 'Check Neo4j connection',
    step4_command: 'neo4j status',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ev;

// Create Environment Verification Instance
MATCH (ev:EnvironmentVerification {name: 'environment_verification_template'})
CREATE (verification:EnvironmentVerificationInstance {
    name: 'current_verification',
    template_version: ev.version,
    
    // Verification Status
    step1_completed: false,
    step2_completed: false,
    step3_completed: false,
    step4_completed: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (ev)-[:TEMPLATE_FOR]->(verification)
RETURN verification;
```

## Additional Resources

- [Contributing Guide](./contributing.md)
- [Code Review Guide](./code-review.md)
- [Node Creation](../cypher/nodes.md)
- [Relationship Creation](../cypher/relationships.md)
- [Query Patterns](../cypher/queries.md) 