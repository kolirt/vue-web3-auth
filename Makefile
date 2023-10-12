dev:
	yarn dev-demo
format:
	yarn format
check:
	yarn type-check-lib && yarn lint
build:
	yarn build-lib && yarn build-demo
build-demo:
	yarn build-demo
build-lib:
	yarn build-lib
preview:
	yarn preview-demo
