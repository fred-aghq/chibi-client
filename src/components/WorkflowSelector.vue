<script setup>
import Dropdown from './Dropdown.vue';
import readWorkflowDirs from '../workflow/functions/readWorkflowDirs.js';
console.log(readWorkflowDirs());

</script>

<template>
    <div>
        <Dropdown v-bind="$attrs" 
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
            
        </Dropdown>
    </div>
</template>
