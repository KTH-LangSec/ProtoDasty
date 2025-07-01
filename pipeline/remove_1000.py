#!/usr/bin/env python3

import sys

def check_packages(check_file, reference_file, output_file=None):
    """
    Check if packages from check_file exist in reference_file.
    
    Args:
        check_file: File containing packages to check
        reference_file: File containing reference packages
        output_file: Optional file to save results
    """
    try:
        # Read reference packages into a set for fast lookup
        with open(reference_file, 'r') as f:
            reference_packages = {line.strip() for line in f if line.strip()}
        
        # Read packages to check
        with open(check_file, 'r') as f:
            check_packages = [line.strip() for line in f if line.strip()]
        
        # Check each package
        found = []
        missing = []
        
        for package in check_packages:
            if package in reference_packages:
                found.append(package)
            else:
                missing.append(package)
        
        # Prepare results
        results = []
        results.append(f"Package Check Results:")
        results.append(f"Checking: {check_file}")
        results.append(f"Against: {reference_file}")
        results.append(f"")
        results.append(f"Total packages checked: {len(check_packages)}")
        results.append(f"Found: {len(found)}")
        results.append(f"Missing: {len(missing)}")
        results.append(f"")
        
        if found:
            results.append(f"✓ FOUND PACKAGES ({len(found)}):")
            for package in found:
                results.append(f"  ✓ {package}")
            results.append("")
        
        if missing:
            results.append(f"✗ MISSING PACKAGES ({len(missing)}):")
            for package in missing:
                results.append(f"  ✗ {package}")
            results.append("")
        
        # Output results
        output_text = '\n'.join(results)
        
        if output_file:
            with open(output_file, 'w') as f:
                f.write(output_text)
            print(f"Results saved to: {output_file}")
        else:
            print(output_text)
        
        # Return summary for exit code
        return len(missing) == 0
        
    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

def check_packages_interactive(check_file, reference_file):
    """Interactive version that shows status for each package as it's checked."""
    try:
        # Read reference packages
        with open(reference_file, 'r') as f:
            reference_packages = {line.strip() for line in f if line.strip()}
        
        # Read and check packages one by one
        with open(check_file, 'r') as f:
            check_packages = [line.strip() for line in f if line.strip()]
        
        print(f"Checking {len(check_packages)} packages...")
        print(f"Reference file has {len(reference_packages)} packages")
        print("-" * 50)
        
        found_count = 0
        for i, package in enumerate(check_packages, 1):
            status = "✓" if package in reference_packages else "✗"
            if package in reference_packages:
                found_count += 1
            print(f"{i:3d}. {status} {package}")
        
        print("-" * 50)
        print(f"Summary: {found_count}/{len(check_packages)} packages found")
        
    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python check_packages.py <packages_to_check> <reference_file> [output_file]")
        print("       python check_packages.py <packages_to_check> <reference_file> --interactive")
        print("")
        print("Examples:")
        print("  python check_packages.py my_packages.txt all_packages.txt")
        print("  python check_packages.py my_packages.txt all_packages.txt results.txt")
        print("  python check_packages.py my_packages.txt all_packages.txt --interactive")
        sys.exit(1)
    
    check_file = sys.argv[1]
    reference_file = sys.argv[2]
    
    if len(sys.argv) > 3 and sys.argv[3] == "--interactive":
        check_packages_interactive(check_file, reference_file)
    else:
        output_file = sys.argv[3] if len(sys.argv) > 3 else None
        all_found = check_packages(check_file, reference_file, output_file)
        
        # Exit with appropriate code
        sys.exit(0 if all_found else 1)
