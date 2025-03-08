#!/usr/bin/env python3
import os
import json

def fix_approval_criteria(obj):
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            if k == "approvalCriteria" and isinstance(v, dict):
                new_obj[k] = json.dumps(v)
            else:
                new_obj[k] = fix_approval_criteria(v)
        return new_obj
    elif isinstance(obj, list):
        return [fix_approval_criteria(item) for item in obj]
    else:
        return obj

def process_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Could not parse {file_path}: {e}")
        return False

    new_data = fix_approval_criteria(data)
    if new_data != data:
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(new_data, f, indent=2)
            print(f"Updated approvalCriteria in {file_path}")
            return True
        except Exception as e:
            print(f"Failed to write {file_path}: {e}")
            return False
    else:
        print(f"No update needed for {file_path}")
        return False


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
