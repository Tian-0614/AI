<template>
    <el-menu-item v-if="isShowByMenuType(item, 'item')" :index="item.id" :class="{collapse:true,isFirstMenuItem:item.parentId === '0' || !item.parentId}" @click="open(item)"
        :key="item.id">
        <template #title>
            <span class="menu-title">{{ getTitle(item) }}</span>
        </template>
    </el-menu-item>
    <el-sub-menu v-else-if="isShowByMenuType(item, 'sub-menu')"
        @click="openSubMenu(item)"
        :class="(item.parentId === '0' || !item.parentId) ? 'firstSub' : collapse ? 'firstSub2 collapse' : 'firstSub2'"
        :index="item.id" :key="item.id">
        <template #title>
            <img src="@/images/bubble.png" style="width: 20px;margin-right: 10px;" alt="">
            <span class="menu-title" style="font-weight: bold;font-size: 18px;">{{ getTitle(item) }}</span>
        </template>
        <template v-for="(child, cindex) in item.children" :key="child.id">
            <el-menu-item :index="child.id" class="collapse" @click="open(child)" v-if="isShowByMenuType(child, 'item')">
                <template #title>
                    <!-- <div v-if="!collapse" class="booth"></div> -->
                    <div class="t-ai-close">
                        <div class="menu-title">{{ getTitle(child) }}</div>
                        <div @click="del(item,child)" style="height: 100%;display: flex;align-items: center;"><el-icon class="t-ai-close-icon" size="16"><CircleClose /></el-icon></div>
                    </div>
                </template>
            </el-menu-item>
            <sidebar-item v-else :item="child" :collapse="collapse"></sidebar-item>
        </template>
    </el-sub-menu>
</template>
<script lang="ts" setup>
import { ChatDotSquare } from '@element-plus/icons-vue';
import sidebarItem from "./sidebar-item.vue";
import { defineProps, toRefs ,defineEmits } from "vue";
import { CircleClose ,InfoFilled } from '@element-plus/icons-vue';
import { ElSubMenu,ElMenuItem,ElIcon } from 'element-plus';
const emits = defineEmits(['click-itme','click-del']);
const props = defineProps({
    item: {
        type: Object,
        default: {}
    },
    collapse: {
        type: Boolean,
        default: false,
    }
})
const { item, collapse } = toRefs(props);

const findLeafNodes= (tree:any) => {
    let leafNodes: any[] = [];
    function recurse(nodes: any) {
        nodes.forEach((node:any) => {
            if (!node.children || node.children.length === 0) {
                leafNodes.push(node);
            } else {
                recurse(node.children);
            }
        });
    }
    recurse(tree);
    return leafNodes;
}
// 展示不同菜单类型
const isShowByMenuType = (item, type) => {
    let flag = false;
    switch (type) {
        case 'item':flag = !item.children; break;
        case 'sub-menu':flag = item.children; break;
    }
    return flag;
}
const del = (item,child)=>{
    emits('click-del',item,child)
}
// 点击菜单
const open = (item) => {

    emits('click-itme',item)
}
// 点击目录
const openSubMenu = (item)=>{
    if(item.isMenu){
       
    }
}

// 获取标题
const getTitle = (item) => {
    return item.title;
}

</script>
<style lang="scss">
.t-ai-close{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 280px;
    height: 100%;
    .menu-title{
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
        font-size: 16px;
    }
}
.t-ai-close-icon{
    cursor: pointer;
    // display: none !important;
    display: none !important;
    position: relative;
    left: 16px;
}
.t-ai-close:hover div>.t-ai-close-icon{
    color: #F56C6C !important;
    display: flex !important;
    
}
</style>
