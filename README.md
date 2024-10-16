# BACKEND

Hosting your own Retrieval-Augmented Generation (RAG) application locally.
Retrieval-Augmented Generation (RAG) is an advanced technique that combines the strengths of information retrieval and text generation to create more accurate and contextually relevant responses.
RAG is a hybrid model that enhances the capabilities of language models by incorporating an external knowledge base or document store. 

## Ollama setup

1. Install Ollama
https://ollama.com/library

2. Install your model
```sh
  ollama pull llama3.2
```

3. Run ollama
```sh
  ollama serve
  ollama run llama3.2

  /bye
```
Note : sometimes you need to quit the ollama application and run it again to make it work

3. Test ollama
```sh
  linux :
  curl http://localhost:11434/api/generate -d '{"model": "llama3.2", "prompt": "Tell me a joke", "stream": false}'

  windows :
  curl "http://localhost:11434/api/generate" -H "Content-Type: application/json" -d "{\"model\": \"llama3.2\", \"prompt\": \"Tell me a joke\", \"stream\": false}"
```
## Python setup

1. Install python with pyenv

2. Create a virtual environment
```sh
  python3 -m venv .venv

  command linux : source .venv/bin/activate
  command prompt : .venv\Scripts\activate
  command powershell : .venv\Scripts\Activate.ps1

  code app.py
  python3 app.py

  deactivate
```
Command prompt should now be prefixed with the name of your virtual environment '.venv'

3. Install packages in the virtual environment
```sh
  pip3 install langchain_community
```

# FRONTEND
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
