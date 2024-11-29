# Chibi client
This is an experimental WIP fork of chibi-client, attempting to make it (relatively) easy to run custom/user-uploaded workflows.

> This work is super experimental, and started out as a quick hack to better suit my needs. There will be little, if any support, or response to issues etc., but I am keen to have a little side project so we'll see...

## Usage

### Installing as ComfyUI extension
- `git clone https://github.com/bedovyy/chibi-client` into the `custom_nodes` directory.
- open `<comfyui_url>/chibi`. It is normally `http://localhost:8188/chibi`

### Installing as Stable Diffusion web UI extension
- go to `Extensions > Install from URL` and input `https://github.com/bedovyy/chibi-client`.
- run web UI with `--api` option.
- open `<webui_url>/chibi`. It is normally `http://localhost:7860/chibi`.

### Using as standalone
- clone this repo, then run `npm run dev` or serve with any web server.

## Custom Workflows (WIP)
### How to
There's no particular recommend method, what I would do is:

1. Export workflow from ComfyUi (**Workflow > Export (API)**)
2. Create a new folder `workflows` in the root of this folder (same level as this README you're reading right now!)
3. Copy workflow JSON file to `workflows`
4. Replace each relevant node input value in the workflow JSON with the appropriate placeholder tag (see below)
5. You should see the workflow filename appear in the workflow dropdown (NOT YET IMPLEMENTED >=] )

### Placeholders
This list may not be 100% up-to-date. see `src/workflow/functions/mapUserInputToTemplateToken.js`

- `{{PROMPT_POS_TEXT}}`
- `{{PROMPT_NEG_TEXT}}`
- `{{SEED}}`
- `{{CHECKPOINT_BASE_NAME}}`
- `{{STEPS_BASE}}`
- `{{CFG_BASE}}`
- `{{SAMPLER_BASE_NAME}}`
- `{{SAMPLER_BASE_SCHEDULER}}`

## Features
- Very simple txt2img generation, or load in your own workflows!
- Responsive web page for mobile.
- Tagautocomplete for danbooru tags.
- Supporting PWA.