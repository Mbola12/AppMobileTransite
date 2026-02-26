<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
    options: {
        type: Array,
        required: true,
        default: () => [],
    },
    placeholder: {
        type: String,
        default: "Sélectionnez une option",
    },
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
    fieldConfig: {
        type: Object,
        default: () => ({
            label: "label",
            value: "value",
            search: "label",
        }),
    },
    allowClear: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "large",
        validator: (value) => ["small", "middle", "large"].includes(value),
    },
    filterOption: {
        type: Boolean,
        default: true,
    },
    border: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits([
    "update:modelValue",
    "search",
    "select",
    "change",
    // for compatibility with callers using @input="handler(index, $event)"
    "input",
]);

const displayValue = ref("");
const currentSearchText = ref("");

const normalizedOptions = computed(() =>
    props.options.map((option) => {
        if (typeof option === "object" && option !== null) {
            return {
                label: option[props.fieldConfig.label] ?? String(option),
                // AntD requires value for option; we use label to drive selection
                value: option[props.fieldConfig.label] ?? String(option),
                originalValue: option[props.fieldConfig.value] ?? option[props.fieldConfig.label] ?? String(option),
            };
        }
        return { label: String(option), value: String(option), originalValue: option };
    })
);

const filteredOptions = ref([...normalizedOptions.value]);

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue === null || newValue === undefined || newValue === "") {
            displayValue.value = "";
            return;
        }
        const selected = normalizedOptions.value.find(
            (opt) => opt.originalValue === newValue
        );
        displayValue.value = selected ? selected.label : "";
    },
    { immediate: true }
);

watch(
    () => props.options,
    () => {
        filteredOptions.value = [...normalizedOptions.value];
        // try to keep display in sync if model is set
        if (props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== "") {
            const selected = normalizedOptions.value.find(
                (opt) => opt.originalValue === props.modelValue
            );
            displayValue.value = selected ? selected.label : "";
        }
    },
    { deep: true }
);

const handleSearch = (value) => {
    displayValue.value = value;
    currentSearchText.value = value;

    // for remote fetch compatibility: emit DOM-like input event
    emit("input", { target: { value } });
    emit("search", value);

    if (!props.filterOption) return;

    filteredOptions.value =
        value.trim() === ""
            ? [...normalizedOptions.value]
            : normalizedOptions.value.filter((opt) =>
                  String(opt.label).toLowerCase().includes(value.toLowerCase())
              );
};

const handleSelect = (selectedValue) => {
    const selectedOption = normalizedOptions.value.find(
        (opt) => opt.value === selectedValue
    );
    if (selectedOption) {
        emit("update:modelValue", selectedOption.originalValue);
        displayValue.value = selectedOption.label;
        emit("select", { value: selectedOption.originalValue, option: selectedOption });
        emit("change", selectedOption.originalValue);
    }
    currentSearchText.value = "";
};

const handleClear = () => {
    displayValue.value = "";
    currentSearchText.value = "";
    emit("update:modelValue", null);
    emit("change", null);
};

const handleBlur = () => {
    const typed = displayValue.value?.trim() ?? "";
    if (typed === "") {
        handleClear();
        return;
    }
    const match = normalizedOptions.value.find(
        (opt) => String(opt.label).toLowerCase() === typed.toLowerCase()
    );
    if (match) {
        emit("update:modelValue", match.originalValue);
        displayValue.value = match.label;
        emit("change", match.originalValue);
    } else {
        handleClear();
    }
};
</script>

<template>
    <a-auto-complete
        v-model:value="displayValue"
        :options="filteredOptions"
        :placeholder="placeholder"
        :allow-clear="allowClear"
        :disabled="disabled"
        :size="size"
        :filter-option="false"
        @search="handleSearch"
        @select="handleSelect"
        @clear="handleClear"
        @blur="handleBlur"
        :class="border ? 'mmmmmmmmm' : 'select-autocomplete xxxxxxx'"
    >
        <template #option="{ label }">
            <div>{{ label }}</div>
        </template>
    </a-auto-complete>
</template>

<style scoped>
.ant-select-selector {
    border: none !important;
}
</style>


