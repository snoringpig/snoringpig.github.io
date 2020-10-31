#!/bin/bash

read output

output_txt="${output}.txt"
rm -f $output_txt

for j in {1..4};
do
	output_j_txt="${output}$j.txt"
	rm -f $output_j_txt
	echo "- id: col_$j" >> $output_j_txt
	echo "  images:" >> $output_j_txt
done

i=0
for f in $(pwd)/assets/img/*
do
	if [ -f "$f" ]; then
    echo "  - name: $(basename $f)" >> "${output}$((1+$i%4)).txt"
    ((i+=1))
  fi
done

echo "cols:" >> $output_txt
for j in {1..4};
do
	output_j_txt="${output}$j.txt"
	cat $output_j_txt >> $output_txt
	rm -f $output_j_txt
done