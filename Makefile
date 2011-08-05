
test:
	@./node_modules/.bin/expresso
		-I support/connect/lib \
		-I support/ejs \
		-I support \
		-I lib \
		--serial

.PHONY: test