
test:
	@./support/expresso/bin/expresso \
		-I support/connect/lib \
		-I support/ejs \
		-I support \
		-I lib \
		--serial

.PHONY: test