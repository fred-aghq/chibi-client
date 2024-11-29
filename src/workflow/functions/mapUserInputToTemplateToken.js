export function mapUserInputToTemplateToken(userInput) {
  return {
    "{{PROMPT_POS_TEXT}}": userInput.prompt.trim(),
    "{{PROMPT_NEG_TEXT}}": userInput.negative_prompt.trim(),
    "{{CHECKPOINT_BASE_NAME}}": userInput.checkpoint,
    "{{SEED}}": Number(userInput.seed),
    "{{BASE_IMG_WIDTH}}": Number(userInput.width),
    "{{BASE_IMG_HEIGHT}}": Number(userInput.height),
    "{{STEPS_BASE}}": Number(userInput.steps),
    "{{CFG_BASE}}": Number(userInput.cfg_scale),
    "{{SAMPLER_BASE_NAME}}": userInput.sampler_name,
    "{{SAMPLER_BASE_SCHEDULER}}": userInput.scheduler
  };
};
