<script lang="ts" setup>
import { ClickOutside as vClickOutside } from 'element-plus'
import { MenuItem } from './index.d'
const props = defineProps<{
  trigger?: HTMLElement
  menus: (MenuItem)[]
}>()
const emit = defineEmits<{
  (e: 'update:trigger', trigger: null): void
  (e: 'update:node', node: null): void
}>()

const popoverRef = ref()
const visible = computed(() => !!props.trigger)

const clickMenu = async (item: any) => {
  await item.fn()
  clickOutside()
}

const clickOutside = () => {
  emit('update:trigger', null)
  emit('update:node', null)
}
</script>

<template>
  <el-popover
    ref="popoverRef"
    :virtual-ref="props.trigger"
    :visible="visible"
    virtual-triggering
    popper-class="content-menu"
    placement="bottom-end"
  >
    <ul v-click-outside="clickOutside" class="flex flex-col">
      <li
        v-for="item in props.menus"
        :key="item.label"
        :class="{disabled: item.disabled, divider: item.topDivider}"
        @click="clickMenu(item)"
      >
        <el-icon class="mr-2"> <component :is="item.icon" /> </el-icon>
        <span> {{ item.label }} </span>
      </li>
    </ul>
  </el-popover>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
  li {
    @apply rounded cursor-pointer flex p-2 transition items-center relative;
    font-size: 14px;
    color: var(--el-text-color-regular);
    &:not(.disabled):hover {
      background-color: var(--el-fill-color);
      color: var(--el-color-primary);
    }
    &.disabled {
      @apply cursor-default;
      color: var(--el-text-color-disabled);
    }
    &.divider::after {
      @apply h-1px w-full top-0 left-0 absolute;
      background-color: var(--el-border-color);
      content: '';
    }
  }
}
</style>

<style lang="scss">
.content-menu {
  --el-popover-padding: 8px !important;
}
</style>
