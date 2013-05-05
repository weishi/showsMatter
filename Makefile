
all: packing 

packing:
	git archive -o showsMatter.zip HEAD

clean:
	rm showsMatter.zip

