clean:
	echo "Cleaning"
	rm index.html
	rm script.js
	rm style.css

build:
	echo "Building"
	cd ./src; \
	rm _index.html; \
	python3 compile.py; \
	cd ..

merge_in_pages:
	echo "Copying files..."
	cp ./src/_index.html index.html
	cp ./src/script.js script.js
	cp ./src/style.css style.css

	echo "Merging in gh-pages"
	git checkout gh-pages    
	git merge --no-commit --no-ff master
	git reset -- Makefile
	git reset -- README.md
	git reset -- src
	git reset -- patterns
	git commit

runserver:
	python3 -m http.server

local:
	clean build runserver

pages:
	clean build merge_in_pages

