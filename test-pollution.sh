#!/bin/bash

# Variables for printing pretty graphics
WIDTH=37
COUNTER=0
FRESH=false
TOTAL_TESTS=0
COMPLETED_TESTS=0

display_usage() {
  echo "Usage: $0 <directory>"
  exit 1
}

# Parse Arguments
if [[ "$1" == "-fresh" ]]; then
  FRESH=true
  shift
fi

if [[ -z "$1" ]]; then
  echo "Error: no directory provided."
  display_usage
fi

# Root directory
ROOT_DIR="$1"

if [[ $FRESH == true ]]; then
  for subdir in "$ROOT_DIR"/*/; do
    [ -d "$subdir" ] && rm -f "$subdir"/output.log
  done
fi

# Count total number of tests
TOTAL_TESTS=192

# Function to display a progress bar
draw_progress_bar() {
  local width=40
  local percent=$((COMPLETED_TESTS * 100 / TOTAL_TESTS))
  local completed=$((COMPLETED_TESTS * width / TOTAL_TESTS))
  local remaining=$((width - completed))

  printf "\r["
  printf "%0.s#" $(seq 1 "$completed")
  printf "%0.s-" $(seq 1 "$remaining")
  printf "] %d%% (%d/%d) - detected: %d\n" "$percent" "$COMPLETED_TESTS" "$TOTAL_TESTS" "$COUNTER"
}

# Function to traverse directories and execute commands
traverse_and_execute() {
  local dir="$1"

  # Skip node_modules directory
  if [[ "$dir" == *node_modules* ]]; then
    return
  fi

  # Find the .test.js file in the current directory
  local test_file
  test_file=$(find "$dir" -maxdepth 1 -type f -name "*.test.js" | head -n 1)

  # If a .test.js file exists, run the commands
  if [ -n "$test_file" ]; then
    local test_name
    local test_name_size
    test_name=$(basename "$test_file" .test.js) # Extract test name without extension
    test_name_size=$(((WIDTH - ${#test_name}) / 2))
    local output_file="${dir}output.log"
    local counted=false

    echo "-------------------------------------"
    printf "%*s%s%*s\n" "$test_name_size" "" "$test_name" "$test_name_size" ""
    echo "-------------------------------------"
    echo "Running tests in: $dir"

    if grep -q "Found Prototype Pollution" "$output_file"; then
      echo -e "\e[33mFile Already Analyzed with Prototype Pollution\e[0m"
      ((COMPLETED_TESTS++))
      ((COUNTER++))
      draw_progress_bar
      return
    fi

    # Change to the directory
    (
      cd "$dir" &&
        echo "  1 -> Installing dependencies..." &&
        npm install &>/dev/null &&
        echo "  2 -> Running tests..." &&
        CMD="node /home/mateus/Dasty/pipeline/index.js --forceProcess --onlyPollution --execFile $dir$test_name.test.js $test_name &> $output_file" &&
        eval "$CMD"
    )

    echo "Output saved to: $output_file"

    # Check if the output file contains "Found Prototype Pollution"
    if grep -q "Found Prototype Pollution" "$output_file"; then
      echo -e "\e[32m   ✅  Prototype Pollution detected in $test_name successfully.\e[0m"
      counted=true
    else
      echo -e "\e[31m   ⚠️   No Prototype Pollution found in $test_name.\e[0m"
    fi

    if [ "$counted" = true ]; then
      ((COUNTER++))
    fi

    if [ "$counted" = false ]; then
      echo "$test_name" >>log.txt
    fi
    # Increment completed tests and update progress bar
    ((COMPLETED_TESTS++))
    draw_progress_bar
    printf "\n\n"
  fi

  # Iterate over subdirectories
  for subdir in "$dir"/*/; do
    [ -d "$subdir" ] && traverse_and_execute "$subdir"
  done
}

# Start traversal
rm /home/mateus/log.txt
clear
tput civis # Hide cursor
traverse_and_execute "$ROOT_DIR"
tput cnorm # Show cursor

printf "\nPrototype Pollution Found: %d\n" "$COUNTER"
