#!/bin/bash

IFS=' ';

total=0

top_level=(countlines.sh styles.css README.md)

for file in "${top_level[@]}"; do
    read -ra wcarr <<< `wc "$file"`
    lines="${wcarr[0]}"
    total=$((total+lines))
    echo $lines $file
done


dir="src"

read -ra files <<< `echo $dir/*.ts`
for file in "${files[@]}"; do
    read -ra wcarr <<< `wc "$file"`
    lines="${wcarr[0]}"
    total=$((total+lines))
    echo $lines $file
done

file="$dir/html.d.ts"
read -ra wcarr <<< `wc "$file"`
lines="${wcarr[0]}"
total=$((total-lines))
echo $lines $file

file="$dir/index.html"
read -ra wcarr <<< `wc "$file"`
lines="${wcarr[0]}"
total=$((total+lines))
echo $lines $file


dir="src/app"

read -ra files <<< `echo $dir/*component.?[^e]*`
for file in "${files[@]}"; do
    read -ra wcarr <<< `wc "$file"`
    lines="${wcarr[0]}"
    total=$((total+lines))
    echo $lines $file
done

read -ra files <<< `echo $dir/*/*component.?[^e]*`
for file in "${files[@]}"; do
    read -ra wcarr <<< `wc "$file"`
    lines="${wcarr[0]}"
    total=$((total+lines))
    echo $lines $file
done

printf "\033[38;2;255;82;197m%b\033[39m\033[49m\n" $total
