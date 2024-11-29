import AController from "@/assets/acontroller";
import axios from "axios";
import { uuidv4 } from '@/assets/utils';
import { generateComfyObjects } from '@/assets/comfy-object-draft';
import workflowJson from '@/assets/workflows/sdbasic.json'; // @TODO: obviously build a workflow selector component
import { mapUserInputToTemplateToken } from "@/workflow/functions/mapUserInputToTemplateToken";

export default class ComfyUIController extends AController {
  // websocket
  clientId = null;
  websocket = null;
  timeoutWS = null;

  // comfy objects
  node = null;
  type = null;
  arrayType = null;
  comfyObjects = null;

  // generate state and related
  prompt_id = null;
  generationInfo = null; //TODO: use workflow later
  imageFormat = "webp";
  imageQuality = 70;

  static async checkUrl(url) {
    try {
      const res = await axios.get(`${url}/system_stats`, { timeout: 3000 });
      if (res.status == 200 && res.data["system"] != null) {
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  async getHistory(promptId) {
    return await axios.get(`${this.url}/history/${promptId}`);
  }

  async getheringImages(prompt_id) {
    const history = await this.getHistory(prompt_id);
    const outputs = history.data[prompt_id]?.outputs;
    if (outputs) {
      Object.values(outputs).forEach(outputNodes => {
        Object.values(outputNodes.images).forEach(async imageInfo => {
          this.listener("done", `${this.url}/view?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder}&type=${imageInfo.type}`, this.generationInfo);
          this.generationInfo = null;
          this.prompt_id = null;
        });
      });
    }
  }

  async messageListener(msg) {
    try {
      const json = JSON.parse(msg.data);
      console.debug(Date() + " ws : message", json);
      if (json.type == "status") {
        return;
      }
      const message = json.type.toUpperCase() + (json.data.node ? `: ${json.data.node.split('-')[0]}` : "") + (json.type == "progress" ? ` ${json.data.value} / ${json.data.max}` : "");
      const progress = json.type == "progress" ? Math.floor(Number(json.data.value) / Number(json.data.max) * 100) : 0;
      this.listener("running", message, progress);

      // clumsy ws hanging solution.
      if (this.timeoutWS) {
        this.timeoutWS = clearTimeout(this.timeoutWS);
      }

      if (json.data.node === null && json.data.prompt_id != null) {
        this.getheringImages(json.data.prompt_id);
      }
    } catch (e) { // maybe preview
      this.listener("preview", msg.data);
    }
  }

  async createWebSocket() {
    const urlForWebSocket = this.url.replaceAll('http', 'ws');
    this.websocket = new WebSocket(`${urlForWebSocket}/ws?clientId=${this.clientId}`);
    this.websocket.onmessage = this.messageListener.bind(this);
    this.websocket.onopen = (e) => {
      console.debug(Date() + " ws: open", e);
      if (this.prompt_id) {
        // collect missing image.
        this.getheringImages(this.prompt_id);
      }
    };
    this.websocket.onclose = (e) => {
      console.warning(Date() + " ws: closed", e);
      setTimeout(() => this.createWebSocket(), 1000);
    }
    this.websocket.onerror = (e) => {
      console.error(Date() + " ws: error", e);
      this.websocket.close(1002, "error occured");
    }
  }

  async prepare() {
    this.clientId = uuidv4();
    this.createWebSocket();

    const objectInfo = await axios.get(`${this.url}/object_info`);
    [this.node, this.type, this.arrayType] = generateComfyObjects(objectInfo.data);
    console.log(this.node, this.type, this.arrayType);
  }

  getCheckpoints() {
    return this.arrayType.CheckpointLoaderSimple.ckpt_name;
  }
  getVAEs() {
    return this.arrayType.VAELoader.vae_name;
  }
  getSamplers() {
    return this.arrayType.KSampler.sampler_name;
  }
  getSchedulers() {
    return this.arrayType.KSampler.scheduler;
  }

  setImageFormat(format, quality) {
    this.imageFormat = format;
    this.imageQuality = quality;
  }
  getImageFormat() {
    return [this.imageFormat, this.imageQuality];
  }


  async generate(info) {
    try {
      let preparedWorkflow = this.prepareWorkflow(workflowJson, info);
      console.debug(preparedWorkflow);

      const res = await axios.post(`${this.url}/prompt`, JSON.stringify({ prompt: preparedWorkflow, client_id: this.clientId }));
      this.prompt_id = res.data.prompt_id;
      this.generationInfo = info;

      // just in case ws hangs.
      this.timeoutWS = setTimeout(() => this.createWebSocket(), 1000);
    } catch (e) {
      this.listener("error", e);
    }
  }

  prepareWorkflow(workflowJson, userInput) {
    let preparedWorkflow = structuredClone(workflowJson);

    const mappedUserInput = mapUserInputToTemplateToken(userInput);

    // This is not the most efficient traversal/replace...
    Object.keys(mappedUserInput)
      .forEach(target => {
        this.replaceTemplatePlaceholder(preparedWorkflow, target, mappedUserInput[target]);
      });

    return preparedWorkflow;
  }

  replaceTemplatePlaceholder(workflow, target, replacement) {
    // Replace the target string
    return this.searchAndReplace(workflow, target, replacement);
  }

  searchAndReplace(obj, target, replacement) {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === target) {
            obj[key] = replacement; // Replace the value
          } else if (typeof obj[key] === 'object') {
            // Recursively process nested objects or arrays
            this.searchAndReplace(obj[key], target, replacement);
          }
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (item === target) {
          obj[index] = replacement;
        } else if (typeof item === 'object') {
          this.searchAndReplace(item, target, replacement);
        }
      });
    }
    return obj;
  }
}
