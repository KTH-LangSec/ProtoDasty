#!/bin/bash

# Package list splitter script
# Usage: ./split_packages.sh <input_file> [output_prefix]

# Check if input file is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <input_file> [output_prefix]"
  echo "Example: $0 packages.txt split_packages"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_PREFIX="${2:-packages_split}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file '$INPUT_FILE' not found."
  exit 1
fi

# Check if input file is readable
if [ ! -r "$INPUT_FILE" ]; then
  echo "Error: Cannot read input file '$INPUT_FILE'."
  exit 1
fi

# Count total lines (excluding empty lines)
TOTAL_LINES=$(grep -c '^[[:space:]]*[^[:space:]]' "$INPUT_FILE")

if [ $TOTAL_LINES -eq 0 ]; then
  echo "Error: Input file contains no valid package names."
  exit 1
fi

echo "Total packages found: $TOTAL_LINES"

# Calculate lines per file
LINES_PER_FILE=$((TOTAL_LINES / 4))
REMAINDER=$((TOTAL_LINES % 4))

echo "Base lines per file: $LINES_PER_FILE"
if [ $REMAINDER -ne 0 ]; then
  echo "Extra lines to distribute: $REMAINDER"
fi

# Create temporary file with non-empty lines only
TEMP_FILE=$(mktemp)
grep '^[[:space:]]*[^[:space:]]' "$INPUT_FILE" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' >"$TEMP_FILE"

# Split the file
CURRENT_LINE=1

for i in {1..4}; do
  OUTPUT_FILE="${OUTPUT_PREFIX}_${i}.txt"

  # Calculate how many lines this file should get
  if [ $i -le $REMAINDER ]; then
    CURRENT_FILE_LINES=$((LINES_PER_FILE + 1))
  else
    CURRENT_FILE_LINES=$LINES_PER_FILE
  fi

  # Extract lines for this file
  sed -n "${CURRENT_LINE},$((CURRENT_LINE + CURRENT_FILE_LINES - 1))p" "$TEMP_FILE" >"$OUTPUT_FILE"

  ACTUAL_LINES=$(wc -l <"$OUTPUT_FILE")
  echo "Created $OUTPUT_FILE with $ACTUAL_LINES packages"

  CURRENT_LINE=$((CURRENT_LINE + CURRENT_FILE_LINES))
done

# Clean up
rm "$TEMP_FILE"

echo "Package splitting complete!"
echo "Output files:"
for i in {1..4}; do
  OUTPUT_FILE="${OUTPUT_PREFIX}_${i}.txt"
  if [ -f "$OUTPUT_FILE" ]; then
    echo "  - $OUTPUT_FILE ($(wc -l <"$OUTPUT_FILE") packages)"
  fi
done
