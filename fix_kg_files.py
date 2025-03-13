#!/usr/bin/env python3
import json
import os
import glob

def flatten_dict(d, parent_key='', sep='_'):
    """Flatten a nested dictionary by concatenating keys with underscore."""
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def fix_kg_file(file_path):
    """Fix a KG JSON file by flattening nested objects."""
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Flatten endpoints
    if 'endpoints' in data:
        endpoints = data.pop('endpoints')
        for key, value in endpoints.items():
            data[f'endpoint_{key}'] = value
    
    # Flatten training examples
    if 'trainingExamples' in data:
        examples = []
        for i, example in enumerate(data['trainingExamples']):
            examples.append({
                'input': example['input'],
                'expected_output': example['expectedOutput'],
                'description': example.get('description', '')
            })
        data['training_examples'] = examples
        del data['trainingExamples']
    
    # Flatten evaluation examples
    if 'evaluationExamples' in data:
        examples = []
        for i, example in enumerate(data['evaluationExamples']):
            examples.append({
                'input': example['input'],
                'expected_output': example['expectedOutput'],
                'description': example.get('description', '')
            })
        data['evaluation_examples'] = examples
        del data['evaluationExamples']
    
    # Flatten final exam examples
    if 'finalExamExamples' in data:
        examples = []
        for i, example in enumerate(data['finalExamExamples']):
            examples.append({
                'input': example['input'],
                'expected_output': example['expectedOutput'],
                'description': example.get('description', '')
            })
        data['final_exam_examples'] = examples
        del data['finalExamExamples']
    
    # Flatten agents
    if 'agents' in data:
        agents = []
        for agent in data['agents']:
            flat_agent = {}
            for key, value in agent.items():
                if key == 'approvalCriteria' and isinstance(value, str):
                    try:
                        criteria = json.loads(value)
                        flat_agent['effectiveness_threshold'] = criteria.get('effectivenessThreshold', '0.95')
                        flat_agent['ethics_guidelines'] = criteria.get('ethicsGuidelines', '')
                    except json.JSONDecodeError:
                        flat_agent[key] = value
                elif isinstance(value, dict):
                    flattened = flatten_dict(value)
                    for k, v in flattened.items():
                        flat_agent[f"{key}_{k}"] = v
                else:
                    flat_agent[key] = value
            agents.append(flat_agent)
        data['agents'] = agents
    
    # Write back the fixed data
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Fixed {file_path}")

def main():
    # Get all KG JSON files
    kg_files = glob.glob('safeAI-plugin/target/classes/*_KG.json')
    
    # Fix each file
    for file_path in kg_files:
        fix_kg_file(file_path)

if __name__ == '__main__':
    main() 