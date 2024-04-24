<script lang="ts" setup>
import { IConfig } from './index.d'
import { DEFAULT_CONFIG, TYPES, FILE_TYPES, SHORTCUTS } from './const'
const props = defineProps<{
  visible: boolean
  saveKey: string
}>()
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'submit', config: IConfig): void
}>()

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const config = useLocalStorage<IConfig>(props.saveKey, DEFAULT_CONFIG)

const sizeFormatter = (v: string) => {
  return (parseFloat(v) || 0) + ''
}

const submit = () => {
  emit('submit', config.value)
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="快速选择"
    width="600px"
    draggable
  >
    <el-form
      label-position="top"
      label-width="auto"
      :model="config"
    >
      <el-form-item>
        <template #label>
          <div class="label">
            <span>类型</span>
            <el-checkbox v-model="config.entryType.enable">启用</el-checkbox>
          </div>
        </template>
        <el-checkbox-group v-model="config.entryType.types" :disabled="!config.entryType.enable">
          <el-checkbox
            v-for="item in TYPES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="label">
            <span>文件大小</span>
            <el-checkbox v-model="config.fileSize.enable">启用</el-checkbox>
          </div>
        </template>
        <div class="size-range">
          <el-input
            v-model="config.fileSize.min"
            :disabled="!config.fileSize.enable"
            :formatter="sizeFormatter"
            placeholder="请输入最小值"
          >
            <template #append>M</template>
          </el-input>
          <span class="mx-4">至</span>
          <el-input
            v-model="config.fileSize.max"
            :disabled="!config.fileSize.enable"
            :formatter="sizeFormatter"
            placeholder="请输入最大值"
          >
            <template #append>M</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="label">
            <span>文件类型</span>
            <el-checkbox v-model="config.fileType.enable">启用</el-checkbox>
          </div>
        </template>
        <el-checkbox-group v-model="config.fileType.types" :disabled="!config.fileType.enable">
          <el-checkbox
            v-for="item in FILE_TYPES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="label">
            <span>更新时间</span>
            <el-checkbox v-model="config.mtime.enable">启用</el-checkbox>
          </div>
        </template>
        <el-date-picker
          v-model="config.mtime.range"
          :disabled="!config.mtime.enable"
          type="datetimerange"
          :shortcuts="SHORTCUTS"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">选择</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.label {
  @apply flex items-center justify-between;
  span {
    @apply font-bold;
    color: var(--el-text-color-regular);
  }
}
.size-range {
  @apply flex w-full items-center;
  :deep(input) {
    text-align: center;
  }
}
</style>
