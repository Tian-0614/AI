<template>
    <div style="cursor: pointer;">
        <el-icon @click="openDialog" style="color: #2e4fab;font-size: 30px;">
            <Setting />
        </el-icon>
        <el-dialog title="上传知识库" v-model="dialogVisible" width="50%">
                   
            <div class="modal-body">
                <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput"
                    :class="{ 'has-file': uploadedFile }">
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect"
                        accept=".txt,.csv,.xlsx" />

                    <div v-if="!uploadedFile" class="upload-placeholder">
                        <i class="fas fa-cloud-upload-alt text-4xl mb-4 text-gray-400"></i>
                        <p class="text-gray-600">点击或拖拽文件到此处上传</p>
                        <p class="text-gray-400 text-sm mt-2">支持 .txt、.csv、.xlsx 格式，文件大小不超过 10MB</p>
                    </div>

                    <div v-else class="uploaded-file">
                        <i class="fas fa-file-alt text-xl text-blue-500 mr-2"></i>
                        <span class="file-name">{{ uploadedFile.name }}</span>
                        <button class="delete-btn" @click.stop="removeFile">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">分割字符</label>
                    <div class="input-wrapper">
                        <input type="text" v-model="formData.separator" class="form-input"
                            placeholder="请输入分割字符" />
                        <i class="fas fa-question-circle help-icon" @mouseenter="showTooltip = true"
                            @mouseleave="showTooltip = false"></i>
                    </div>
                    <div class="help-text">常用分隔符：逗号(,) 分号(;) 竖线(|) 制表符(\t)</div>
                    <div v-if="errors.separator" class="error-text">{{ errors.separator }}</div>
                </div>

                <div class="form-group">
                    <label class="required">维度设置</label>
                    <div class="dimension-selector" @click="toggleDimensionDropdown">
                        <div class="selected-dimensions">
                            <span v-if="formData.dimensions.length === 0">请选择维度</span>
                            <div v-else class="dimension-tags">
                                <span v-for="dim in formData.dimensions" :key="dim" class="dimension-tag">
                                    {{ dim }}
                                    <i class="fas fa-times" @click.stop="removeDimension(dim)"></i>
                                </span>
                            </div>
                        </div>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div v-if="showDimensionDropdown" class="dimension-dropdown">
                        <div v-for="dim in availableDimensions" :key="dim" class="dimension-option"
                            @click="toggleDimension(dim)"
                            :class="{ 'selected': formData.dimensions.includes(dim) }">
                            {{ dim }}
                        </div>
                    </div>
                    <div v-if="errors.dimensions" class="error-text">{{ errors.dimensions }}</div>
                </div>

                <div class="form-group">
                    <label>文件编码</label>
                    <select v-model="formData.encoding" class="form-select">
                        <option value="UTF-8">UTF-8</option>
                        <option value="GBK">GBK</option>
                        <option value="ASCII">ASCII</option>
                    </select>
                </div>
            </div>

            <div class="modal-footer">
                <el-button type="primary" @click="closeModal">取消</el-button>
                <el-button  type="primary" @click="handleSubmit" :disabled="isSubmitting">
                    <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                    {{ isSubmitting ? '提交中...' : '确认' }}
                </el-button>
            </div>

        </el-dialog>

    </div>
</template>
<script setup lang="ts">
import { ref, toRefs, defineProps,reactive } from "vue";
import { Setting } from '@element-plus/icons-vue';
import { ElDialog,ElIcon,ElButton } from 'element-plus';
const props = defineProps({
    item: {
        type: Object,
        default: {}
    },

})
const { item } = toRefs(props);
const dialogVisible = ref(false);
const openDialog = () => {
    dialogVisible.value = true;
    console.log(item.value)
}

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFile = ref<File | null>(null);
const showTooltip = ref(false);
const showDimensionDropdown = ref(false);
const isSubmitting = ref(false);

const formData = reactive({
  separator: ',',
  dimensions: [] as string[],
  encoding: 'UTF-8',
  hasHeader: true
});

const errors = reactive({
  separator: '',
  dimensions: ''
});

const availableDimensions = [
  '时间维度',
  '地理维度',
  '产品维度',
  '用户维度',
  '行为维度',
  '交易维度'
];

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    validateAndSetFile(input.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    validateAndSetFile(files[0]);
  }
};

const validateAndSetFile = (file: File) => {
  const validTypes = ['.txt', '.csv', '.xlsx'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.some(type => file.name.toLowerCase().endsWith(type))) {
    alert('请上传正确的文件格式');
    return;
  }

  if (file.size > maxSize) {
    alert('文件大小不能超过10MB');
    return;
  }

  uploadedFile.value = file;
};

const removeFile = () => {
  uploadedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const toggleDimensionDropdown = () => {
  showDimensionDropdown.value = !showDimensionDropdown.value;
};

const toggleDimension = (dimension: string) => {
  const index = formData.dimensions.indexOf(dimension);
  if (index === -1) {
    formData.dimensions.push(dimension);
  } else {
    formData.dimensions.splice(index, 1);
  }
};

const removeDimension = (dimension: string) => {
  const index = formData.dimensions.indexOf(dimension);
  if (index !== -1) {
    formData.dimensions.splice(index, 1);
  }
};

const validateForm = (): boolean => {
  let isValid = true;
  errors.separator = '';
  errors.dimensions = '';

  if (!formData.separator) {
    errors.separator = '请输入分割字符';
    isValid = false;
  }

  if (formData.dimensions.length === 0) {
    errors.dimensions = '请至少选择一个维度';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  if (!uploadedFile.value) {
    alert('请上传文件');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('file', uploadedFile.value);
    formDataToSubmit.append('separator', formData.separator);
    formDataToSubmit.append('dimensions', JSON.stringify(formData.dimensions));
    formDataToSubmit.append('encoding', formData.encoding);
    formDataToSubmit.append('hasHeader', String(formData.hasHeader));

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('上传成功！');
    closeModal();
  } catch (error) {
    alert('上传失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  // 这里可以触发关闭弹窗的事件
  console.log('关闭弹窗');
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  color: #6b7280;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #60a5fa;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.file-name {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  color: #ef4444;
}

.form-group {
  margin-top: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.help-icon {
  margin-left: 8px;
  color: #6b7280;
  cursor: help;
}

.help-text {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.dimension-selector {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dimension-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dimension-tag {
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dimension-dropdown {
  position: absolute;
  width: calc(100% - 48px);
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dimension-option {
  padding: 8px 12px;
  cursor: pointer;
}

.dimension-option:hover {
  background: #f3f4f6;
}

.dimension-option.selected {
  background: #eff6ff;
  color: #3b82f6;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background-color: #3b82f6;
}

input:checked + .toggle-label:before {
  transform: translateX(20px);
}

.modal-footer {
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content:center;
    align-items: center;
}
</style>

