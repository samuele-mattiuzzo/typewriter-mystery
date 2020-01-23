clean:
	echo "Cleanup"

pages:
	git checkout gh-pages    
	git merge --no-commit --no-ff master
	git reset -- Makefile
	git reset -- README.md
	git commit

runserver:
	python3 -m http.server