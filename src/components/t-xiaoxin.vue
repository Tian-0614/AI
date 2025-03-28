<template>
    <div class="t-ai-xiaoxin" :class="{'t-ai-theme1':theme === 1}">
        <div class="t-ai-history" v-if="type=='page'" :style="{width:isCollapse ? '0px' :'300px'}">
            <div class="t-ai-history-header">
                <div style="display: flex;align-items: center;font-size: 18px;font-weight: 400;">
                    <el-avatar size="default" :src="aiUrl" fit='contain' />
                    <span style="margin-left: 10px;">AI 小新</span>
                </div>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="收起侧栏"
                    placement="right"
                >
                    <svg @click="pikUp" style="cursor: pointer;"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M21 5H11v14h10zM3 5h6v14H3zm0-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm2 4.25a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5zm-.75 3.5A.75.75 0 0 1 5 10h2a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75m.75 2a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5z" clip-rule="evenodd"></path></svg>
                </el-tooltip>
            </div>
            <div class="t-ai-add-button"  @click="addOnce">
                <span style="position: relative;top: -2px; font-size: 24px;margin-right: 10px;margin-left: 10px;">+</span>
                <span>新建对话</span>
            </div>
            <div class="t-ai-lately">
                <el-menu
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
            </div>
        </div>
        <!-- 正体 -->
        <div class="t-ai-body">
            <div class="t-ai-body-header" v-if="dialogueList.length > 0 ">
                <div>
                    <el-tooltip
                        v-if="isCollapse"
                        class="box-item"
                        effect="dark"
                        content="展开侧栏"
                        placement="right"
                    >
                        <svg @click="pikUp" style="cursor: pointer;margin-right: 20px;"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M21 5H11v14h10zM3 5h6v14H3zm0-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm2 4.25a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5zm-.75 3.5A.75.75 0 0 1 5 10h2a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75m.75 2a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5z" clip-rule="evenodd"></path></svg>
                    </el-tooltip>
                    <!-- 对话标题 -->
                    <span style="font-size: 18px;font-weight: 400;" v-motion-fade-visible>{{ current.title }}</span>
                </div>
                <div>
                    <!-- 切换全屏 -->
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="全屏"
                        placement="top"
                        v-if="type == 'dialog'"
                    >
                        <el-icon @click="fullScreen" class="t-ai-icon-button" style="margin-right: 10px; " ><FullScreen /></el-icon> 
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
                
                <el-scrollbar height="100%" @scroll="isShowSetLow" ref="scrollbarRef" width="100%" style="width: 100%;display: flex;justify-content: center;">
                    <div style="height: 20px;"></div>
                    <div class="t-ai-dialgue" :style="{width:type=='page'?'1020px':'100%'}">
                        <template v-for="(item,index) in dialogueList" :key="item">
                            <div class="t-ai-ai-dialogue" v-if="item.message.role == 'assistant'" >
                                <img class="t-ai-ai-dialogue-logo" src="@/images/ai.png" alt="">
                                <div v-if="getThanks(item.message.content)" class="t-ai-think" @click="item.isOpenThink = !item.isOpenThink">
                                    <span>已深度思考(用时 {{ item.message.think_time }} 秒)</span>
                                    <el-icon style="margin-left: 10px;"> 
                                        <ArrowDown v-if="item.isOpenThink" />
                                        <ArrowRight v-else />
                                    </el-icon>
                                </div>
                                <div v-if="getThanks(item.message.content)" class="t-ai-think-content" :style="{height:item.isOpenThink ? 'auto':'0px',padding:item.isOpenThink ? '10px':'0px'}"> 
                                    <div v-html="getThanks(item.message.content)">
                                    </div>
                                </div>
                                <div class="t-ai-ai-message">
                                
                                    <div v-html="render(item.message)"></div>
                                </div>
                                <div class="t-ai-ai-other">
                                    <!-- <span>{{dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')  }}</span> -->
                                    <!-- <el-tooltip
                                            class="box-item"
                                            effect="dark"
                                            content="复制"
                                            placement="top"
                                        >
                                        
                                        <el-icon size="20" style="cursor: pointer;color: var(--t-ai-placeholder-color);margin: 0 5px;"><CopyDocument /></el-icon>
                                    </el-tooltip> -->
                                    <el-tooltip
                                            v-if="dialogueList.length-1 == index"
                                            class="box-item"
                                            effect="dark"
                                            content="刷新"
                                            placement="top"
                                        >
                                        <el-icon @click="refresh" size="20px" style="cursor: pointer;font-size: 20px;color: var(--t-ai-placeholder-color);margin: 0 5px;"><Refresh /></el-icon>
                                    </el-tooltip>

                                </div>
                            </div>
                            <!-- 用户 -->
                            <div class="t-ai-user-dialogue" v-else-if="item.message.role == 'user'">
                                <img class="t-ai-user-dialogue-logo" src="@/images/user.png" alt="">
                                <div class="t-ai-user-message">
                                    <div v-html="md.render(item.message.content)"></div>
                                </div>
                            </div>
                        </template>
                        <!-- ai 正在输入 -->
                        <div class="t-ai-ai-dialogue" v-if="loading">
                            <img class="t-ai-ai-dialogue-logo" src="@/images/ai.png" alt="">
                            <div  class="t-ai-think">
                                <el-icon type="primary" color="var(--t-ai-primary-color)" class="t-ai-loading">
                                    <Loading />
                                </el-icon>
                                <span>深度思考</span>
                            </div>
                            <div v-if="think" class="t-ai-think-content" :style="{height:isOpenThink ? 'auto':'0px',padding:isOpenThink ? '10px':'0px'}"> 
                                <div v-html="think"></div>
                            </div>
                            <div class="t-ai-ai-message" >
                                <div v-html="render2(currentMessage)"></div>
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
                <div class="t-ai-input-box" style="position: relative;">
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
                    <span v-if="!question" style="font-size: 16px;pointer-events:none; color: var(--t-ai-placeholder-color);position: absolute;left: 20px;">请输入问题</span>
                </div>
                <el-button @click="stop" v-if="loading"  type="warning" style="margin-left: 10px;"  :icon="Top" >
                    停止
                </el-button>
                <el-button @click="submit" v-else :disabled='!question'  :type="question ?  'primary' : 'info'" style="margin-left: 10px;"  :icon="Top" >
                    发送
                </el-button>
                
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
                    ">
                    <h1 
                        v-motion-slide-visible-right
                        style="

                        font-size: 32px;
                        margin-bottom: 32px;"   
                    >您好 我是 AI 小新 ， 很高兴见到你！ </h1>
                    <div class="t-ai-input-box-new" style="position: relative;">
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
                        <span v-if="!question" style="font-size: 16px;pointer-events:none; color: var(--t-ai-placeholder-color);position: absolute;left: 20px;">请输入问题</span>
                        <div style="height: 40px;display: flex;justify-content: space-between;align-items: center;">
                            
                            <el-button @click="stop" v-if="loading"  type="warning" style="margin-left: 10px;"  :icon="Top" >
                                停止
                            </el-button>
                            <el-button @click="submit" :disabled='!question' v-else  :type="question ?  'primary' : 'info'" style="margin-left: 10px;"  :icon="Top" >
                                发送
                            </el-button>
                        </div>
                    </div>
            </div>
            
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs';
import sidebarItem from './sidebar-item.vue';

import { Top,Refresh,CopyDocument,Loading,ArrowDownBold,ArrowRight,ArrowDown,FullScreen,Close } from '@element-plus/icons-vue';
import 'highlight.js/styles/foundation.css';

// 通常的默认值们
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs'; // 代码高亮插件
import markdownItMultimdTable from 'markdown-it-multimd-table';
const aiUrl = new URL(`@/images/ai.png`, import.meta.url).href
export default {
    name: 't-xiaoxin',
    components: {
        sidebarItem,Top,Refresh,CopyDocument,Loading,ArrowDownBold,ArrowRight,ArrowDown,FullScreen,Close
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
   
    emits: ['onload'],
    data() {
        const md = new MarkdownIt();
            md.use(markdownItHighlightjs);
            md.use(markdownItMultimdTable,{
            multiline:  false,
            rowspan:    false,
            headerless: false,
            multibody:  true,
            autolabel:  true,
        });
        return {
            md,
            aiUrl,
            type: 'page',
            historyData:[
                {
                    title:'aaaa',
                    id:'1',
                    children:[
                        {
                            title:'aaaa',
                            id:'2', 
                        } 
                    ]
                }
            ],
            mentionList:[],
            currentMessage: '',
            loading: false,
            active: '',
            isCollapse:false,
            // 当前对话
            current: {},
            question:'',
            dialogueList:[
            // {"model":"xiaoxin-test","created_at":"2025-03-05T07:54:15.631752456Z","message":{"role":"assistant","content":"<think> 例如：Edge、Chromium、Blink、Gecko等。我需要你提供类似的中文名称。\n<\/think>\n\n当然可以！以下是一些常见的国产浏览器及其内核：\n\n1. **360浏览器** - 基于**Chromium**\n2. **搜狗浏览器** - 基于**Chromium**\n3. **QQ浏览器** - 基于**Blink**\n4. **UC浏览器** - 自主研发**U3引擎**（基于**Webkit**）\n5. **猎豹浏览器** - 基于**Chromium**\n6. **Opera浏览器**（中国版）- 基于**Blink**\n\n这些浏览器都采用主流的内核，如**Chromium**或**Blink**，以提供快速和稳定的浏览体验。"},"done_reason":"stop","done":true,"total_duration":113169377676,"load_duration":69441076131,"prompt_eval_count":37,"prompt_eval_duration":1127000000,"eval_count":172,"eval_duration":36300000000},
            
            // {
            //     "model": "xiaoxin-test:latest",
            //     "created_at": "2025-02-12T11:41:42.458709388Z",
            //     "message": {
            //             "role": "user",
            //         "content": " 12132"
            //     },
            // },
            //     {
            //         "model": "xiaoxin-test:latest",
            //         "created_at": "2025-02-12T11:41:42.458709388Z",
            //         "message": {
            //             "role": "assistant",
            //             "content": " <think>解决方案\n嗯，今天用户提到华三的Switch S1850-52P交换机发生了链路状态Down的告警，具体是GigabitEthernet1/0/4端口的问题。首先，我需要分析可能的原因和解决方案。\n\n首先，考虑物理连接是否正常。光纤或网线是否松动？我记得之前处理过类似问题，有时候插头没插好会导致链路中断，所以检查一下接口是否有稳固的连接是必要的。\n\n接下来是对端设备的情况，用户提到对端设备未知，MAC地址是CC:96:E5:1C:3A:CE。这可能意味着该设备从未连接到这个交换机上，或者配置有误。我应该建议用户检查对端设备是否正确连接，同时查看VLAN和端口的配置是否一致，避免因为配置错误导致通信问题。\n\n另外，光纤或网线的质量也是一个因素。如果使用的是光纤，尤其是多模光纤，可能需要检查是否有损坏或者弯曲过度的情况，影响信号传输。如果是网线，可以测试一下线缆是否完好，特别是第1和第2对，因为它们通常用于数据传输。\n\n还有，交换机的软件版本也很重要。有时候固件或软件的问题也会导致端口异常。建议用户更新到最新版本的软件，并检查是否有相关的补丁需要安装，以确保系统稳定运行。\n\n最后，如果以上步骤都尝试过了问题仍未解决，可能需要联系技术支持团队进行进一步排查。毕竟内部资源有限，专业人员可能会有更深入的诊断工具和方法。\n\n总的来说，我会分步骤指导用户从物理连接、配置设置、设备状态到软件版本逐一排查，确保问题能够被彻底解决。\n</think>\n\n解决方案：\n\n1. **检查物理连接**  \n   - 确认交换机上的GigabitEthernet1/0/4端口是否正确连接。如果光纤或网线松动，请重新插拔以确保稳固连接。\n   \n2. **验证对端设备状态**  \n   - 检查对端设备（MAC地址CC:96:E5:1C:3A:CE）是否已正确连接到该端口，确认其电源和网络状态正常。\n   \n3. **检查光纤或网线质量**  \n   - 若使用的是多模光纤，确保光纤没有损坏、弯曲过度或连接错误。如果问题依旧，尝试更换光纤或网线进行测试。\n\n4. **排查配置设置**  \n   - 确认交换机和对端设备的VLAN、IP地址及端口配置是否一致，确保数据通路正常。\n   \n5. **更新软件版本**  \n   - 检查并更新华三交换机到最新软件版本，安装所有可用补丁以修复潜在问题。\n\n6. **联系技术支持团队**  \n   - 如果上述步骤无法解决问题，建议联系华三的技术支持团队进行进一步诊断和处理。"
            //         },
            //         "done_reason": "stop",
            //         "done": true,
            //         "total_duration": 129272693489,
            //         "load_duration": 38077200,
            //         "prompt_eval_count": 95,
            //         "prompt_eval_duration": 210000000,
            //         "eval_count": 614,
            //         "eval_duration": 129021000000
            //     },
            ],
            // 置底按钮
            setLow: false,
            timer: null,
            think: '',
            isOpenThink: false,
            historyData: [],
            isShow: false,

        }
    },
    watch: { 
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
            this.$nextTick(()=>{
                setTimeout(()=>{
                    this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrapRef.scrollHeight - this.$refs.scrollbarRef.wrapRef.clientHeight);
                    this.isShowSetLow();
                })
            })
        }
    },
    created(){
        this.type = this.model;
    },
    mounted(){
        this.$nextTick(()=>{
                setTimeout(()=>{
                    this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrapRef.scrollHeight - this.$refs.scrollbarRef.wrapRef.clientHeight);
                    this.isShowSetLow();
                })
            })
    },
    methods: {
        dayjs,
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
                item.children = item.children.filter(ele=>{
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
        render2(item){
            this.think = this.getThanks(item);
            let str = '';
            // 先找到第一个<think>标签
            const start = item.indexOf('<think>');
            if(start == -1){
                str = item;
            }else{
                const end = item.indexOf('</think>');
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
            let str = ''
            item.think = this.getThanks(item.content);
            // str = item.content.replace(this.think,'')
            // 先找到第一个<think>标签
            const start = item.content.indexOf('<think>');
            if(start == -1){
                str = item.content;
            }else{
                const end = item.content.indexOf('</think>');
                if(end == -1){
                    str = '';
                }else{
                    str = item.content.substring(end + 9,item.content.length);
                }
            }
            return this.md.render(str)
        },
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
            if(this.loading)return;
            this.question = item;
            
            this.submit();
        },
        // 用户提出问题
        submit(){
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
            this.onSend({...this.current,question:this.question} ,()=>{
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
                this.isOpenThink = true;
                this.currentMessage += item.message;
            }else{

                if(!this.currentMessage){
                    this.currentMessage =  '服务器繁忙，请稍后重试！'
                    this.isOpenThink = false;
                }
                this.dialogueList.push({
                    message: {
                        role: 'assistant',
                        content: this.currentMessage,
                        think_time:item.think_time
                    }, 
                })
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
    mounted() {
        if(this.onload)this.onload();
    }

}
</script>
<style scoped lang="scss">

.t-ai-xiaoxin {
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 16px;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,SF Pro SC,SF Pro Display,SF Pro Icons,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;

}

.t-ai-history{
    width: 300px;
    height: 100%;
    background-color: var(--t-ai-history-bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.5s ;
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
        border-radius: 12px;
        height: 40px;
        margin: 16px 10px 6px;
        &:hover{
            background-color: var(--t-ai-history-hover-bg);
        }
    }
    .t-ai-lately{
        margin: 0 10px;
        flex-shrink: 1;
        flex-grow: 1;
        overflow-y: auto;
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
        justify-content: space-between;
        padding: 0 20px;
        width: calc(100% - 40px);
        box-shadow: var(--el-box-shadow-lighter);
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
                .t-ai-ai-dialogue-logo{
                    height: 40px;
                    border-radius: 50%;
                    position: absolute;
                    left: -60px;
                    top: 0px;
                }
                .t-ai-ai-message{
                    padding: 8px 16px;
                    background-color: var(--t-ai-history-bg);
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
                margin: 10px 60px;
                .t-ai-user-dialogue-logo{
                    height: 40px;
                    border-radius: 50%;
                    position: absolute;
                    right: -50px;
                    top: 0px;
                }
                .t-ai-user-message{
                    padding: 1px 16px;
                    background-color: var(--t-ai-history-bg);
                    border-radius: 20px;
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
        width: calc(100% - 40px);
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        background-color: #fff;
        .t-ai-input-box{
            max-width: 795px; 
            width: 100%;
            border: 1px solid var(--t-ai-line-color);
            border-radius: 28px;
            min-height: 16px;
            display: flex;
            align-items: center;
            padding:0 20px;
            .t-ai-input{
                min-height: 30px;
                font-size: 16px;
                line-height: 30px;
                width: 100px;
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
.t-ai-input-box-new{
    max-width: 795px;
    width: 100%; 
    border: 1px solid var(--t-ai-line-color);
    border-radius: 28px;
    min-height: 16px;
    display: flex;
    align-items: center;
    padding:0 20px;
    .t-ai-input{
        min-height: 30px;
        font-size: 16px;
        line-height: 30px;
        width: 100px;
        flex-shrink: 1;
        flex-grow: 1;
        margin: 10px 0;
    }
}
</style>
<style lang="scss">
@use '@/style.scss'; 
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
}
.t-ai-lately .el-menu-item:hover{
    background-color: var(--t-ai-history-hover-bg);
}
.t-ai-lately .el-menu-item.is-active{
    background-color: #fff;
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