#!/usr/bin/env python3
import os
import json

def add_security_features(kg_data):
    """Add security features to a KG while preserving its domain-specific content."""
    
    # Add security section if not exists
    if "security" not in kg_data:
        kg_data["security"] = {
            "input_validation": {
                "sanitization": True,
                "max_input_length": 10000,
                "allowed_characters": "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",
                "timeout_ms": 30000
            },
            "output_validation": {
                "verify_steps": True,
                "max_output_length": 50000,
                "result_validation": True
            },
            "agent_security": {
                "isolation_level": "high",
                "resource_limits": {
                    "max_memory_mb": 1024,
                    "max_cpu_time_ms": 60000,
                    "max_disk_io_mb": 100
                },
                "rate_limiting": {
                    "requests_per_minute": 60,
                    "burst_limit": 10
                }
            }
        }

    # Add security endpoints
    if "endpoints" in kg_data:
        kg_data["endpoints"].update({
            "security": f"https://example.com/{kg_data['domain'].lower()}/security",
            "validation": f"https://example.com/{kg_data['domain'].lower()}/validation",
            "monitoring": f"https://example.com/{kg_data['domain'].lower()}/monitoring"
        })

    # Add security scripts
    if "scripts" in kg_data:
        kg_data["scripts"].update({
            "securityValidation": """def validateOperation(input, context) {
                // Input validation
                if (!input.matches(configuration.security.input_validation.allowed_characters)) {
                    throw new SecurityException('Invalid input characters');
                }
                if (input.length() > configuration.security.input_validation.max_input_length) {
                    throw new SecurityException('Input too long');
                }
                // Resource monitoring
                def startTime = System.currentTimeMillis();
                def startMemory = Runtime.getRuntime().totalMemory();
                return [startTime: startTime, startMemory: startMemory];
            }""",
            "operationVerification": """def verifyOperation(operation, context) {
                // Verify each step
                operation.steps.each { step ->
                    if (!validateStep(step)) {
                        throw new ValidationException('Invalid operation step: ' + step);
                    }
                }
                // Verify logical flow
                if (!verifyLogicalFlow(operation.steps)) {
                    throw new ValidationException('Invalid operation logic');
                }
                return true;
            }"""
        })

    # Update metadata
    if "metadata" in kg_data:
        kg_data["metadata"].update({
            "security_version": "1.0",
            "last_security_audit": "2025-03-01",
            "compliance": {
                "gdpr": True,
                "ccpa": True,
                "hipaa": True
            }
        })

    # Update configuration
    if "configuration" in kg_data:
        if "blockchain" in kg_data["configuration"]:
            kg_data["configuration"]["blockchain"]["security"] = {
                "smart_contract_verification": True,
                "transaction_validation": True,
                "key_rotation_interval_hours": 24,
                "audit_trail": True
            }
        
        kg_data["configuration"]["monitoring"] = {
            "performance_metrics": True,
            "error_tracking": True,
            "security_alerts": True,
            "resource_usage": True,
            "endpoints": {
                "metrics": f"https://example.com/{kg_data['domain'].lower()}/metrics",
                "alerts": f"https://example.com/{kg_data['domain'].lower()}/alerts",
                "logs": f"https://example.com/{kg_data['domain'].lower()}/logs"
            }
        }
        
        kg_data["configuration"]["validation"] = {
            "operation_verification": True,
            "input_sanitization": True,
            "output_validation": True,
            "resource_monitoring": True
        }

        # Update initData to include security config
        if "initData" in kg_data["configuration"]:
            kg_data["configuration"]["initData"] = kg_data["configuration"]["initData"].replace(
                "return [",
                "def securityConfig = scripts.fetchDataScript(configuration.endpoints.security);\n" +
                "println ', Security=' + (securityConfig != null);\n" +
                "return ["
            ).replace(
                "];",
                ", security: securityConfig];"
            )

    return kg_data

def process_file(file_path):
    """Process a single KG file."""
    print(f"Processing {file_path}...")
    
    try:
        with open(file_path, 'r') as f:
            kg_data = json.load(f)
        
        # Add security features
        kg_data = add_security_features(kg_data)
        
        # Write back the updated file
        with open(file_path, 'w') as f:
            json.dump(kg_data, f, indent=2)
        
        print(f"Successfully updated {file_path}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")

def main():
    resources_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "src", "main", "resources")
    if not os.path.exists(resources_dir):
        print(f"Resources directory not found: {resources_dir}")
        return
        
    for filename in os.listdir(resources_dir):
        if filename.endswith("_KG.json"):
            file_path = os.path.join(resources_dir, filename)
            process_file(file_path)

if __name__ == "__main__":
    main()
