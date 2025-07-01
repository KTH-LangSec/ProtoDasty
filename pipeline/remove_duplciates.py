#!/usr/bin/env python3

import sys

def remove_duplicates(input_file, output_file=None):
    """
    Remove duplicate package names from a file.
    
    Args:
        input_file: Path to input file with package names
        output_file: Path to output file (optional, defaults to input_file)
    """
    try:
        # Read all lines and strip whitespace
        with open(input_file, 'r') as f:
            lines = [line.strip() for line in f.readlines()]
        
        # Remove duplicates while preserving order
        seen = set()
        unique_lines = []
        for line in lines:
            if line and line not in seen:  # Skip empty lines
                seen.add(line)
                unique_lines.append(line)
        
        # Write back to file
        output_path = output_file or input_file
        with open(output_path, 'w') as f:
            f.write('\n'.join(unique_lines) + '\n')
        
        print(f"Removed {len(lines) - len(unique_lines)} duplicate packages")
        print(f"Result saved to: {output_path}")
        
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python remove_duplicates.py <input_file> [output_file]")
        print("Example: python remove_duplicates.py packages.txt")
        print("Example: python remove_duplicates.py packages.txt clean_packages.txt")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    remove_duplicates(input_file, output_file)
