.PHONY: help install dev build clean

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install frontend dependencies
	npm install

dev: ## Run the landing page locally
	npm run dev

build: ## Build the landing page for production
	npm run build

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules
	rm -rf dist
