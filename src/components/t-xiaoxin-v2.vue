<template>
    <div class="t-ai-xiaoxin" :style="{'background':type=='dialog'?'none':''}" :class="{'t-ai-theme2':theme === 1}">
        <!-- 头像 -->
        <div v-if="type=='page'" style="width: 75px;display: flex;justify-content: space-between;padding: 50px 0;flex-direction: column;align-items: center;">
            <el-avatar style="border: 3px solid #fff;"  v-motion-roll-visible-bottom size="large" :src="aiUrl"  fit='contain' />
            <knowledge></knowledge>
        </div>
        <div :style="{margin:type=='page'?'20px 20px 20px 0':'20px','border-radius':type=='page'?'30px':'16px'}" style="background-color: #fff;display: flex;flex-grow: 1;flex-shrink: 1;overflow: hidden;">
            <!-- 侧栏 -->
            <div class="t-ai-saide-hide" v-if="type=='page'" :style="{left:isCollapse ? '75px' :'375px'}">
                <img src="@/images/left.png" 
                    v-if="!isCollapse"
                    @click="isCollapse = !isCollapse"
                style="height: 32px;top: calc(50% - 32px);right: -32px;" alt="">
                <img src="@/images/spread.png"
                    v-else 
                    @click="isCollapse = !isCollapse"
                style="height: 32px;top: calc(50% - 32px);right: -32px;" alt="">
            </div>
            <div class="t-ai-history" v-if="type=='page'" :style="{width:isCollapse ? '0px' :'300px'}">
              
                <div class="t-ai-add-button" v-if="!isCollapse"  @click="addOnce">
                    <span style="position: relative;top: -2px; font-size: 24px;margin-right: 10px;margin-left: 10px;">+</span>
                    <span>新建对话</span>
                </div>
                <div class="t-ai-lately">
                    <el-scrollbar height="100%" style="width: 100%"  >
                        <el-menu
                            style="width: 280px;margin-left: 10px"
                            :default-active="active" 
                            background-color="var(--t-ai-history-bg)"
                            text-color="var(--t-ai-lately-text-color)"
                            active-text-color="var(--t-ai-text-color)"

                        >
                            <sidebarItem 
                                @click-itme="clickItem"
                                @click-del="delHistory"
                                v-for="(item, index) in historyData" :key="index" :item="item">
                            </sidebarItem>
                        </el-menu>
                    </el-scrollbar>
                    <div class="t-ai-collect" v-if="!hideCollect">
                        <img src="@/images/collect_bg.png" style="width: 302px;" alt="">
                        <img src="@/images/close.png" @click="hideCollect = !hideCollect" style="cursor: pointer; width: 30px; position: absolute;right: 15px; top:13px;z-index:101" alt="">
                        <img src="@/images/button.png" @click="openCollect" style="cursor: pointer;width: 115px; position: absolute;right: 167px; top:53px;z-index:167" alt="">
                    </div>
                </div>

            </div>
            <!-- 正体 -->
            <div class="t-ai-body">
                <div class="t-ai-body-header" :style="{'justify-content':type=='dialog'?'space-between':'center'}" v-if="dialogueList.length > 0 ">
                    <h2 style="margin-right: 10px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 700px;">
                        {{ current.title }}
                    </h2>
                    <div>
                        <!-- 切换全屏 -->
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            content="全屏"
                            placement="top"
                            v-if="type == 'dialog'"
                        >
                            <el-icon  @click="fullScreen" class="t-ai-icon-button" style="margin-right: 10px; " ><FullScreen /></el-icon> 
                        </el-tooltip>
                        <!-- 关闭 -->
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            content="关闭"
                            placement="top"
                            v-if="type == 'dialog'"
                        >
                            <el-icon @click="close" class="t-ai-icon-button"><Close /></el-icon> 
                        </el-tooltip>
                    </div>
                </div>
                <div class="t-ai-body-content" v-if="dialogueList.length > 0">
                    
                    <el-scrollbar height="100%" @scroll="isShowSetLow" ref="scrollbarRef" width="100%" style="width: 100%;max-width: 950px;display: flex;justify-content: center;">
                        <div class="t-ai-dialgue" :style="{width:type=='page'?'950px':'100%'}">
                            <div style="height:10px;"></div>
                            <template v-for="(item,index) in dialogueList" :key="item">
                                <div class="t-ai-ai-dialogue" v-if="item.message.role == 'assistant'" >
                                    <el-avatar style="border: 3px solid #fff;position: absolute;left: -60px;"  size="large" :src="aiUrl"  fit='contain' />
                                    <div v-if="getThanks(item.message.content)" class="t-ai-think" style="margin-top: 15px;" @click="item.isOpenThink = !item.isOpenThink">
                                        
                                        
                                        <span>已深度思考(用时 {{ item.message.think_time }} 秒)</span>
                                        <el-icon style="margin-left: 10px;"> 
                                            <ArrowDownBold v-if="item.isOpenThink" />
                                            <ArrowRightBold v-else />
                                        </el-icon>
                                    </div>
                                    <div v-if="getThanks(item.message.content)" class="t-ai-think-content" :style="{height:item.isOpenThink ? 'auto':'0px',padding:item.isOpenThink ? '10px':'0px'}"> 
                                        <div v-html="getThanks(item.message.content)"></div>
                                    </div>
                                    <div class="t-ai-ai-message">
                                        <div v-html="render(item.message)"></div>
                                    </div>
                                    <div class="t-ai-receive_message" v-if="index == dialogueList.length-1 && !loading" >
                                        <template v-for="item in receiveMessageList" :key="item">
                                            <div class="t-ai-receive_message-item" @click="question = item;submit();">
                                                {{ item  }}
                                                <img src="@/images/right.png" style="width: 35px;margin-left: 10px;" alt="">
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="t-ai-user-dialogue" v-else-if="item.message.role == 'user'">
                                    <div class="t-ai-user-message" >
                                        <div style="min-height: 46px;display: flex;align-items: center;">
                                            <div  v-html="md.render(item.message.content)"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div class="t-ai-ai-dialogue" v-if="loading">
                                <img class="t-ai-ai-dialogue-logo" src="@/images/xiaoxin.png" alt="">
                                <div  class="t-ai-think">
                                    <el-icon type="primary" color="var(--t-ai-primary-color)" class="t-ai-loading">
                                        <Loading />
                                    </el-icon>
                                    <span>深度思考</span>
                                </div>
                                <div v-if="think" class="t-ai-think-content" :style="{height:isOpenThink ? 'auto':'0px',padding:isOpenThink ? '10px':'0px'}"> 
                                    <div v-html="think"></div>
                                </div>
                                <div class="t-ai-ai-message">
                                    <div v-html="render2(currentMessage)  "></div>
                                </div>
                                <div style="display: flex;align-items: center;margin-top: 10px; ">
                                    <el-icon type="primary" color="var(--t-ai-primary-color)" class="t-ai-loading">
                                        <Loading />
                                    </el-icon>
                                    思考中...
                                </div>
                                
                            </div>
                        </div>
                    </el-scrollbar>
                    <div v-if="setLow" @click="setLowClick" class="t-ai-set-low" :class="{'t-ai-set-low-loading':loading}">
                        <el-icon><ArrowDownBold /></el-icon>
                    </div>
                </div>
                <div class="t-ai-question" v-if="dialogueList.length > 0">
                    <div ref="dimensionRef1" v-if="!dimension" style="height:50px;width:100%;max-width:835px; display: flex;align-items: center;overflow: hidden;">
                        <div :style="{'max-width':dimensionRefMaxWidth||'830px'}" style="height:50px;width: auto;  display: flex;align-items: center;overflow: hidden;">
                            <template v-for="(item,index) in dimensionList">
                                <el-button  
                                    :ref="'dimensionItemRef' + index" 
                                    :style="{background:dimension && dimension.value == item.value ? 'linear-gradient(0deg, #897CF5, #5D81FB)':'',color:dimension && dimension.value == item.value ? '#fff':''}"  
                                    @click="dimension = item;"  round>{{ item.label }}</el-button>
                            </template>
                        </div>
                        <el-popover
                            placement="top-start"
                            :width="150"
                            trigger="click"
                            :offset="5"
                            v-if="moreDimensonList.length > 0"
                            :show-arrow="false"
                            
                        >
                            <div class="t-ai-more-dimension-list" >
                                <template v-for="item in moreDimensonList">
                                    <div class="t-ai-more-dimension-item "  @click="dimension = item;" >
                                        {{ item.label }}
                                    </div>
                                </template>
                            </div>
                            <template #reference>
                                <el-button  @click="" round> <el-icon><MoreFilled /></el-icon></el-button>
                            </template>
                        </el-popover>
                       
                    </div>
                    <div class="t-ai-input-box" :style="{'max-width':type=='page'?'890px':'835px'}">
                        <div v-if="dimension" style="margin-bottom: 10px; background-color:#b7bed3;width:100%;padding: 0 20px; border-top-left-radius: 28px; border-top-right-radius: 28px;height: 40px;align-items: center;display: flex;justify-content: space-between;">
                            <div style="font-size: 16px;font-weight: 600;">{{ dimension.label }}</div>
                            <div @click="dimension = null" class="t-ai-close-dimension">
                                <el-icon  style="cursor: pointer;"> <CloseBold></CloseBold>  </el-icon>
                            </div>
                        </div>
                        <div style="position: absolute;top: 0;left: 10px;width: calc(100% - 36px);height: 0;" >
                            <div style="
                                position: absolute;
                                border-radius: 8px;
                                bottom: 10px;left: 0;
                                width: 100%;
                                background-color: #fff;
                                box-shadow: var(--el-box-shadow);">
                                <template v-for="item in mentionList">
                                    <div class="t-ai-mention-item" @click="submitMention(item)">
                                        {{ item }}
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="t-ai-input" style="margin-left: 20px;top: -10px;" :style="{position:dimension?'relative':''}"  @input="input" @keyup.enter="submit"  contenteditable="true" >
                            {{ question }}
                        </div>
                        <span v-if="!question" :style="{top:dimension?'55px':'18px'}" style="font-size: 16px;pointer-events:none; color: var(--t-ai-placeholder-color);position: absolute;left: 20px;">深度分析设备健康状态 | 预警风险 | 执行脚本</span>
                        <div v-if="loading"   @click="stop"  style="cursor: pointer; height: 20px;position: relative; display: flex;justify-content: space-between;align-items: center;align-self: flex-end;margin-bottom: 10px;margin-right: 10px;">
                            <div class="t-ai-stop"  :class="{'t-ai-submit':question,'t-ai-submit-disabled':true}" >
                            </div>
                            <img src="@/images/stop.png" style="width: 43px;position: absolute;top: -21px;left: 1px" alt="">
                        </div>
                        
                        <div v-else style=" height: 20px;display: flex;justify-content: space-between;align-items: center;align-self: flex-end;margin-bottom: 10px;margin-right: 10px;">
                            <div :class="{'t-ai-submit':question,'t-ai-submit-disabled':!question}" @click="submit" >
                                <svg style="transform: scale(0.5);"  t="1741594707655" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1273" width="200" height="200"><path d="M851.437037 500.622222c-29.582222 29.582222-77.748148 29.582222-107.33037 0L587.851852 344.367407v499.484445c0 41.718519-34.133333 75.851852-75.851852 75.851852s-75.851852-34.133333-75.851852-75.851852V344.367407L279.893333 500.622222c-29.582222 29.582222-77.748148 29.582222-107.33037 0-29.582222-29.582222-29.582222-77.748148 0-107.33037l268.136296-268.136296c19.342222-19.342222 46.26963-24.651852 71.300741-18.583704 24.651852-6.068148 51.958519-0.758519 71.300741 18.583704l268.136296 268.136296c29.582222 29.582222 29.582222 77.748148 0 107.33037z" fill="#ffffff" p-id="1274"></path></svg>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="t-ai-add-dialogue" 
                    v-else
                    style="
                        flex-grow: 1;
                        flex-shrink: 1;
                        width: 100%;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        top: -80px;
                        ">
                        <div v-motion-slide-visible-right

                            style="
                            font-size: 32px;
                            font-weight: 400;
                            display: flex; 
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                
                            margin-bottom: 32px;"   
                        >
                           
                            <span>
                                我是 小新， 很高兴见到你！
                            </span>
                        </div>
                        <div class="t-ai-input-box-new" style="position: relative;">
                            <div v-if="dimension" style="background-color:#b7bed3; width:100%;padding: 0 20px; border-top-left-radius: 28px; border-top-right-radius: 28px;height: 40px;align-items: center;display: flex;justify-content: space-between;">
                                <div style="font-size: 16px;font-weight: 600;">{{ dimension.label }}</div>
                                <el-icon @click="dimension = null"> <CloseBold></CloseBold>  </el-icon>
                            </div>
                            <div style="position: absolute;top: 0;left: 10px;width: calc(100% - 36px);height: 0;" >
                                <div style="
                                    position: absolute;
                                    border-radius: 8px;
                                    bottom: 10px;left: 0;
                                    width: 100%;
                                    background-color: #fff;
                                    box-shadow: var(--el-box-shadow);">
                                    <template v-for="item in mentionList">
                                        <div class="t-ai-mention-item" @click="submitMention(item)">
                                            {{ item }}
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="t-ai-input"  @input="input" @keyup.enter="submit"  contenteditable="true" >
                                {{ question }}
                            </div>
                            <span v-if="!question" :style="{top:dimension?'55px':'15px'}" style="font-size: 16px;pointer-events:none; color: var(--t-ai-placeholder-color);position: absolute;left: 20px;"> 深度分析设备健康状态 | 预警风险 | 执行脚本</span>
                            <div style="height: 20px;display: flex;justify-content: space-between;align-items: center;align-self: flex-end;margin-bottom: 16px;">
                                <div :class="{'t-ai-submit':question,'t-ai-submit-disabled':!question}" @click="submit" >
                                    <svg style="transform: scale(0.5);"  t="1741594707655" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1273" width="200" height="200"><path d="M851.437037 500.622222c-29.582222 29.582222-77.748148 29.582222-107.33037 0L587.851852 344.367407v499.484445c0 41.718519-34.133333 75.851852-75.851852 75.851852s-75.851852-34.133333-75.851852-75.851852V344.367407L279.893333 500.622222c-29.582222 29.582222-77.748148 29.582222-107.33037 0-29.582222-29.582222-29.582222-77.748148 0-107.33037l268.136296-268.136296c19.342222-19.342222 46.26963-24.651852 71.300741-18.583704 24.651852-6.068148 51.958519-0.758519 71.300741 18.583704l268.136296 268.136296c29.582222 29.582222 29.582222 77.748148 0 107.33037z" fill="#ffffff" p-id="1274"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 10px; width:100%;max-width:835px;display: flex;align-items: center;">
                            <div :style="{'max-width':openDimension ? '835px' : dimensionRefMaxWidth || '835px','flex-wrap':openDimension?'wrap':'nowrap','justify-content':openDimension?'center':'flex-start'}" style="width: auto;display: flex;align-items: center;overflow: hidden;">
                                <template v-for="(item,index) in dimensionList">
                                    <el-button  
                                        style="margin-bottom: 10px;"
                                        :ref="'dimensionItemRef' + index" 
                                        :style="{background:dimension && dimension.value == item.value ? 'linear-gradient(0deg, #897CF5, #5D81FB)':'',color:dimension && dimension.value == item.value ? '#fff':''}"  
                                        @click="dimension = item;"  round>{{ item.label }}</el-button>
                                </template>
                            </div>
                            <el-button style="margin-top: -10px;" v-if="moreDimensonList.length > 0 && !openDimension " @click="openDimension = !openDimension" round> <el-icon><MoreFilled /></el-icon></el-button>
                        </div>
                </div>
                
            </div>
        </div>
        <el-dialog 
            v-model="dialogOverflowVisible"
            width="1000"
            title="意见收集"
        
        >
            <el-form :model="form" ref="formRef" label-width="auto" style="max-width: 1000px">
                <!-- 满意度 -->
                <el-form-item label="请选择您的满意度" prop="satisfaction" :rules="[{ required: true, message: '请选择您的满意度', trigger: 'blur' }]">
                    <el-radio-group v-model="form.satisfaction">
                        <el-radio label="1">非常满意</el-radio>
                        <el-radio label="2">满意</el-radio>
                        <el-radio label="3">一般</el-radio>
                        <el-radio label="4">不满意</el-radio>
                        <el-radio label="5">非常不满意</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 意见 -->
                <el-form-item label="请输入您的意见">
                    <el-input v-model="form.opinion" type="textarea" rows="5" placeholder="请输入您的意见"></el-input>
                </el-form-item>
                <!-- 联系方式 -->
                <el-form-item label="联系方式">
                    <el-input v-model="form.contact"   placeholder="请输入您的联系方式"></el-input>
                </el-form-item>
                <!-- 提交 -->
                <div style="display: flex;justify-content: center;width: 100%;">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import knowledge from './knowledge/index.vue';


import sidebarItem from './sidebar-item.vue';
import { ElIcon,ElScrollbar,ElMenu,ElAvatar,ElDialog,ElForm,ElFormItem,ElRadio,ElRadioGroup,ElInput,ElButton,ElPopover,ElTooltip } from 'element-plus';
// 导入ElIcon ElScrollbar样式
import 'element-plus/es/components/icon/style/css';
import 'element-plus/es/components/scrollbar/style/css';
import 'element-plus/es/components/menu/style/css';
import 'element-plus/es/components/avatar/style/css';
import 'element-plus/es/components/dialog/style/css';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/radio/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/popover/style/css';
import 'element-plus/es/components/tooltip/style/css';

import { Top,Refresh,CopyDocument,Loading,ArrowDownBold,ArrowRight,ArrowDown,ArrowRightBold,CloseBold,MoreFilled,FullScreen,Close } from '@element-plus/icons-vue';
import 'highlight.js/styles/foundation.css';

// 通常的默认值们
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs'; // 代码高亮插件
import markdownItMultimdTable from 'markdown-it-multimd-table';
const aiUrl = new URL(`@/images/xiaoxin.png`, import.meta.url).href
export default {
    name: 't-xiaoxin',
    components: {
        knowledge,
        ElIcon,ElScrollbar,ElMenu,ElAvatar,ElDialog,ElForm,ElFormItem,ElRadio,ElRadioGroup,ElInput,ElButton,ElPopover,
        ElTooltip,MoreFilled, FullScreen,Close,
        sidebarItem,Top,Refresh,CopyDocument,Loading,ArrowDownBold,ArrowRight,ArrowDown,ArrowRightBold,CloseBold
    },
    props: {
        userinfo: {
            type: Object,
            default: () => {
                return {
                    name: '小新'
                }
            } 
        },
        // 发送问题
        onSend: {
            type: Function,
            default: () => {
                return () => {}
            } 
        },
        // 意见收集
        onCollect: {
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // 新建对话
        onNew: {
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // 停止回答
        onStop: {
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // // 历史对话数据  左侧栏中的历史对话
        // historyData: {
        //     type: Array,
        //     default: () => {
        //         return []
        //     }
        // },
        // 点击历史对话 左侧栏中的历史对话 对应切换到相应对话组里面
        onHistory: {
            type: Function,
            default: () => {
                return () => {}
            } 
        },
        onRefresh: {
            type: Function,
            default: () => {
                return () => {}
            } 
        },
        onDelHistory: {
            type: Function,
            default: () => {
                return () => {}
            } 
        },
        // 主题
        theme: {
            type: Number,
            default: 1
        },
        // 页面加载完毕
        onload: {
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // 提及
        onMention:{
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // 全屏
        onFullScreen: {
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // 关闭
        onClose: {
            type: Function,
            default: () => {
                return () => {}
            } 
        },
        // 模式 弹窗模式 还是 页面模式 dialog | page
        model: {
            type: String,
            default: 'page'
        },
        container: {
            type: [Object, String,Number,Boolean,Array,Function,Symbol,],
        }
    },
    watch: { 
        // 监听维度List长度变化
        dimensionList(newVal, oldVal) {
            // 计算多少个维度标签会超出盒子的宽度
            const box = this.$refs.box;
        },
        scrollbarRef(val){
            this.historyData = val;
        },
        'current.id'(val){
            this.active = val;
        },
        model(val){
            this.type = val;   
        },
        'dialogueList.length'(val){
            console.log(this.dialogueList)
            this.$nextTick(()=>{
                setTimeout(()=>{
                    this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrapRef.scrollHeight - this.$refs.scrollbarRef.wrapRef.clientHeight);
                    this.isShowSetLow();
                })
            })
            
        }
    },
    emits: ['onload'],
    data() {
        const md = new MarkdownIt();
            md.use(markdownItHighlightjs,{
                auto:true,
            });
            md.use(markdownItMultimdTable,{
                multiline:  true,
                rowspan:    true,
                headerless: true,
                multibody:  true,
                autolabel:  true,
            });
        return {
            md,
            aiUrl,
            type: 'page',
            isOpenThink:true,
            hideCollect:false,
            form:{},
            dialogOverflowVisible:false,
            receiveMessageList: [],
            historyData:[],
            mentionList:[],
            dimension:null,
            moreDimensonList:[],
            dimensionList:[],
            currentMessage: '',
            loading: false,
            active: '',
            isCollapse:false,
            // 当前对话
            current: {},
            question:'',
            dialogueList:[
                {
                    "model": "xiaoxin-test:latest",
                    "created_at": "2025-02-12T11:41:42.458709388Z",
                    "message": {
                        "role": "assistant",
                        "content": " <think>解决方案\n嗯，今天用户提到华三的Switch S1850-52P交换机发生了链路状态Down的告警，具体是GigabitEthernet1/0/4端口的问题。首先，我需要分析可能的原因和解决方案。\n\n首先，考虑物理连接是否正常。光纤或网线是否松动？我记得之前处理过类似问题，有时候插头没插好会导致链路中断，所以检查一下接口是否有稳固的连接是必要的。\n\n接下来是对端设备的情况，用户提到对端设备未知，MAC地址是CC:96:E5:1C:3A:CE。这可能意味着该设备从未连接到这个交换机上，或者配置有误。我应该建议用户检查对端设备是否正确连接，同时查看VLAN和端口的配置是否一致，避免因为配置错误导致通信问题。\n\n另外，光纤或网线的质量也是一个因素。如果使用的是光纤，尤其是多模光纤，可能需要检查是否有损坏或者弯曲过度的情况，影响信号传输。如果是网线，可以测试一下线缆是否完好，特别是第1和第2对，因为它们通常用于数据传输。\n\n还有，交换机的软件版本也很重要。有时候固件或软件的问题也会导致端口异常。建议用户更新到最新版本的软件，并检查是否有相关的补丁需要安装，以确保系统稳定运行。\n\n最后，如果以上步骤都尝试过了问题仍未解决，可能需要联系技术支持团队进行进一步排查。毕竟内部资源有限，专业人员可能会有更深入的诊断工具和方法。\n\n总的来说，我会分步骤指导用户从物理连接、配置设置、设备状态到软件版本逐一排查，确保问题能够被彻底解决。\n</think>\n\n解决方案：\n\n1. **检查物理连接**  \n   - 确认交换机上的GigabitEthernet1/0/4端口是否正确连接。如果光纤或网线松动，请重新插拔以确保稳固连接。\n   \n2. **验证对端设备状态**  \n   - 检查对端设备（MAC地址CC:96:E5:1C:3A:CE）是否已正确连接到该端口，确认其电源和网络状态正常。\n   \n3. **检查光纤或网线质量**  \n   - 若使用的是多模光纤，确保光纤没有损坏、弯曲过度或连接错误。如果问题依旧，尝试更换光纤或网线进行测试。\n\n4. **排查配置设置**  \n   - 确认交换机和对端设备的VLAN、IP地址及端口配置是否一致，确保数据通路正常。\n   \n5. **更新软件版本**  \n   - 检查并更新华三交换机到最新软件版本，安装所有可用补丁以修复潜在问题。\n\n <div class='t-ai-charts'></div> \n\n 6. **联系技术支持团队**  \n   - 如果上述步骤无法解决问题，建议联系华三的技术支持团队进行进一步诊断和处理。"
                    },
                    "done_reason": "stop",
                    "done": true,
                    "total_duration": 129272693489,
                    "load_duration": 38077200,
                    "prompt_eval_count": 95,
                    "prompt_eval_duration": 210000000,
                    "eval_count": 614,
                    "eval_duration": 129021000000
                },
            ],
            // 置底按钮
            setLow: false,
            timer: null,
            dimensionRefMaxWidth:null,
            dimensionRefMaxWidth:null,
            openDimension:false,

        }
    },
    created(){
        let json = JSON.stringify({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
                {
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
                }
            ]
        })
        this.dialogueList[0].message.content = this.dialogueList[0].message.content.replace('<charts></charts>',`<charts>${json}</charts>` )
        this.type = this.model;
    },
    mounted(){
        if(this.onload)this.onload();
        this.$nextTick(()=>{
            this.test2();
        })
    },
    methods: {
        test2(){
            // 单个标签宽度
            let currentWidth = 0;
            let dimensionRefMaxWidth = 0;
            this.dimensionList.forEach((ele,index)=>{
                currentWidth += 12 + this.$refs['dimensionItemRef' + index][0].$el.offsetWidth;
                if(currentWidth > 835 - 12 - 46){
                    this.moreDimensonList.push(ele);
                }else{
                    dimensionRefMaxWidth = currentWidth;
                }
            })
            this.dimensionRefMaxWidth = (dimensionRefMaxWidth - 3) + 'px';
        },
        // 全屏
        fullScreen(){
            this.onFullScreen(this.current); 
        },
        // 关闭
        close(){
            this.onClose();
        },
        setTingModel(type){
            this.type = type;
            if(type == 'dialog'){
                if(this.container){
                    this.container.style.width = '1020px';
                }else{
                    this.container.style.width = '100vw';
                }   
            }
        },
        // 删除历史记录
        delHistory(item,child){
            this.onDelHistory(child,()=>{
                item.children = item.child.filter(ele=>{
                    if(ele.id != child.id){
                        return ele;
                    }
                })
                if(this.current.id == child.id){
                    this.current = {};
                    this.dialogueList = []; 
                }
                this.$forceUpdate();
            });
        },
        render2(item,tag='think'){
            this.think = this.getThanks(item);
            let str = '';
            // 先找到第一个<think>标签
            const start = item.indexOf(`<${tag}>`);
            if(start == -1){
                str = item;
            }else{
                const end = item.indexOf(`</${tag}>`);
                if(end == -1){
                    str = '';
                }else{
                    str = item.substring(end + 9,item.length);
                }
            }
            return this.md.render(str)
        },
        // 解析thanks标签
        render(item){
            console.log(121)
            this.getCharts(item.content)

            let str = ''
            if(typeof item == 'string'){
                this.think = this.getThanks(item);
                console.log(this.think)
                // str = item.replace(this.think,'')
                return this.md.render(item)
            }else{
                
                item.think = this.getThanks(item.content);
                str = item.content.replace(this.think,'')
                // 先找到第一个<think>标签
                let start = item.content.indexOf('<think>');
                if(start == -1){
                    str = item.content;
                }else{
                    let end = item.content.indexOf('</think>');
                    if(end == -1){
                        str = '';
                    }else{
                        str = item.content.substring(end + 9,item.content.length);
                    }
                }
                // 找到charts标签
                start = item.content.indexOf('<charts>');
                if(start == -1){
                    str = item.content;
                }else{
                    let end = item.content.indexOf('</charts>');
                    if(end == -1){
                        str = '';
                    }else{
                        str = item.content.substring(0,end) + item.content.substring(end + 8,item.content.length);
                    }
                }
                return this.md.render(str)
                // return item.think
            }
            
        },
        // 获取charts标签
        getCharts(item){
            let str = '';
            // 先找到第一个<charts>标签
            const start = item.indexOf('<charts>');
            if(start == -1){
                str =  ''
            }else{
                const end = item.indexOf('</charts>');
                if(end == -1){
                    // 利用当前时间戳当唯一id
                    let id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                    str = `<div id="${id}">加载中....</div>`;

                }else{
                    str = item.substring(start + 8,end);
                    let obj = JSON.parse(str)
                    console.log(obj)
                    // console.log(new Object(str))
                }
            }
            // console.log(str) 
        },
        // 获取thanks标签
        getThanks(item){
            let str = '';
            // 先找到第一个<think>标签
            const start = item.indexOf('<think>');
            if(start == -1){
                str =  ''
            }else{
                const end = item.indexOf('</think>');
                if(end == -1){
                    str = item 
                }else{
                    str = item.substring(start + 7,end)
                }
            }
            str =  str.replace(/\n/g, '<br />');
            return str.replace(/\n/g, `<span style="margin:0 20px;" ><span/>`);
        },
        // 点击去收集意见
        openCollect(){
            this.dialogOverflowVisible = true;
        },
        // 意见收集提交
        submitForm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.dialogOverflowVisible = false;
                    this.onCollect(this.form);
                    this.form = {};
                } else {
                    return false;
                }
            });
        },
        // 设置维度集合
        setDimensionList(list){
            this.dimensionList = list;
        },
        // 设计维度
        setDimension(item){
            this.dimension = item;
        },
        // 设置推荐
        setRecommend(item){
            this.receiveMessageList = item;
        },
        // 判断是否显示置底按钮
        isShowSetLow(){
            // 获取盒子的高度
            let boxHeight = this.$refs.scrollbarRef.wrapRef.scrollHeight;
            const scrollTop = this.$refs.scrollbarRef.wrapRef.scrollTop;
            if(scrollTop + this.$refs.scrollbarRef.wrapRef.clientHeight >= boxHeight - 5){
                this.setLow = false;
            }else{
                this.setLow = true;
            }
        },
        // 置底
        setLowClick(){
            this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrapRef.scrollHeight - this.$refs.scrollbarRef.wrapRef.clientHeight);
        },
        // 重新回答
        refresh(){
            this.loading = true;
            this.currentMessage = '';
            this.question = this.dialogueList[this.dialogueList.length - 2].message.content;
            this.currentMessage = '';
            this.onRefresh({...this.current,question:this.question} ,()=>{
                this.loading = false;
                this.question = '';
            })
            this.question = '';
        },
        initOption(option){
            this.theme == option.theme
        },
        pikUp() {
            this.isCollapse = !this.isCollapse;
            
        },
        clickItem(item) {
            this.current = item;
            this.onHistory(this.current);
        },
        // 提及
        mention(){
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(()=>{
                if(!this.question){
                    this.mentionList = [];
                    return
                }
                this.onMention(this.question,(data)=>{
                    this.mentionList = data;
                })
                this.timer = null;
            },250)
        },
        input(val){
            this.question = val.target.innerText;
            this.mention()
        },
        // 停止
        stop(){
            this.loading = false;
            console.log(this.$refs.scrollbarRef)
            if(!this.currentMessage){
                this.currentMessage =  '服务器繁忙，请稍后重试！'
            }
            this.dialogueList.push({
                message: {
                    role: 'assistant',
                    content: this.currentMessage
                }, 
            })
            this.onStop();
        },
        // 新增一个对话
        addOnce(){
            this.dialogueList.length = 0;
            this.current = {};
            this.question = '';
            this.loading = false;
        },
        // 提交提及
        submitMention(item){
            this.question = item;
            
            this.submit();
        },
        // 用户提出问题
        submit(){
            if(!this.question){
                return
            }
            this.loading = true;
            this.currentMessage = '';
            this.dialogueList.push({
                message: {
                    role: 'user',
                    content: this.question
                },
                created_at: new Date()
            })
            this.mentionList = [];
            console.log('提交了', this.dialogueList)
            this.onSend({...this.current,question:this.question,dimension:this.dimension} ,()=>{
                this.loading = false;
                this.question = '';
            })
            this.question = '';
        },
        toggleTheme() {
            this.theme = !this.theme;
        },
        // 设置当前对话
        setDialogueList(list){
           
            this.setDialogueList = list
        },
        // 添加一条ai回答断句
        addOnceShortMessage(item){
            if(!item.done){
                this.currentMessage += item.message;
            }else{
                if(!this.currentMessage){
                    this.currentMessage =  '服务器繁忙，请稍后重试！'
                }
                this.dialogueList.push({
                    message: {
                        role: 'assistant',
                        content: this.currentMessage,
                        think_time: item.think_time,
                    }, 
                })
                this.think = '';
                this.loading = false;
            }
            setTimeout(()=>{
                this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrapRef.scrollHeight - this.$refs.scrollbarRef.wrapRef.clientHeight);
                this.isShowSetLow();
            })
        },
        // 添加一条ai回答
        addOnceDialogue(item){
            this.dialogueList.push(item);
            this.question = '';
        },
        // 重置历史记录
        resetDialogueList(list){
            this.dialogueList.length = 0;
            list.forEach(element => {
                this.dialogueList.push(element)
            });
        },
        // 重置历史记录
        setHistoryData(list,current = {}){
            this.current = current;
            this.active = current.id;
            this.historyData.length = 0;
            list.forEach(element => {
                this.historyData.push(element)
            });
        },
        // 获取当前组件数据
        getData(key){
            if(key){
                return this[key]
            }else{
                return this; 
            }
        }
    },
   

}
</script>
<style scoped lang="scss">

.t-ai-xiaoxin {
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 16px;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,SF Pro SC,SF Pro Display,SF Pro Icons,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    background: linear-gradient(45deg, #897CF5, #5D81FB, #FAFDFF);
    box-shadow: 0px 0px 40px 0px rgba(18,82,179,0.18);
    
}
.t-ai-saide-hide{
        position: fixed;
        height: calc(100% - 60px);
        top: 58px;
        left: 375px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 32px;
        z-index: 1000;
        padding-right: 20px;
        img{
            display: none;
            cursor: pointer;
        }
        z-index: 100;
    }
    .t-ai-saide-hide:hover img{
        display: flex;
    }
.t-ai-history{
    width: 300px;
    height: 100%;
    background-color: var(--t-ai-history-bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.5s ;
    position: relative;
    
    .t-ai-history-header{
        height: 40px;
        display: flex;
        padding: 10px 10px 0 16px;
        justify-content: space-between;
        align-items: center;
    }
    .t-ai-add-button{
        align-items: center;
        background: rgba(0, 87, 255, 0.06);
        border: 0.5px solid rgba(0,102,255,0.1);
        border: 0.5px solid var(--s-color-brand-primary_transparent_3,rgba(0,102,255,.15));
        color: var(--s-color-brand-primary-default,rgb(0, 87, 255));
        cursor: pointer;
        display: inline-flex;
        border-radius: 20px;
        height: 40px;
        margin: 40px 15px 40px;
        &:hover{
            background-color: var(--t-ai-history-hover-bg);
        }
    }
    .t-ai-lately{
        margin: 0;
        flex-shrink: 1;
        flex-grow: 1;
        overflow-y: auto;
        margin-bottom: 10px;
        position: relative;
        overflow: hidden;
        .t-ai-collect{
            position: absolute;
            bottom: -15px;
            left: 0px;
        }
        // border: 1px solid #f00;
    }
}
@keyframes rotate {
    0% {
    transform: rotate(0deg);
    }
    100% {
    transform: rotate(360deg);
    }
}
.t-ai-stop{
    border: 2px solid var(--t-ai-primary-color);
    box-sizing: border-box;
    border-top-color: transparent;
    animation: rotate 1s linear infinite;
}
.t-ai-body{
    flex-grow: 1;
    height: 100%;
    flex-shrink: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    .t-ai-body-header{
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        width: calc(100% - 40px);
        // box-shadow: var(--el-box-shadow-lighter);
        background-color: var(--t-ai-history-bg);
    }
    .t-ai-body-content{
        width: 100%;
        flex-grow: 1;
        height: 200px;
        flex-shrink: 1;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        position: relative;
        .t-ai-set-low{
            position: absolute;
            bottom: 0;
            left: calc(50%  - 20px);
            width: 40px;
            height: 40px;
            background-color: #fff;
            color: var(--t-ai-primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--t-ai-line-color);
            box-shadow: var(--el-box-shadow-lighter);
            cursor: pointer;
            &:hover{
                background-color: var(--t-ai-primary-color);
                color: #fff;
            }

        }
        .t-ai-set-low-loading::before {
            content: "";
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border: 1px solid var(--t-ai-primary-color);
            border-radius: 50%;
            border-top-color: transparent;
            animation: rotate 1s linear infinite;
        }
        .t-ai-dialgue{
            max-width: 1020px;
            min-width: 700px;

            display: flex;
            flex-direction: column;
            .t-ai-ai-dialogue{
                align-self: flex-start;
                margin-bottom: 30px;
                display: flex;
                flex-direction: column;
                position: relative;
                margin: 0 60px;
                padding-top: 0px;
                .t-ai-ai-dialogue-logo{
                    height: 40px;
                    border-radius: 50%;
                    position: absolute;
                    left: -60px;
                    top: 0px;
                }
                .t-ai-ai-message{
                    padding: 8px 16px;
                    border-radius: 20px;
                }
                .t-ai-ai-other{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-top: 10px;
                    font-size: 12px;
                    color: var(--t-ai-text-color);
                    font-size: 14px;
                    font-weight: 600;
                }
            }
            .t-ai-user-dialogue{
                align-self: flex-end;
                margin-bottom: 30px;
                position: relative;
                margin: 0 60px;
                margin-bottom: 10px;
                .t-ai-user-dialogue-logo{
                    height: 40px;
                    border-radius: 50%;
                    position: absolute;
                    right: -50px;
                    top: 0px;
                }
                .t-ai-user-message{
                    padding: 0px 16px;
                    background-color: #DEE7FB;
                    border-radius: 12px;
                    // line-height: 46px;
                }
                .t-ai-user-other{
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-top: 5px;
                    font-size: 12px;
                    color: var(--t-ai-text-color);
                    font-size: 14px;
                    font-weight: 600;
                }
                
            }
        }
    }
    .t-ai-question{
        width: 100%;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        background-color: #fff;
        flex-direction: column;
        .t-ai-input-box{
            // max-width: 890px; 
            width: 100%;
            border: 1px solid var(--t-ai-line-color);
            background-color: #F4F5F9;
            border-radius: 28px;
            min-height: 58px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            position: relative;
            // padding:0 20px;

            
            .t-ai-submit{
                cursor: pointer;
                height: 45px;
                width: 45px;
                border-radius: 50%;
                background: linear-gradient(0deg, #897CF5, #5D81FB);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .t-ai-submit-disabled{
                cursor: pointer;
                height: 45px;
                width: 45px;
                border-radius: 50%;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #d8d9dd;
                // background-color: var(--t-ai-line-color);
            }
            .t-ai-input{
                min-height: 30px;
                max-height: 500px;
                overflow-y: auto;
                font-size: 16px;
                line-height: 30px;
                width: 100px;
                max-width: 100%;
                flex-shrink: 1;
                flex-grow: 1;
                margin: 10px 0;
                border: none;
            }
            .t-ai-input:focus{
                outline: none;
            }
            .t-ai-input:focus-visible {
                outline: none;
            }
        }
    }
}
// 渐变动画
@keyframes gradient {
    0% {
        background: linear-gradient(0deg, rgb(137, 124, 245), rgb(93, 129, 251));
    }
 
    100% {
        background: linear-gradient(360deg, rgb(137, 124, 245), rgb(93, 129, 251));
    }
}
.t-ai-input-box-new{
    width: 795px; 
    border: 1px solid var(--t-ai-line-color);
    border-radius: 28px;
    min-height: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:0 20px;
    background-color: #F4F5F9;
    .t-ai-submit-disabled{
        cursor: pointer;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(200,200,200);
    }
    .t-ai-submit{
        cursor: pointer;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        background: linear-gradient(0deg, #897CF5, #5D81FB);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .t-ai-submit:hover{
        // 添加渐变动画
        animation: gradient 1s linear  infinite;    
    }
    .t-ai-input{
        min-height: 120px;
        font-size: 16px;
        line-height: 30px;
        width: 100px;
        flex-shrink: 1;
        flex-grow: 1;
        margin: 10px 0;
        width: 100%;
    }
    .t-ai-input:focus{
        outline: none;
    }
    .t-ai-input:focus-visible {
        outline: none;
    }
}
</style>
<style lang="scss">
@use '@/style.scss'; 
p{
    word-break: break-all;
}
.t-ai-lately .el-menu{
    border-right: none;
}
.t-ai-lately .el-sub-menu__title{
    border-radius: 20px;
    height: 40px;
    line-height: 40px;
}
.t-ai-lately .el-sub-menu__title:hover{
    background-color: var(--t-ai-history-hover-bg); 
}
.t-ai-lately .el-sub-menu .el-menu-item{
    border-radius: 20px;
    height: 40px;
    line-height: 40px;
    color: #5c687a;
}
.t-ai-lately .el-menu-item:hover{
    // background-color: var(--t-ai-history-hover-bg);
    background-color: #DEE7FB;
    color:#617CF9;
}
.t-ai-lately .el-menu-item.is-active{
    background-color: #DEE7FB;
    color:#617CF9;
}
.firstSub{
    border-top: 1px solid var(--t-ai-line-color);
    padding-top: 10px;
}
// 创建一个加载动画
@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.t-ai-loading{
    font-size: 20px;
    color:var(--t-ai-primary-color);
    animation: loading 1s infinite linear;
    margin-right: 10px
}
</style>